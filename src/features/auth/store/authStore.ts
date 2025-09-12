// stores/authStore.ts
/*
상태(state) 설명:
- user: Supabase에서 제공하는 User 객체. 로그인한 사용자의 정보(이메일, id 등)를 담음. 로그인하지 않은 경우 null.
- session: Supabase의 Session 객체. 현재 인증 세션(토큰 등) 정보를 담음. 로그인하지 않은 경우 null.
- profile: DB의 profiles 테이블에서 가져온 사용자 프로필 정보. 로그인 후 fetchProfile()로 불러옴. 없으면 null.
- loading: 인증 관련 비동기 작업(로그인, 프로필 조회 등) 진행 중 여부. true면 로딩 상태.
- error: 인증 관련 에러 메시지. 에러 발생 시 문자열, 없으면 null.

액션(action) 설명:
- setAuthState(user, session): 인증 상태(user, session)를 업데이트. 
    // user: Supabase User 객체 또는 null
    // session: Supabase Session 객체 또는 null
    // user가 있으면 fetchProfile()을 호출하여 profile도 갱신, 없으면 profile을 null로 초기화
- setProfile(profile): profile 상태를 업데이트.
    // profile: Profile 객체 또는 null
- setLoading(loading): loading 상태를 업데이트.
    // loading: boolean 값(true/false)
- setError(error): error 상태를 업데이트.
    // error: 에러 메시지 문자열 또는 null

비동기 액션(async action) 설명:
- initialize(): 앱 시작 시 인증 상태를 초기화. 현재 로그인된 사용자가 있으면 user, session, profile을 세팅.
- fetchProfile(): 현재 로그인된 사용자의 profile 정보를 DB에서 조회하여 상태에 저장.
- signOut(): 로그아웃 처리. Supabase 세션을 종료하고 user, session, profile을 모두 null로 초기화.

각 set 함수에서 set({ ... })로 상태를 변경할 때, 
- user에는 Supabase User 객체(로그인 성공 시) 또는 null(로그아웃 시)
- session에는 Supabase Session 객체(로그인 성공 시) 또는 null(로그아웃 시)
- profile에는 DB에서 가져온 Profile 객체(프로필 조회 성공 시) 또는 null(로그아웃/실패 시)
- loading에는 true(비동기 작업 시작 시), false(작업 완료 시)
- error에는 에러 메시지(에러 발생 시) 또는 null(정상 상태)
*/

'use client';

import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import axios from 'axios';
import { isProtectedPath } from '@/lib/auth/route';

interface Profile {
    id: string;
    email: string | null;
    name: string | null;
    nickname: string | null;
    phone: string | null;
    birthday: string | null;
}

interface AuthStore {
    // 상태
    user: User | null; // 현재 로그인한 사용자 정보 (Supabase User 객체)
    // session: Session | null; // 현재 인증 세션 정보 (Supabase Session 객체)
    isAuthenticated: boolean; // 인증 상태 (로그인 여부)
    profile: Profile | null; // DB에서 가져온 사용자 프로필 정보
    loading: boolean; // 인증 관련 비동기 작업 진행 중 여부
    // error: string | null; // 인증 에러 메시지 (전역 관리 필요시 유지, 단순 폼 에러면 제거 가능)
    
    // 액션
    setAuthState: (user: User | null, isAuthenticated: boolean) => void;
    setProfile: (profile: Profile | null) => void;
    setLoading: (loading: boolean) => void;
    // setError: (error: string | null) => void;
    
    // 비동기 액션
    initialize: () => Promise<void>;
    fetchProfile: () => Promise<void>;
    signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string; callbackUrl?: string | null }>;
    signOut: () => Promise<{ ok: boolean; error?: string }>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    user: null,
    isAuthenticated: false,
    profile: null,
    loading: false,
    // error: null,

    // 인증 상태 설정
    setAuthState: (user, isAuthenticated) => {
        set({ user, isAuthenticated, loading: false });
        if (user) {
            get().fetchProfile();
        } else {
            set({ profile: null });
        }
    },

    // 프로필 설정
    setProfile: (profile) => set({ profile }),
    // 로딩 상태 설정
    setLoading: (loading) => set({ loading }),
    // 에러 상태 설정
    // setError: (error) => set({ error }),

    // 초기화
    initialize: async () => {
        try {
            set({ loading: true });
            
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            
            set({ 
                user: session?.user || null, 
                isAuthenticated: !!session?.user,
                loading: false 
            });

            if (session?.user) {
                get().fetchProfile();
            }

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
    fetchProfile: async () => {
        const { user } = get();
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw new Error(error.message || '프로필 조회 실패');
            set({ profile: data });
        } catch (error) {
            console.error('[AuthStore:fetchProfile] 프로필 조회 실패:', error);
            // set({ error: error instanceof Error ? error.message : '프로필 조회 실패' });
        }
    },

    signIn: async (email: string, password: string) => {
        try {
            set({ loading: true });
            const signInData = await axios.post('/api/auth/login', { email, password });

            if (signInData.status !== 200) {
                throw new Error(signInData.data?.message || '로그인에 실패했습니다.');
            }

            // redirectTo 파라미터를 URL에서 추출하여 callbackUrl로 사용
            const urlParams = new URLSearchParams(window.location.search);
            const callbackUrl = urlParams.get('redirectTo') || null;

            await get().initialize();
            set({ loading: false });

            return { ok: true, callbackUrl: callbackUrl };
        }
        catch (error) {
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
            
            await get().initialize();

            set({ loading: false });

            const pathname = window.location.pathname;
            if (isProtectedPath(pathname)) {
                window.location.reload();
            }


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
}));