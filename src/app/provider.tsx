'use client';

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useAuthSync } from '@/features/auth/hook/useAuthSync';
import { isProtectedPath, isAuthOnlyPath } from '@/lib/auth/route';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { AppError } from '@/lib/api/error/types';

export const AuthProviders = () => {
    const { initialize } = useAuthStore();
    const { isAuthenticated, loading } = useAuthStore();
    const router = useRouter();
    const hasMountedRef = useRef(false);
    
    // Auth Store 설정 (인증관련)
    useEffect(() => {
        initialize();
    }, [initialize]);

    // Auth Sync 설정 (인증관련)
    useAuthSync();

    // Auth 변경 시 리다이렉트
    useEffect(() => {
        // 로딩 중이거나 이미 인증된 상태라면 리다이렉트하지 않음
        if (loading) return;

        // 첫 마운트에서는 리다이렉트하지 않음
        if (!hasMountedRef.current) {
            hasMountedRef.current = true;
            return;
        }
        
        const currentPath = window.location.pathname;

        // 인증되지 않은 상태이고 현재 페이지가 보호된 경로라면 로그인 페이지로 리다이렉트
        if (!isAuthenticated && isProtectedPath(currentPath)) {
            console.log('미인증 사용자 보호된 경로 접근, 로그인 페이지로 리다이렉트');
            const redirectUrl = new URL('/auth/login', window.location.origin);
            redirectUrl.searchParams.set('redirectTo', currentPath);
            router.replace(redirectUrl.toString());
            return;
        }

        // 인증된 상태이고 인증 전용 경로라면 홈으로 리다이렉트
        if (isAuthenticated && isAuthOnlyPath(currentPath)) {
            console.log('인증된 사용자 인증 전용 페이지 접근, 홈으로 리다이렉트');
            router.replace('/');
        }

    }, [isAuthenticated, loading, router]);

    return null;
};

export const Providers = ({ children }: { children: React.ReactNode }) => {

    // React Query 설정
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                retry: 1, // 통신실패시 재시도회수 
                retryDelay: (i) => Math.min(1000 * 2 ** i, 10000), // 1s → 2s → 4s → 최대 10s
                refetchOnWindowFocus: false, // 포커스 시 불필요한 재조회 방지
                refetchOnReconnect: true, // 네트워크 복구 시 최신화
                staleTime: 1000 * 30, // 캐싱시간 30초 간 fresh상태 / 이 시간 동안은 캐시된 데이터를 사용
                gcTime: 1000 * 60, // 
                networkMode: 'online',
                // 중요: 초기 로딩 중 에러 발생 시 Error Boundary(error.tsx)로 에러 전파
                // throwOnError란? 에러가 발생했을 때 에러 바운더리로 전파할지 여부를 결정하는 옵션
                throwOnError: (error, query) => {
                    // 데이터가 없는 상태에서 에러가 났을 때만 true 반환 -> error.tsx로 이동
                    // 백그라운드 갱신 에러는 false -> 컴포넌트 유지 + 토스트
                    return query.state.data === undefined;
                },
            },
            mutations: {
                retry: 0 // POST/PUT/DELETE 중복 요청 방지
            },
        },
        // 1. 쿼리(조회) 에러 전역 핸들링
        queryCache: new QueryCache({
            onError: (error, query) => {

                const appError = error as unknown as AppError;
                
                // 3. 네트워크 에러 우선 체크
                if (error.message === 'Network request failed' || appError.type === 'NETWORK') {
                    toast.error('ERROR: 네트워크 연결 상태를 확인해 주세요.');
                    return;
                }

                // 2. 데이터가 이미 있는 경우 (백그라운드 갱신 실패) -> 토스트만
                if (query.state.data !== undefined) {
                    toast.error(`ERROR: ${error.message}`);
                    return;
                }

                // 1. 초기 데이터 로딩 실패 -> 토스트 띄우기 (화면은 error.tsx가 처리하겠지만 알림도 줌)
                // 필요 없다면 이 부분은 생략 가능
                toast.error(`ERROR: ${error.message}`);
            },
        }),
        // 2. 뮤테이션(수정/삭제) 에러 전역 핸들링
        mutationCache: new MutationCache({
            onError: (error) => {
                // 4. 사용자 액션 실패 -> 무조건 토스트
                toast.error(`ERROR: ${error.message}`);
            },
        }),
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <AuthProviders />
            <ReactQueryDevtools initialIsOpen={false} /> {/* 개발 도구 활성화, 개발 환경에서만 활성화, initialIsOpen={false} 초기 상태 닫기 */}
        </QueryClientProvider>
    );
};

export default Providers;