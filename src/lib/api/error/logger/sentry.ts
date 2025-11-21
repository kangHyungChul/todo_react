// src/lib/api/error/logger/sentry.ts
import * as Sentry from '@sentry/nextjs';
import type { AppError, ErrorSeverity } from '../types';
import { useAuthStore } from '@/features/auth/store/authStore';

/**
 * 통합 에러의 severity를 Sentry의 level로 매핑합니다.
 * - CRITICAL → fatal: 가장 심각한 에러 (앱 종료 가능)
 * - HIGH → error: 중요한 에러
 * - MEDIUM → warning: 경고 수준
 * - LOW → info: 정보성 (또는 warning도 가능)
 * - 없음 → error: 기본값
 */
const mapSeverityToSentryLevel = (severity?: ErrorSeverity): Sentry.SeverityLevel => {
    switch (severity) {
        case 'CRITICAL':
            return 'fatal';
        case 'HIGH':
            return 'error';
        case 'MEDIUM':
            return 'warning';
        case 'LOW':
            return 'info';
        default:
            return 'error'; // severity가 없으면 기본값으로 error 사용
    }
};

/**
 * Sentry에 에러를 전송합니다.
 * 서버/클라이언트 모두에서 사용 가능합니다.
 */
export const sendToSentry = (error: AppError) => {

    // console.log('sendToSentry', error);

    const isServer = typeof window === 'undefined';

    try {

        // 클라이언트 환경오류 기록 시 user정보 있으면 tags에 추가
        if (!isServer) {
            const user = useAuthStore.getState().user;
            if (user) {
                Sentry.setUser({ 
                    id: user.id,
                    email: user.email || undefined,
                });
            }
        }

        // 기본 tags
        const tags: Record<string, string> = {
            domain: error.domain,
            code: error.code,
            origin: error.origin
        };

        // 범용 category 필드를 tag로 추가 (모든 도메인 공통)
        if (error.details?.category) {
            tags.category = String(error.details.category);
        }

        Sentry.captureException(error.originalError || new Error(error.message), {
            level: mapSeverityToSentryLevel(error.severity),
            tags,
            extra: {
                statusCode: error.statusCode,
                rawMessage: error.rawMessage,
                details: error.details,
                traceId: error.traceId,
                timestamp: error.timestamp,
            }
        });
        // console.log('Sentry 전송 성공');
    } catch (err) {
        console.error('Sentry 전송 실패:', err);
    }
};