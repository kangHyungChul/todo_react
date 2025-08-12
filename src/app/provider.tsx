'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export const Providers = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                retry: 1, // 통신실패시 재시도회수 
                retryDelay: (i) => Math.min(1000 * 2 ** i, 10000), // 1s → 2s → 4s → 최대 10s
                refetchOnWindowFocus: false, // 포커스 시 불필요한 재조회 방지
                refetchOnReconnect: true, // 네트워크 복구 시 최신화
                staleTime: 1000 * 30, // 캐싱시간 30초 간 fresh상태 / 이 시간 동안은 캐시된 데이터를 사용
                gcTime: 1000 * 60, // 3분 캐시 후 메모리 제거
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
            <ReactQueryDevtools initialIsOpen={false} /> {/* 개발 도구 활성화, 개발 환경에서만 활성화, initialIsOpen={false} 초기 상태 닫기 */}
        </QueryClientProvider>
    );
};

export default Providers;