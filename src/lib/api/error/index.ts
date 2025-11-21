// src/lib/api/error/index.ts
// ------------------------------------------------------------
// 에러 핸들링 시스템의 진입점입니다.
//
// 목적:
// - Factory Pattern: 에러 타입에 따라 적절한 핸들러 선택
// - 외부에서 사용하는 통일된 인터페이스 제공
// - 모든 에러 소스를 AppError로 정규화
//
// 사용 패턴:
// - import { toAppError, Logger } from '@/lib/api/error';
// - const appError = toAppError(error, { domain: 'FLIGHT' });
// - await Logger.error(appError);
//
// Factory Pattern:
// - 다양한 에러 소스를 감지하여 적절한 핸들러로 라우팅
// - 새로운 에러 타입 추가 시 여기에만 분기 추가하면 됨

import type { AxiosError } from 'axios';
import type { AppError, NormalizerOptions, HttpErrorPayload, NetworkErrorSource } from './types';
import { handleHttpError } from './handlers/http.handler';
import { handleNetworkError } from './handlers/network.handler';
import { handleRuntimeError } from './handlers/runtime.handler';
import { isAxiosError, isHttpErrorPayload, isNetworkError } from './utils/guards';
import { ERROR_TYPE_DEFAULT_SEVERITY, DOMAIN_DEFAULT_SEVERITY } from './mappers/status.mapper';

// ------------------------------------------------------------
// toAppError
// ------------------------------------------------------------
// 모든 에러 소스를 AppError로 정규화하는 Factory 함수입니다.
//
// Factory Pattern:
// - 에러 타입을 감지하여 적절한 핸들러 선택
// - 각 핸들러는 독립적인 처리 전략 (Strategy Pattern)
//
// 처리 순서:
// 1. AxiosError (HTTP 응답 있음) → handleHttpError
// 2. HttpErrorPayload (Fetch 기반) → handleHttpError
// 3. AxiosError (HTTP 응답 없음, 네트워크 에러) → handleNetworkError
// 4. NetworkErrorSource → handleNetworkError
// 5. Error 인스턴스 → handleRuntimeError
// 6. 알 수 없는 값 → handleRuntimeError
//
// 사용 예시:
// - const appError = toAppError(axiosError, { domain: 'FLIGHT' });
// - const appError = toAppError(new Error('Something went wrong'), { domain: 'AUTH' });
// - const appError = toAppError('Unknown error');
//
// 반환값:
// - AppError: 정규화된 에러 객체
export const toAppError = (
    error: unknown,
    options?: NormalizerOptions
): AppError => {
    // 1) AxiosError 처리 (HTTP 응답이 있는 경우)
    // - AxiosError이면서 error.response가 있는 경우
    // - 서버가 HTTP 응답을 내려준 에러 (4xx, 5xx 등)
    if (isAxiosError(error) && error.response) {
        const appError = handleHttpError(error as AxiosError, options);
        
        // severity 설정: options > ErrorType 기본값 > 도메인 기본값
        appError.severity = 
            options?.severity ?? 
            ERROR_TYPE_DEFAULT_SEVERITY[appError.type] ?? 
            DOMAIN_DEFAULT_SEVERITY[appError.domain];
        
        return appError;
    }
    
    // 2) HttpErrorPayload 처리 (Fetch 기반)
    // - Fetch 기반 클라이언트에서 throw된 에러
    // - Next.js Route API 등에서 사용
    if (isHttpErrorPayload(error)) {
        const appError = handleHttpError(error as HttpErrorPayload, options);
        
        // severity 설정
        appError.severity = 
            options?.severity ?? 
            ERROR_TYPE_DEFAULT_SEVERITY[appError.type] ?? 
            DOMAIN_DEFAULT_SEVERITY[appError.domain];
        
        return appError;
    }
    
    // 3) AxiosError 처리 (HTTP 응답이 없는 경우, 네트워크 에러)
    // - AxiosError이지만 error.response가 없는 경우
    // - 네트워크 타임아웃, 연결 실패 등
    if (isAxiosError(error)) {
        const networkSource: NetworkErrorSource = {
            code: error.code,
            message: error.message,
            request: {
                url: error.config?.url,
                method: error.config?.method
            }
        };
        
        const appError = handleNetworkError(networkSource, options);
        
        // severity 설정
        appError.severity = 
            options?.severity ?? 
            ERROR_TYPE_DEFAULT_SEVERITY[appError.type] ?? 
            DOMAIN_DEFAULT_SEVERITY[appError.domain];
        
        return appError;
    }
    
    // 4) NetworkErrorSource 처리
    // - 명시적으로 NetworkErrorSource로 전달된 경우
    if (isNetworkError(error)) {
        const appError = handleNetworkError(error as NetworkErrorSource, options);
        
        // severity 설정
        appError.severity = 
            options?.severity ?? 
            ERROR_TYPE_DEFAULT_SEVERITY[appError.type] ?? 
            DOMAIN_DEFAULT_SEVERITY[appError.domain];
        
        return appError;
    }
    
    // 5) 일반 Error 인스턴스 처리
    // - throw new Error('...') 형태
    // - TypeError, ReferenceError 등
    if (error instanceof Error) {
        const appError = handleRuntimeError(error, options);
        
        // severity 설정
        appError.severity = 
            options?.severity ?? 
            ERROR_TYPE_DEFAULT_SEVERITY[appError.type] ?? 
            DOMAIN_DEFAULT_SEVERITY[appError.domain];
        
        return appError;
    }
    
    // 6) 알 수 없는 값 처리
    // - 문자열, 숫자, 객체 등
    // - 모든 분기에 해당하지 않는 경우
    const appError = handleRuntimeError(error, options);
    
    // severity 설정
    appError.severity = 
        options?.severity ?? 
        ERROR_TYPE_DEFAULT_SEVERITY[appError.type] ?? 
        DOMAIN_DEFAULT_SEVERITY[appError.domain];
    
    return appError;
};

// ------------------------------------------------------------
// Logger export
// ------------------------------------------------------------
// 로깅 기능을 외부에 노출
// - 기존 logger/index.ts의 Logger를 그대로 사용
export { Logger } from './logger';

// ------------------------------------------------------------
// Types export
// ------------------------------------------------------------
// 타입 정의를 외부에 노출
// - 다른 모듈에서 타입을 사용할 수 있도록
export type {
    AppError,
    ErrorDomain,
    ErrorType,
    ErrorSeverity,
    AppErrorOrigin,
    NormalizerOptions,
    ServerErrorSource,
    NetworkErrorSource,
    HttpErrorPayload
} from './types';

