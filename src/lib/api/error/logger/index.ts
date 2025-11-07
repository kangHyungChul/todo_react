// src/lib/api/error/logger/index.ts
// ------------------------------------------------------------
// 서버/클라이언트 환경에서 사용하는 로깅 유틸리티입니다.
// severity에 따라 로깅 여부를 결정하고, 환경에 맞는 로깅 방식을 사용합니다.

import type { AppError } from '@/lib/types/error';

export const Logger = {
    /**
     * AppError를 로깅합니다.
     * - 개발 환경: console.error만 사용
     * - 프로덕션: severity가 high/critical인 경우만 로깅
     */
    error: async (error: AppError) => {
        // 개발 환경에서는 모든 에러 출력
        if (process.env.NODE_ENV === 'development') {
            console.error('[Logger]', {
                domain: error.domain,
                code: error.code,
                severity: error.severity,
                message: error.message,
                rawMessage: error.rawMessage,
                statusCode: error.statusCode,
                origin: error.origin,
                details: error.details,
                traceId: error.traceId,
                timestamp: error.timestamp
            });
            return;
        }

        // 프로덕션: high/critical만 로깅
        if (!error.severity || !['HIGH', 'CRITICAL'].includes(error.severity)) {
            return;
        }

        // 환경 구분
        const isServer = typeof window === 'undefined';

        if (isServer) {
            // 서버: console.error (나중에 Slack, Sentry 등 추가 가능)
            console.error('[Server Error]', {
                domain: error.domain,
                code: error.code,
                severity: error.severity,
                message: error.message,
                statusCode: error.statusCode,
                traceId: error.traceId,
                timestamp: error.timestamp
            });

            // TODO: Slack/Sentry 전송
            // await sendToSlack(error);
        } else {
            // 클라이언트: console.error (나중에 Sentry 추가 가능)
            console.error('[Client Error]', {
                domain: error.domain,
                code: error.code,
                severity: error.severity,
                message: error.message,
                statusCode: error.statusCode
            });

            // TODO: Sentry 전송
            // await sendToSentry(error);
        }
    }
};