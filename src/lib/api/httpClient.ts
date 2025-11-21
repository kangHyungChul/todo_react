// src/lib/api/httpClient.ts
import axios, { AxiosInstance } from 'axios';
import { Logger, toAppError, type NormalizerOptions } from './error';
import { ERROR_CODES } from '@/constants/errorCodes';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import type { ErrorSeverity } from './error';

declare module 'axios' {
    export interface AxiosRequestConfig {
        metadata?: {
            // 호출 단계에서 severity 오버라이드 가능
            // 우선순위: metadata.severity > 도메인 기본값
            severity?: ErrorSeverity;
            
            code?: string;
            message?: string;
            
            // 도메인별 세부 분류 도메인별 세부 분류 (예: 'ARRIVAL', 'DEPARTURE', 'LOGIN' 등) /
            // (Sentry tags로 자동 추가됨)
            category?: string;
            
            // 추가 컨텍스트 정보 (자유롭게 추가 가능)
            // 예: endpoint, searchParams, userId 등
            [key: string]: unknown;
        };
    }
}

export const createHttpClient = (options?: NormalizerOptions): AxiosInstance => {
    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        headers: { 'Content-Type': 'application/json' }
    });

    instance.interceptors.response.use(
        (response) => response,
        async (error) => { 
            const metadata = error.config?.metadata;
            
            // createHttpClient 시점의 options와 요청별 metadata를 병합
            // - options가 없으면 toAppError의 getDefaultOptions가 기본값('FLIGHT' 도메인)을 설정
            // metadata의 code, message가 있으면 우선 적용 (오버라이드)
            const mergedOptions: NormalizerOptions = {
                ...options,  // createHttpClient의 기본값
                ...(metadata?.code && { code: metadata.code }),
                ...(metadata?.message && { message: metadata.message }),
                ...(metadata?.severity && { severity: metadata.severity }),
            };
            
            // toAppError 내부의 ensureOptions가 나머지 기본값 처리
            const appError = toAppError(error, mergedOptions);
            
            if (metadata) {
                
                // metadata의 모든 정보를 appError.details에 추
                // 이 정보는 나중에 Sentry에 전송되어 디버깅에 활용됩니다.
                // 예: metadata = { flightType: 'ARRIVAL', endpoint: '/api/flight/arrival' }
                //     → appError.details = { ...기존정보, flightType: 'ARRIVAL', endpoint: '/api/flight/arrival' }
                appError.details = {
                    ...appError.details,  // 기존 details 유지 (toAppError에서 설정된 정보)
                    ...metadata,          // metadata의 모든 필드 추가
                };
                
            }
            // console.log('🚀 [httpClient] appError:', appError);
            // 요청 취소는 로깅하지 않음 (Strict Mode, unmount 등 정상 동작)
            if (appError.code !== 'NETWORK_REQUEST_CANCELLED') {
                await Logger.error(appError);
            }
            throw appError;
        }
    );

    return instance;
};

// 도메인별 기본 인스턴스를 함께 제공
// options 없이 호출 시 toAppError의 ensureOptions가 'SYSTEM' 도메인을 기본값으로 사용
export const httpClient = createHttpClient();

// 항공편 서비스 인스턴스
export const flightHttpClient = createHttpClient({
    domain: 'FLIGHT',
    code: ERROR_CODES.FLIGHT.DEFAULT_ERROR,
    message: ERROR_MESSAGES[ERROR_CODES.FLIGHT.DEFAULT_ERROR],
    status: 500
});

// 인증 서비스 인스턴스
export const authHttpClient = createHttpClient({
    domain: 'AUTH',
    code: ERROR_CODES.AUTH.DEFAULT_ERROR,
    message: ERROR_MESSAGES[ERROR_CODES.AUTH.DEFAULT_ERROR],
    status: 500
});