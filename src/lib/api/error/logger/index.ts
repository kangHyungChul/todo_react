// src/lib/api/error/logger/index.ts
// ------------------------------------------------------------
// 서버/클라이언트 환경에서 사용하는 로깅 유틸리티입니다.
// severity에 따라 로깅 여부를 결정하고, 환경에 맞는 로깅 방식을 사용합니다.

import type { AppError } from '../types';
import { sendToSlack } from './slack';
import { sendToSentry } from './sentry';

export const Logger = {
    /**
     * AppError를 로깅합니다.
     * - 개발 환경: console.error만 사용
     * - 프로덕션: severity가 high/critical인 경우만 로깅
     */
    error: async (error: AppError) => {

        // 환경 구분
        const isServer = typeof window === 'undefined';
        
        // 개발 환경에서는 모든 에러 출력
        if (process.env.NODE_ENV === 'development') {
            console.error(`[Logger - ${error.origin}]`, {
                domain: error.domain, // 에러 도메인 (AUTH, FLIGHT, NETWORK, SERVER, CLIENT, VALIDATION, BUSINESS, SYSTEM)
                code: error.code, // 에러 코드 (도메인별 고유 코드 ex) SERVER_DEFAULT_ERROR, CLIENT_DEFAULT_ERROR, NETWORK_DEFAULT_ERROR, VALIDATION_DEFAULT_ERROR, BUSINESS_DEFAULT_ERROR, SYSTEM_DEFAULT_ERROR)
                severity: error.severity, // 에러 심각도 (LOW, MEDIUM, HIGH, CRITICAL)
                message: error.message, // 사용자에게 노출할 메시지(초기엔 서버 문자열 그대로 사용)
                rawMessage: error.rawMessage, // 서버/클라이언트가 전달한 원본 메시지 (디버깅용 보존)
                statusCode: error.statusCode, // HTTP 상태 코드 (없으면 0 등으로 설정 가능)
                origin: error.origin, // 에러 발생 출처 'server' | 'client' | 'network' | 'unknown'
                details: error.details, // 디버깅용 부가 정보 (요청 URL, 응답 body 등)
                traceId: error.traceId, // 서버/외부 API가 내려준 추적 ID
                timestamp: error.timestamp, // 에러 감지 시간 (ISO 문자열 등)
            });
            // console.log('🚀 [Logger.error] sendToSlack 호출 전 error.message:', error.message);
            sendToSentry(error);
            // console.log('🚀 [Logger.error] sendToSentry 호출 후 error.message:', error.message);
            await sendToSlack(error);
            return;
        }

        // 프로덕션: high/critical만 로깅
        if (!error.severity || !['HIGH', 'CRITICAL'].includes(error.severity)) {
            return;
        }

        if (isServer) {
            // 서버: console.error (나중에 Slack, Sentry 등 추가 가능)
            console.error('[Server Error]', {
                domain: error.domain,
                code: error.code,
                severity: error.severity,
                message: error.message,
                statusCode: error.statusCode,
                origin: error.origin,
                traceId: error.traceId,
                details: error.details,
                timestamp: error.timestamp,
            });

            // Slack 전송 (실패해도 로깅은 계속 진행)
            try {
                await sendToSlack(error);
            } catch (slackError) {
                console.error('Slack 전송 중 에러 발생:', slackError);
            }
        } else {
            // 클라이언트: console.error (나중에 Sentry 추가 가능)
            console.error('[Client Error]', {
                domain: error.domain,
                code: error.code,
                severity: error.severity,
                message: error.message,
                statusCode: error.statusCode,
                origin: error.origin,
                traceId: error.traceId,
                details: error.details,
                timestamp: error.timestamp,
            });

            // Sentry 전송
            sendToSentry(error);
        }
    }
};