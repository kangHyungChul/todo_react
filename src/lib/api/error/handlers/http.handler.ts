// src/lib/api/error/handlers/http.handler.ts
// ------------------------------------------------------------
// HTTP 에러 처리 핸들러입니다.
//
// 목적:
// - AxiosError와 HttpErrorPayload를 통합 처리
// - 서버가 HTTP 응답을 내려준 에러를 AppError로 변환
// - Strategy Pattern: HTTP 에러 처리 전략
//
// 사용 시나리오:
// - Axios 인스턴스에서 throw된 에러 (error.response가 있는 경우)
// - Fetch 기반 클라이언트에서 throw된 에러 (HttpErrorPayload)
// - 서버가 4xx, 5xx 응답을 내려준 경우
//
// 처리 과정:
// 1. 서버 응답에서 domain, code, message 추출
// 2. 상태코드 기반 ErrorType, origin, code 결정
// 3. 메시지 해석 및 AppError 생성

import type { AxiosError } from 'axios';
import type { AppError, NormalizerOptions, HttpErrorPayload, ErrorDomain, HttpStatusCode } from '../types';
import { mapStatusToErrorType, mapStatusToOrigin, mapStatusToCode, DOMAIN_DEFAULT_CODES } from '../mappers/status.mapper';
import { resolveMessage } from '../mappers/message.mapper';
import { getDefaultOptions } from '../utils/defaults';

// ------------------------------------------------------------
// handleHttpError
// ------------------------------------------------------------
// AxiosError 또는 HttpErrorPayload를 AppError로 변환하는 함수입니다.
//
// Strategy Pattern:
// - HTTP 에러 처리 전략을 캡슐화
// - Axios와 Fetch를 통합 처리하여 일관성 유지
//
// 우선순위:
// 1. 서버 응답의 domain, code, message (가장 정확)
// 2. options에서 지정한 domain, code, message
// 3. 상태코드 기반 추정 (ErrorType, origin, code)
// 4. 도메인 기본값
//
// 사용 예시:
// - const appError = handleHttpError(axiosError, { domain: 'FLIGHT' });
// - const appError = handleHttpError(httpErrorPayload, { domain: 'AUTH' });
//
// 반환값:
// - AppError: 정규화된 에러 객체
export const handleHttpError = (
    error: AxiosError | HttpErrorPayload,
    options?: NormalizerOptions
): AppError => {
    // 기본값 설정
    const defaults = getDefaultOptions(options);
    
    // AxiosError와 HttpErrorPayload를 통합 처리
    // - AxiosError: error.response
    // - HttpErrorPayload: error.response
    const response = 'response' in error ? error.response : error.response;
    const body = (response?.data && typeof response?.data === 'object' && !Array.isArray(response.data))
        ? response.data as { domain?: string; code?: string; message?: string; traceId?: string }
        : {};
    
    // 요청 정보 추출
    const request = 'config' in error 
        ? { url: error.config?.url, method: error.config?.method }
        : error.request;
    
    // 1) 도메인 결정: 서버 응답 > options > 기본값
    const domain = (body.domain as ErrorDomain | undefined) ?? defaults.domain;
    
    // 2) 상태코드 결정: 서버 응답 > options > 기본값
    const status = (response?.status as HttpStatusCode | undefined) ?? defaults.status;
    
    // 3) ErrorType 결정: HTTP 상태 코드 기반으로 분류
    // - 500 이상 → SYSTEM
    // - 400, 422 → VALIDATION
    // - 400 이상 → BUSINESS
    const errorType = mapStatusToErrorType(status);
    
    // 4) origin 결정: HTTP 상태 코드 기반으로 결정
    // - 500 이상 → 'server'
    // - 400 이상 → 'client'
    const origin = mapStatusToOrigin(status);
    
    // 5) 에러 코드 결정: 서버 응답 > options > 상태코드 기반 추정 > 도메인 기본값
    const code =
        (body.code as string | undefined) ??        // 1순위: 서버가 명시적으로 보낸 code
        options?.code ??                            // 2순위: options에서 지정한 code
        mapStatusToCode(status, domain) ??          // 3순위: 상태코드 기반 추정
        DOMAIN_DEFAULT_CODES[domain];               // 4순위: 도메인 기본값
    
    // 6) 메시지 해석: 서버 메시지 > 코드 기반 메시지 > options 메시지 > 기본 메시지
    const rawMessage = typeof body.message === 'string' ? body.message : undefined;
    const message = resolveMessage({
        code,
        message: options?.message,
        serverMessage: rawMessage
    });
    
    // 7) traceId 추출: 헤더의 x-trace-id > 바디의 traceId
    const traceIdFromHeaders = 
        typeof response?.headers?.['x-trace-id'] === 'string'
            ? response.headers['x-trace-id']
            : undefined;
    const traceId = traceIdFromHeaders ?? body.traceId;
    
    // 8) AppError 생성
    return {
        domain,
        type: errorType,
        code,
        message,
        rawMessage,
        statusCode: status,
        origin,
        details: {
            url: request?.url,
            method: request?.method,
            data: body,
            rawMessage
        },
        traceId,
        timestamp: new Date().toISOString()
    };
};

