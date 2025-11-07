// src/lib/api/error/normalizer/index.ts
// ------------------------------------------------------------
// toAppError 진입점. axios/fetch/일반 Error/unknown을 모두 AppError로 정규화합니다.

import type { AxiosError } from 'axios';
import type {
    AppError,
    NormalizerOptions,
    NetworkErrorSource,
    // ServerErrorSource,
    HttpErrorPayload
} from '@/lib/types/error';
import { DOMAIN_DEFAULT_CODES, DOMAIN_DEFAULT_SEVERITY } from './statusCodeMapper';
// import { resolveMessage } from './messageResolver';
import { isAxiosError, isHttpErrorPayload } from './guards';
import { buildNetworkErrorFromSource } from './builders/networkBuilder';
// import { buildServerErrorFromSource } from './builders/serverBuilder';
import { buildServerErrorFromAxios } from './adapters/axiosAdapter';
import { buildServerErrorFromHttp } from './adapters/fetchAdapter';
import { buildClientError } from './builders/clientBuilder';
import { buildUnknownError } from './builders/unknownBuilder';

// ------------------------------------------------------------
// ensureOptions
// ------------------------------------------------------------
// NormalizerOptions의 기본값을 설정하는 함수입니다.
const ensureOptions = (options?: NormalizerOptions) => {
    const fallbackDomain = options?.fallbackDomain ?? 'SYSTEM';
    return {
        fallbackDomain,
        fallbackCode: options?.fallbackCode ?? DOMAIN_DEFAULT_CODES[fallbackDomain],
        fallbackMessage: options?.fallbackMessage ?? '예상치 못한 오류가 발생했습니다.',
        fallbackStatus: options?.fallbackStatus ?? 500,
        severity: options?.severity // undefined 가능
    };
};

export const toAppError = (
    error: unknown,
    options?: NormalizerOptions
): AppError => {
    const normalizedOptions = ensureOptions(options);

    // axios에서 던진 오류 + 서버 응답이 포함된 경우
    if (isAxiosError(error) && error.response) {
        const appError = buildServerErrorFromAxios(error as AxiosError, {
            domain: normalizedOptions.fallbackDomain,
            fallbackCode: normalizedOptions.fallbackCode,
            fallbackMessage: normalizedOptions.fallbackMessage,
            fallbackStatus: normalizedOptions.fallbackStatus
        });
        appError.severity = normalizedOptions.severity ?? DOMAIN_DEFAULT_SEVERITY[appError.domain];
        return appError;
    }

    // axios에서 던진 오류인데 응답 자체를 받지 못한 네트워크 계열
    if (isAxiosError(error)) {
        const appError = buildNetworkErrorFromSource(
            {
                code: error.code,
                message: error.message,
                request: {
                    url: error.config?.url,
                    method: error.config?.method
                }
            } as NetworkErrorSource,
            normalizedOptions.fallbackMessage
        );
        appError.severity = normalizedOptions.severity ?? DOMAIN_DEFAULT_SEVERITY[appError.domain];
        return appError;
    }

    // fetch에서 던진 오류 + 서버 응답이 포함된 경우
    if (isHttpErrorPayload(error)) {
        const appError = buildServerErrorFromHttp(error as HttpErrorPayload, {
            domain: normalizedOptions.fallbackDomain,
            fallbackCode: normalizedOptions.fallbackCode,
            fallbackMessage: normalizedOptions.fallbackMessage,
            fallbackStatus: normalizedOptions.fallbackStatus
        });
        appError.severity = normalizedOptions.severity ?? DOMAIN_DEFAULT_SEVERITY[appError.domain];
        return appError;
    }

    // 일반 Error 인스턴스(런타임 예외 등)
    if (error instanceof Error) {
        const appError = buildClientError(error, normalizedOptions);
        appError.severity = normalizedOptions.severity ?? DOMAIN_DEFAULT_SEVERITY[appError.domain];
        return appError;
    }

    const appError = buildUnknownError(error, normalizedOptions);
    appError.severity = normalizedOptions.severity ?? DOMAIN_DEFAULT_SEVERITY[appError.domain];
    return appError;
};