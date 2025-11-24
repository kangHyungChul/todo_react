// src/lib/api/error/handlers/runtime.handler.ts
// ------------------------------------------------------------
// 런타임 에러 처리 핸들러입니다.
//
// 목적:
// - 일반 Error 인스턴스 처리
// - 알 수 없는 값(unknown) 처리
// - Strategy Pattern: 런타임 에러 처리 전략
//
// 사용 시나리오:
// - 일반 Error 인스턴스 (throw new Error('...'))
// - TypeError, ReferenceError 등
// - 문자열, 숫자, 객체 등 알 수 없는 값
//
// 처리 과정:
// 1. Error 인스턴스인지 확인
// 2. ErrorType: 'RUNTIME', origin: 실행 환경 기반 결정
// 3. 메시지 해석 및 AppError 생성

import type { AppError, AppErrorOrigin, NormalizerOptions } from '../types';
import { resolveMessage } from '../mappers/message.mapper';
import { getDefaultOptions } from '../utils/defaults';
import { mapStatusToErrorType, mapStatusToOrigin, ERROR_TYPE_DEFAULT_CODES } from '../mappers/status.mapper';

// ------------------------------------------------------------
// handleRuntimeError
// ------------------------------------------------------------
// Error 인스턴스 또는 알 수 없는 값을 AppError로 변환하는 함수입니다.
//
// Strategy Pattern:
// - 런타임 에러 처리 전략을 캡슐화
// - 일반 Error와 알 수 없는 값을 통합 처리
//
// 특징:
// - Error 인스턴스: stack trace 보존
// - 알 수 없는 값: details.raw에 원본 값 보존
// - origin: 실행 환경 기반 결정 (isServer)
//
// 사용 예시:
// - const appError = handleRuntimeError(new Error('Something went wrong'), { domain: 'FLIGHT' });
// - const appError = handleRuntimeError('Unknown error', { domain: 'AUTH' });
//
// 반환값:
// - AppError: 정규화된 에러 객체
export const handleRuntimeError = (
    error: Error | unknown,
    options?: NormalizerOptions
): AppError => {
    // 기본값 설정
    const defaults = getDefaultOptions(options);
    
    // 실행 환경 확인 (서버/클라이언트)
    const isServer = typeof window === 'undefined';

    // 1. options.type 지정 시 최우선
    // 2. status가 있으면 그에 맞춰 추론 (예: 400 -> VALIDATION)
    // 3. 없으면 기본값 RUNTIME
    const errorType = 
        defaults.type ?? 
        (options?.status ? mapStatusToErrorType(options.status) : 'RUNTIME');

    // [개선] Origin 결정: status 기반 추론 > 실행 환경
    // - status가 명시된 경우(예: 400)에는 해당 의미를 따름 (client error)
    const origin: AppErrorOrigin = options?.status 
        ? mapStatusToOrigin(options.status) 
        : (isServer ? 'server' : 'client');
    
    // Error 인스턴스인 경우
    if (error instanceof Error) {
        // 에러 코드 결정: options > RUNTIME 기본값
        const code = options?.code ?? ERROR_TYPE_DEFAULT_CODES.RUNTIME;
        
        // 메시지 해석: 코드 기반 메시지 > options 메시지 > Error.message > 기본 메시지
        const message = resolveMessage({
            code,
            message: options?.message,
            serverMessage: error.message
        });
        
        // AppError 생성
        return {
            domain: defaults.domain,        // 비즈니스 도메인
            type: errorType,                // 에러 타입: options > status > 기본값 RUNTIME
            code,                           // 에러 코드
            message,                        // 사용자 메시지
            rawMessage: error.message,      // 원본 Error 메시지
            statusCode: defaults.status,    // HTTP 상태 코드 (기본값: 500)
            origin: origin,                 // 에러 발생 출처
            details: {
                stack: error.stack,         // Stack trace (디버깅용)
                rawMessage: error.message   // 원본 메시지
            },
            timestamp: new Date().toISOString(),
            originalError: error            // 원본 Error 인스턴스
        };
    }
    
    // 알 수 없는 값인 경우
    // - 문자열: 메시지로 사용
    // - 그 외: details.raw에 보존
    
    // 문자열인 경우 메시지로 사용
    const rawMessage = typeof error === 'string' && error.trim().length > 0 
        ? error 
        : undefined;
    
    // 에러 코드 결정: options > RUNTIME 기본값
    const code = options?.code ?? ERROR_TYPE_DEFAULT_CODES.RUNTIME;
    
    // 메시지 해석: rawMessage > 코드 기반 메시지 > options 메시지 > 기본 메시지
    const message = resolveMessage({
        code,
        message: options?.message,
        serverMessage: rawMessage
    });
    
    // 최종 메시지 결정: rawMessage가 있으면 사용, 없으면 해석된 메시지
    const finalMessage = rawMessage ?? message;
    
    // AppError 생성
    return {
        domain: defaults.domain,        // 비즈니스 도메인
        type: errorType,                // 에러 타입: options > status > 기본값 RUNTIME
        code,                           // 에러 코드
        message: finalMessage,          // 사용자 메시지
        rawMessage,                     // 원본 값 (문자열인 경우)
        statusCode: defaults.status,    // HTTP 상태 코드 (기본값: 500)
        origin: origin,                 // 에러 발생 출처
        details: {
            raw: error,                 // 원본 값 (디버깅용)
            rawMessage                  // 원본 메시지 (문자열인 경우)
        },
        timestamp: new Date().toISOString()
    };
};

