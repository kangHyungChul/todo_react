// src/lib/api/error/handlers/network.handler.ts
// ------------------------------------------------------------
// 네트워크 에러 처리 핸들러입니다.
//
// 목적:
// - 서버 응답 자체를 받지 못한 네트워크 계열 오류 처리
// - 타임아웃, 연결 실패, 요청 취소 등을 AppError로 변환
// - Strategy Pattern: 네트워크 에러 처리 전략
//
// 사용 시나리오:
// - Axios 타임아웃 에러 (ECONNABORTED)
// - 네트워크 연결 실패 (ERR_NETWORK)
// - 요청 취소 (ERR_CANCELED)
// - Fetch 네트워크 에러
//
// 처리 과정:
// 1. 네트워크 에러 코드를 프로젝트 내부 코드로 매핑
// 2. ErrorType: 'NETWORK', origin: 'network' 설정
// 3. 메시지 해석 및 AppError 생성

import type { AppError, NormalizerOptions, NetworkErrorSource } from '../types';
import { resolveMessage } from '../mappers/message.mapper';
import { ERROR_TYPE_DEFAULT_CODES } from '../mappers/status.mapper';
import { ERROR_CODES } from '@/constants/errorCodes';
import { getDefaultOptions } from '../utils/defaults';

// ------------------------------------------------------------
// NETWORK_ERROR_CODE_MAP
// ------------------------------------------------------------
// 클라이언트(axios 등)에서 넘어오는 네트워크 에러 코드를
// 프로젝트 내부의 공통 코드로 대응시키기 위한 매핑 테이블입니다.
//
// 목적:
// - 다양한 클라이언트의 네트워크 에러 코드를 통일된 형식으로 변환
// - 일관된 에러 코드 사용으로 로깅 및 모니터링 용이
//
// 매핑 규칙:
// - ECONNABORTED (Axios 타임아웃) → NETWORK_TIMEOUT
// - ERR_NETWORK (Axios 네트워크 에러) → NETWORK_UNREACHABLE
// - ERR_CANCELED (Axios 요청 취소) → NETWORK_REQUEST_CANCELLED
const NETWORK_ERROR_CODE_MAP: Record<string, string> = {
    ECONNABORTED: ERROR_CODES.NETWORK.TIMEOUT,          // axios 타임아웃
    ERR_NETWORK: ERROR_CODES.NETWORK.UNREACHABLE,       // axios Generic Network Error
    ERR_CANCELED: ERROR_CODES.NETWORK.REQUEST_CANCELLED // axios 요청 취소
};

// ------------------------------------------------------------
// handleNetworkError
// ------------------------------------------------------------
// NetworkErrorSource를 AppError로 변환하는 함수입니다.
//
// Strategy Pattern:
// - 네트워크 에러 처리 전략을 캡슐화
// - 다양한 클라이언트의 네트워크 에러를 통일된 형식으로 변환
//
// 특징:
// - HTTP 응답이 없으므로 statusCode는 0으로 고정
// - ErrorType은 항상 'NETWORK'
// - origin은 항상 'network'
//
// 사용 예시:
// - const appError = handleNetworkError(networkErrorSource, { domain: 'FLIGHT' });
//
// 반환값:
// - AppError: 정규화된 에러 객체
export const handleNetworkError = (
    source: NetworkErrorSource,
    options?: NormalizerOptions
): AppError => {
    // 기본값 설정
    const defaults = getDefaultOptions(options);
    
    // 1) 네트워크 에러 코드 매핑
    // - 클라이언트 코드(ECONNABORTED 등)를 프로젝트 내부 코드로 변환
    // - 매핑되지 않은 경우 NETWORK 기본 코드 사용
    const mappedCode = source.code ? NETWORK_ERROR_CODE_MAP[source.code] : undefined;
    const code = mappedCode ?? ERROR_TYPE_DEFAULT_CODES.NETWORK;
    
    // 2) 원본 메시지 보존
    const rawMessage = source.message;
    
    // 3) 메시지 해석: 코드 기반 메시지 > options 메시지 > 원본 메시지 > 기본 메시지
    const message = resolveMessage({
        code,
        message: options?.message,
        serverMessage: rawMessage
    });

    // ErrorType 결정: options.type > 'NETWORK' 기본값
    const errorType = defaults.type ?? 'NETWORK';
    
    // 4) AppError 생성
    return {
        domain: defaults.domain,        // 비즈니스 도메인 (FLIGHT, AUTH 등)
        type: errorType,                 // 에러 타입: options > 기본값 NETWORK
        code,                            // 에러 코드 (매핑된 코드 또는 기본값)
        message,                         // 사용자 메시지
        rawMessage,                      // 원본 네트워크 에러 메시지
        statusCode: 0,                   // HTTP 응답이 없으므로 0으로 고정
        origin: 'network',               // 에러 출처: 항상 network
        details: {
            url: source.request?.url,    // 실패한 요청 URL
            method: source.request?.method, // 실패한 요청 메서드
            rawCode: source.code,        // 원본 네트워크 에러 코드 (디버깅용)
            rawMessage                   // 원본 메시지
        },
        timestamp: new Date().toISOString()
    };
};

