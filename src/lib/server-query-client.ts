// lib/server-query-client.ts
import { QueryClient } from '@tanstack/react-query';

let serverQueryClient: QueryClient | undefined = undefined;

const getServerQueryClient = () => {
    if (!serverQueryClient) {
        serverQueryClient = new QueryClient();
    }
    return serverQueryClient;
};

export default getServerQueryClient;