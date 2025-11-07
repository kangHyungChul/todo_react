// src/lib/api/serverFetch.ts
// ------------------------------------------------------------
// - Next.js Route API 등 서버 환경에서 fetch를 사용할 때 통합 에러 로직을 적용하기 위한 헬퍼입니다.
// - fetch 호출 → 실패 시 HttpErrorPayload 구성 → toAppError 변환 → throw
// - 서버 전용 로깅/메트릭 후킹도 추가 가능합니다.

import { toAppError } from './error-normalizer';
import { Logger } from './error/logger';
import type { NormalizerOptions, HttpErrorPayload } from '@/lib/types/error';
import { ERROR_CODES } from '@/constants/errorCodes';
import { ERROR_MESSAGES } from '@/constants/errorMessages';

// ------------------------------------------------------------
// safeServerFetch 옵션 타입
// - RequestInit의 모든 옵션을 받을 수 있고, 추가로 fallback 옵션을 지정할 수 있습니다.
export interface SafeServerFetchOptions extends RequestInit {
    fallbackOptions?: NormalizerOptions;
}

// ------------------------------------------------------------
// 서버용 fetch 래퍼 함수
// - fetch 호출 후 응답이 실패하면 HttpErrorPayload를 구성해 toAppError로 변환합니다.
// - 네트워크 오류나 JSON 파싱 오류도 모두 AppError로 정규화합니다.
export const safeServerFetch = async <T = unknown>(
    url: string,
    options?: SafeServerFetchOptions
): Promise<T> => {
    const { fallbackOptions, ...fetchOptions } = options ?? {};

    // 기본 fallback 옵션 설정
    const normalizedOptions: NormalizerOptions = {
        fallbackDomain: fallbackOptions?.fallbackDomain ?? 'SERVER',
        fallbackCode: fallbackOptions?.fallbackCode ?? ERROR_CODES.SERVER.DEFAULT_ERROR,
        fallbackMessage: fallbackOptions?.fallbackMessage ?? ERROR_MESSAGES[ERROR_CODES.SERVER.DEFAULT_ERROR],
        fallbackStatus: fallbackOptions?.fallbackStatus ?? 500,
        severity: fallbackOptions?.severity // 생략 가능
    };

    try {
        // 1) fetch 호출
        const res = await fetch(url, fetchOptions);

        // 2) 응답이 성공이 아닌 경우 (4xx, 5xx 등)
        if (!res.ok) {
            let responseData: unknown;

            try {
                const text = await res.text();
                responseData = text ? JSON.parse(text) : null;
            } catch {
                responseData = null;
            }

            // HttpErrorPayload 구성
            const httpError: HttpErrorPayload = {
                response: {
                    status: res.status,
                    statusText: res.statusText,
                    headers: Object.fromEntries(res.headers.entries()),
                    data: responseData
                },
                request: {
                    url,
                    method: fetchOptions?.method ?? 'GET'
                }
            };

            // toAppError로 변환 후 throw
            const appError = toAppError(httpError, normalizedOptions);
            await Logger.error(appError);
            throw appError;
        }

        // 3) 성공 응답 파싱
        const contentType = res.headers.get('content-type');
        
        if (contentType?.includes('application/json')) {
            return await res.json() as T;
        }

        // JSON이 아닌 경우 text로 반환
        return await res.text() as T;

    } catch (error) {
        // 4) 네트워크 오류나 기타 예외 처리
        // - 이미 AppError로 변환된 경우 그대로 throw
        // - 그 외의 경우 toAppError로 변환
        if (error && typeof error === 'object' && 'domain' in error && 'code' in error) {
            throw error;
        }

        const appError = toAppError(error, normalizedOptions);
        await Logger.error(appError);
        throw appError;
    }
};

// ------------------------------------------------------------
// 도메인별 전용 헬퍼 (선택 사항)
// - 특정 도메인에서 자주 사용하는 경우 미리 설정된 헬퍼를 만들 수 있습니다.

export const safeFlightFetch = <T = unknown>(url: string, options?: Omit<SafeServerFetchOptions, 'fallbackOptions'>) => {
    return safeServerFetch<T>(url, {
        ...options,
        fallbackOptions: {
            fallbackDomain: 'FLIGHT',
            fallbackCode: ERROR_CODES.FLIGHT.DEFAULT_ERROR,
            fallbackMessage: ERROR_MESSAGES[ERROR_CODES.FLIGHT.DEFAULT_ERROR],
        }
    });
};

export const safeAuthFetch = <T = unknown>(url: string, options?: Omit<SafeServerFetchOptions, 'fallbackOptions'>) => {
    return safeServerFetch<T>(url, {
        ...options,
        fallbackOptions: {
            fallbackDomain: 'AUTH',
            fallbackCode: ERROR_CODES.AUTH.DEFAULT_ERROR,
            fallbackMessage: ERROR_MESSAGES[ERROR_CODES.AUTH.DEFAULT_ERROR],
        }
    });
};