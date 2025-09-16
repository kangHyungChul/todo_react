'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useAuthSync } from '@/features/auth/hook/useAuthSync';
import { isProtectedPath, isAuthOnlyPath } from '@/lib/auth/route';
import { useRouter } from 'next/navigation';

export const AuthProviders = () => {

    // Auth Store 설정 (인증관련)
    const { initialize } = useAuthStore();
    useEffect(() => {
        initialize();
    }, [initialize]);

    // Auth Sync 설정 (인증관련)
    useAuthSync();

    // Auth 변경 시 리다이렉트
    const { isAuthenticated, loading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        // 로딩 중이거나 이미 인증된 상태라면 리다이렉트하지 않음
        if (loading) return;
        
        const currentPath = window.location.pathname;

        // 인증되지 않은 상태이고 현재 페이지가 보호된 경로라면 로그인 페이지로 리다이렉트
        if (!isAuthenticated) {
            if (isProtectedPath(currentPath)) {
                console.log('리다이렉트');
                const redirectUrl = new URL('/auth/login', window.location.origin);
                redirectUrl.searchParams.set('redirectTo', currentPath);
                router.replace(redirectUrl.toString());
            }
        }

        // 인증된 상태이고 공개경로가 아니라면 홈으로 리다이렉트
        if (isAuthenticated) {
            if (isAuthOnlyPath(currentPath)) {
                console.log('리다이렉트2');
                const redirectUrl = new URL('/', window.location.origin);
                router.replace(redirectUrl.toString());
            }
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
            },
            mutations: {
                retry: 0 // POST/PUT/DELETE 중복 요청 방지
            }
        }
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