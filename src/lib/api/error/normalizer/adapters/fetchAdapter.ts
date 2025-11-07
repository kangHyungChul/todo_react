// src/lib/api/error/normalizer/adapters/fetchAdapter.ts
// ------------------------------------------------------------
// fetch 기반으로 던진 HttpErrorPayload를 ServerErrorSource로 변환해 AppError로 만드는 어댑터입니다.

import type { AppError, ErrorDomain, HttpErrorPayload, ServerErrorSource } from '@/lib/types/error';
import { buildServerErrorFromSource, BuildServerErrorOptions } from '../builders/serverBuilder';

interface BuildServerErrorFromHttpOptions {
    domain: ErrorDomain;
    fallbackCode: string;
    fallbackMessage: string;
    fallbackStatus: number;
}

export const buildServerErrorFromHttp = (
    error: HttpErrorPayload,
    options: BuildServerErrorFromHttpOptions
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
                data: (error.response?.data ?? error.body) as ServerErrorSource['response']['data'],
                headers: error.response?.headers
            },
            request: error.request
        },
        serverOptions
    );
};