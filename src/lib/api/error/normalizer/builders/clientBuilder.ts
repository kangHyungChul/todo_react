// src/lib/api/error/normalizer/builders/clientBuilder.ts
// ------------------------------------------------------------
// - 브라우저/런타임에서 throw된 일반 Error(AppError.origin === 'client')를 AppError로 감쌉니다.
// - 주로 개발 중 발생한 예외나, 클라이언트 로직에서 직접 throw한 오류를 처리합니다.

import type { AppError, NormalizerOptions } from '@/lib/types/error';
import { DOMAIN_DEFAULT_CODES } from '../statusCodeMapper';
import { resolveMessage } from '../messageResolver';

// ------------------------------------------------------------
// Error 인스턴스를 AppError로 변환합니다.
// - fallback 옵션을 사용해 도메인/코드/메시지를 채웁니다.
// - 원본 Error의 stack과 message는 details/rawMessage로 보존합니다.
export const buildClientError = (
    error: Error,
    options: NormalizerOptions
): AppError => {
    const fallbackMessage = options.fallbackMessage ?? '예상치 못한 오류가 발생했습니다.';

    const message = resolveMessage({
        code: options.fallbackCode,    // 호출자가 지정한 코드가 있을 수 있음
        fallbackMessage,               // 코드가 없을 때 보여줄 문구
        serverMessage: error.message   // 원본 Error 메시지 (디버깅용)
    });

    return {
        domain: options.fallbackDomain ?? 'CLIENT',
        code: options.fallbackCode ?? DOMAIN_DEFAULT_CODES.CLIENT,
        message,
        rawMessage: error.message,
        statusCode: options.fallbackStatus ?? 500,
        origin: 'client',
        details: {
            stack: error.stack,
            rawMessage: error.message
        },
        timestamp: new Date().toISOString(),
        originalError: error
    };
};