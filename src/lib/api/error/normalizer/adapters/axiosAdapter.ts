// src/lib/api/error/normalizer/adapters/axiosAdapter.ts
// ------------------------------------------------------------
// AxiosError를 ServerErrorSource 형태로 변환한 뒤, 서버 빌더에 전달해 AppError로 만드는 어댑터입니다.

import type { AxiosError } from 'axios';
import type { AppError, ErrorDomain, ServerErrorSource } from '@/lib/types/error';
import { buildServerErrorFromSource, BuildServerErrorOptions } from '../builders/serverBuilder';

interface BuildServerErrorFromAxiosOptions {
    domain: ErrorDomain;
    fallbackCode: string;
    fallbackMessage: string;
    fallbackStatus: number;
}

export const buildServerErrorFromAxios = (
    error: AxiosError,
    options: BuildServerErrorFromAxiosOptions
): AppError => {
    const serverOptions: BuildServerErrorOptions = {
        fallbackDomain: options.domain,
        fallbackCode: options.fallbackCode,
        fallbackMessage: options.fallbackMessage,
        fallbackStatus: options.fallbackStatus
    };

    return buildServerErrorFromSource(
        {
            response: {
                status: error.response?.status,
                data: error.response?.data as ServerErrorSource['response']['data'],
                headers: error.response?.headers as Record<string, string | undefined> | undefined
            },
            request: {
                url: error.config?.url,
                method: error.config?.method
            }
        },
        serverOptions
    );
};