// lib/server-query-client.ts
// ssr 환경에서 사용하는 queryClient 생성 함수

import { QueryClient } from '@tanstack/react-query';

let serverQueryClient: QueryClient | undefined = undefined;

const getServerQueryClient = () => {
    if (!serverQueryClient) {
        serverQueryClient = new QueryClient();
    }
    return serverQueryClient;
};

export default getServerQueryClient;