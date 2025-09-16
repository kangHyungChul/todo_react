'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { supabase } from '@/lib/supabase/client';
import type { User/*, Session */} from '@supabase/supabase-js';
import axios from 'axios';
// import { isProtectedPath } from '@/lib/auth/route';
import { postAuthMessage, type AuthReason } from '../utils/authChannel';

interface AuthState {
    // 상태
    user: User | null; // 현재 로그인한 사용자 정보 (Supabase User 객체)
    // session: Session | null; // 현재 인증 세션 정보 (Supabase Session 객체)
    isAuthenticated: boolean; // 인증 상태 (로그인 여부)
    // profile: Profile | null; // DB에서 가져온 사용자 프로필 정보
    loading: boolean; // 인증 관련 비동기 작업 진행 중 여부
    // error: string | null; // 인증 에러 메시지 (전역 관리 필요시 유지, 단순 폼 에러면 제거 가능)
}

interface AuthActions {
    // 액션
    setAuthState: (
        user: User | null, 
        isAuthenticated: boolean,
        opts?: { broadcast?: boolean; reason?: AuthReason }
    ) => void;
    // setProfile: (profile: Profile | null) => void;
    setLoading: (loading: boolean) => void;
    // setError: (error: string | null) => void;
    
    // 비동기 액션
    initialize: (opts?: { silent?: boolean }) => Promise<void>;

    // fetchProfile: () => Promise<void>;
    signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string; callbackUrl?: string | null }>;
    signOut: () => Promise<{ ok: boolean; error?: string }>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
    devtools((set, get) => ({
        user: null,
        isAuthenticated: false,
        // profile: null,
        loading: false,
        // error: null,

        // 인증 상태 설정
        setAuthState: (user, isAuthenticated, opts) => {

            set({ 
                user, 
                isAuthenticated, 
                loading: false 
            });

            const shouldBroadcast = opts?.broadcast ?? true;
            if (shouldBroadcast) {
                postAuthMessage(opts?.reason ?? (isAuthenticated ? 'login' : 'logout'));
            }

            // if (user) {
            //     get().fetchProfile();
            // } else {
            //     set({ profile: null });
            // }
        },

        // 프로필 설정
        // setProfile: (profile) => set({ profile }),
        // 로딩 상태 설정
        setLoading: (loading) => set({ loading }),
        // 에러 상태 설정
        // setError: (error) => set({ error }),

        // 초기화
        initialize: async (opts) => {
            try {
                set({ loading: true });
                
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;

                get().setAuthState(
                    session?.user || null, 
                    !!session?.user,
                    { broadcast: !opts?.silent }
                );

                // if (session?.user) {
                //     get().fetchProfile();
                // }

                supabase.auth.onAuthStateChange((event, session) => {
                    get().setAuthState(session?.user || null, !!session?.user);
                });

            } catch (error) {
                console.error('[AuthStore:initialize] 초기화 실패:', error);
                set({ 
                    loading: false, 
                    // error: error instanceof Error ? error.message : '초기화 실패' 
                });
            }
        },

        // 프로필 조회
        // fetchProfile: async () => {
        //     const { user } = get();
        //     if (!user) return;

        //     try {
        //         const { data, error } = await supabase
        //             .from('profiles')
        //             .select('*')
        //             .eq('id', user.id)
        //             .single();

        //         if (error) throw new Error(error.message || '프로필 조회 실패');
        //         set({ profile: data });
        //     } catch (error) {
        //         console.error('[AuthStore:fetchProfile] 프로필 조회 실패:', error);
        //         // set({ error: error instanceof Error ? error.message : '프로필 조회 실패' });
        //     }
        // },

        signIn: async (email: string, password: string) => {
            try {
                set({ loading: true });
                const signInData = await axios.post('/api/auth/login', { email, password });

                if (signInData.status !== 200) {
                    throw new Error(signInData.data?.message || '로그인에 실패했습니다.');
                }

                const { user } = signInData.data || null;
                // await get().initialize();

                if (user) {
                    get().setAuthState(user, true, { reason: 'login' });
                } else {
                    // 혹시 API에서 user를 안 주면 그때만 세션 확인
                    const { data: { session } } = await supabase.auth.getSession();
                    get().setAuthState(session?.user || null, !!session?.user, { reason: 'login' });
                }

                // redirectTo 파라미터를 URL에서 추출하여 callbackUrl로 사용
                const urlParams = new URLSearchParams(window.location.search);
                const callbackUrl = urlParams.get('redirectTo') || null;

                return { ok: true, callbackUrl: callbackUrl };

            } catch (error) {
                let errorMessage = '로그인에 실패했습니다.';
                
                if (axios.isAxiosError(error)) {
                    console.error('[AuthStore:signIn] 로그인 API 에러:', {
                        status: error.response?.status,
                        data: error.response?.data,
                        message: error.message,
                    });
                    
                    const responseData = error.response?.data;
                    if (responseData?.message) {
                        // 서버에서 명시적으로 message를 내려준 경우
                        errorMessage = responseData.message;
                    } else {
                        // supabase에서 내려주는 에러 메시지(혹은 기타 상황)
                        errorMessage = '로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.';
                    }
                } else {
                    console.error('[AuthStore:signIn] 예상치 못한 에러:', error);
                    errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
                }
                
                set({
                    // error: errorMessage,
                    loading: false,
                });
                
                return { ok: false, error: errorMessage };
            }
        },

        // 로그아웃
        signOut: async () => {
            try {

                set({ loading: true });
                const signOutData = await axios.post('/api/auth/logout');
                
                if (signOutData.status !== 200) {
                    throw new Error(signOutData.data?.message || '로그아웃에 실패했습니다.');
                }
                
                get().setAuthState(null, false, { reason: 'logout' });

                // const pathname = window.location.pathname;
                // if (isProtectedPath(pathname)) {
                //     window.location.reload();
                // }

                return { ok: true };
            } catch (error) {
                let errorMessage = '로그아웃에 실패했습니다.';

                if (axios.isAxiosError(error)) {
                    console.error('[AuthStore:signOut] Axios 에러:', {
                        status: error.response?.status,
                        data: error.response?.data,
                        message: error.message,
                    });
                    const responseData = error.response?.data;
                    if (responseData?.message) {
                        // 서버에서 명시적으로 message를 내려준 경우
                        errorMessage = responseData.message;
                    } else {
                        // supabase에서 내려주는 에러 메시지(혹은 기타 상황)
                        errorMessage = '로그아웃에 실패했습니다.';
                    }
                } else {
                    console.error('[AuthStore:signOut] 예상치 못한 에러:', error);
                    errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
                }
                
                set({
                    // error: errorMessage,
                    loading: false,
                });
                
                return { ok: false, error: errorMessage };
            }
        }
    }),
    {
        name: 'AuthStore'
    }
));