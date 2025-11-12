// src/lib/api/error/logger/sentry.ts
import * as Sentry from '@sentry/nextjs';
import type { AppError } from '@/lib/types/error';

/**
 * Sentry에 에러를 전송합니다.
 * 서버/클라이언트 모두에서 사용 가능합니다.
 */
export const sendToSentry = (error: AppError) => {
    console.log('sendToSentry', error);
    try {
        Sentry.captureException(error.originalError || new Error(error.message), {
            level: error.severity === 'CRITICAL' ? 'fatal' : 'error',
            tags: {
                domain: error.domain,
                code: error.code,
                origin: error.origin
            },
            extra: {
                statusCode: error.statusCode,
                rawMessage: error.rawMessage,
                details: error.details,
                traceId: error.traceId,
                timestamp: error.timestamp
            }
        });
        console.log('Sentry 전송 성공');
    } catch (err) {
        console.error('Sentry 전송 실패:', err);
    }
};