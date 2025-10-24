// src/common/api/error-normalizer.ts

import type { AxiosError } from 'axios';
import type { AppError } from '@/lib/types/error';
import { ERROR_CODES } from '@/constants/errorCodes';
import type { ErrorDomain, HttpStatusCode } from '@/lib/types/error';

// axios, fetch, unknown 에러 → AppError 변환
export const toAppError = (e: unknown, fallbackCode = ERROR_CODES.AUTH.INVALID_CREDENTIALS): AppError => {
    // axios 에러인 경우
    if (isAxiosError(e)) {
        const domain = (e.response?.data?.domain as ErrorDomain) ?? 'AUTH';
        const statusCode = (e.response?.status as HttpStatusCode) ?? 500;
        const code = mapStatusToCode(statusCode, fallbackCode);
        const message = e.response?.data?.message || e.message || 'network error';
        return {
            domain,
            code,
            statusCode,
            message,
            // userMessageKey: mapCodeToUserKey(code),
            details: {
                url: e.config?.url,
                method: e.config?.method,
                data: e.response?.data
            },
            traceId: e.response?.headers?.['x-trace-id'] ?? null,
            cause: 'axios'
        };
    }

    // 일반 Error 인스턴스
    if (e instanceof Error) {
        return {
            domain: 'AUTH',
            code: fallbackCode,
            statusCode: 500,
            message: e.message,
            // userMessageKey: mapCodeToUserKey(fallbackCode),
            details: { raw: e },
            traceId: undefined,
            cause: 'error'
        };
    }

    // 완전히 알 수 없는 경우
    return {
        domain: 'AUTH',
        code: fallbackCode,
        statusCode: 500,
        message: 'unknown error',
        // userMessageKey: mapCodeToUserKey(fallbackCode),
        details: { raw: e },
        traceId: undefined,
        cause: 'unknown'
    };
};

// 응답 바디에서 사용하는 최소 필드만 명시한 타입
type ApiErrorBody = {
    // 서버에서 내려줄 수 있는 domain 식별자 (예: 'AUTH', 'FLIGHT' 등)
    domain?: string;
    // 서버가 내려준 원본 메시지
    message?: string;
    // 그 외 추가 필드 보존
    [key: string]: unknown;
};


// axios 전용 type guard
const isAxiosError = (e: unknown): e is AxiosError<ApiErrorBody> =>
    !!(e && typeof e === 'object' && (e as AxiosError).isAxiosError);

// 상태 코드 → 에러 코드 매핑
const mapStatusToCode = (status: number, fallback: string): string => {
    if (status === 400) return ERROR_CODES.AUTH.INVALID_CREDENTIALS ?? fallback;
    if (status === 401) return ERROR_CODES.AUTH.UNAUTHORIZED ?? fallback;
    if (status === 403) return ERROR_CODES.AUTH.PERMISSION_DENIED ?? fallback;
    if (status === 404) return 'NOT_FOUND';
    if (status >= 500) return 'INTERNAL';
    return fallback;
};

// 에러 코드 → 사용자 메시지 키(i18n)
// const mapCodeToUserKey = (code: string): string => {
//     if (code.includes('UNAUTHORIZED')) return 'error.auth.required';
//     if (code.includes('PERMISSION')) return 'error.auth.permission';
//     if (code.includes('INVALID')) return 'error.validation';
//     if (code.includes('NOT_FOUND')) return 'error.notFound';
//     if (code === 'INTERNAL') return 'error.internal';
//     return 'error.unknown';
// };
