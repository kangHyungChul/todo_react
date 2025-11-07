// src/lib/api/error/normalizer/builders/unknownBuilder.ts
// ------------------------------------------------------------
// - 문자열, 숫자, 객체 등 정체를 알 수 없는 값이 던져졌을 때(AppError.origin === 'unknown')
//   최소한의 fall back 정보를 채워 AppError로 감쌉니다.

import type { AppError, NormalizerOptions } from '@/lib/types/error';
import { DOMAIN_DEFAULT_CODES } from '../statusCodeMapper';

// ------------------------------------------------------------
// unknown 값을 AppError로 감싸는 함수
// - 문자열이면 사용자 문구로 간주하여 message/rawMessage에 그대로 사용합니다.
// - 그 외 타입은 fallbackMessage를 사용하고, 원본 값은 details.raw에 저장합니다.
export const buildUnknownError = (
    error: unknown,
    options: NormalizerOptions
): AppError => {
    const fallbackMessage = options.fallbackMessage ?? '예상치 못한 오류가 발생했습니다.';
    const domain = options.fallbackDomain ?? 'SYSTEM';
    const fallbackCode = options.fallbackCode ?? DOMAIN_DEFAULT_CODES[domain];
    const statusCode = options.fallbackStatus ?? 500;

    const rawMessage = typeof error === 'string' && error.trim().length > 0 ? error : undefined;
    const message = rawMessage ?? fallbackMessage;

    return {
        domain,
        code: fallbackCode,
        message,
        rawMessage,
        statusCode,
        origin: 'unknown',
        details: {
            raw: error,
            rawMessage
        },
        timestamp: new Date().toISOString()
    };
};