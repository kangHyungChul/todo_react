// src/lib/api/error/mappers/status.mapper.ts
// ------------------------------------------------------------
// HTTP 상태 코드 기반 매핑 로직입니다.
// 
// 목적:
// - HTTP 상태 코드를 ErrorType, origin, code로 변환
// - 비즈니스 도메인별 및 에러 타입별 기본 코드 제공
// - 에러 타입별 기본 severity 제공
//
// 사용 시나리오:
// - 서버가 명시적으로 error.code를 내려주지 않을 때 기본 코드 추정
// - HTTP 상태 코드만으로 ErrorType 분류
// - 도메인과 에러 타입에 맞는 기본 severity 설정
//
// 비대한 로직 분리:
// - 이 파일은 매핑 로직만 담당 (비대한 로직 분리 원칙)
// - 핸들러에서 이 매퍼를 사용하여 AppError 생성

import type { AppErrorOrigin, ErrorDomain, ErrorSeverity, ErrorType } from '../types';
import { ERROR_CODES } from '@/constants/errorCodes';

// ------------------------------------------------------------
// DOMAIN_DEFAULT_CODES
// ------------------------------------------------------------
// 비즈니스 도메인별 기본 에러 코드 매핑 테이블입니다.
// 
// 사용 시점:
// - 서버가 code를 제공하지 않을 때
// - HTTP 상태 코드만으로는 구체적인 에러 코드를 결정할 수 없을 때
// 
// 예시:
// - FLIGHT 도메인에서 서버가 code 없이 500 에러 반환
//   → DOMAIN_DEFAULT_CODES.FLIGHT 사용 ('FLIGHT_DEFAULT_ERROR')
//
// 주의:
// - ErrorDomain은 비즈니스 도메인만 포함 (AUTH, FLIGHT 등)
// - 에러 타입(NETWORK, SYSTEM 등)은 ErrorType으로 분리됨
export const DOMAIN_DEFAULT_CODES: Record<ErrorDomain, string> = {
    AUTH: ERROR_CODES.AUTH.DEFAULT_ERROR,      // 인증/인가 관련 기본 에러 코드
    FLIGHT: ERROR_CODES.FLIGHT.DEFAULT_ERROR,  // 항공편 서비스 관련 기본 에러 코드
};

// ------------------------------------------------------------
// ERROR_TYPE_DEFAULT_CODES
// ------------------------------------------------------------
// 에러 타입별 기본 에러 코드 매핑 테이블입니다.
//
// 사용 시점:
// - 네트워크 에러, 런타임 에러 등 비즈니스 도메인과 무관한 에러 발생 시
// - HTTP 상태 코드로 ErrorType을 결정한 후 기본 코드가 필요할 때
//
// 예시:
// - 네트워크 타임아웃 발생 → ErrorType: 'NETWORK'
//   → ERROR_TYPE_DEFAULT_CODES.NETWORK 사용 ('NETWORK_DEFAULT_ERROR')
// - 서버 컴포넌트에서 런타임 에러 발생 → ErrorType: 'RUNTIME'
//   → ERROR_TYPE_DEFAULT_CODES.RUNTIME 사용 ('CLIENT_DEFAULT_ERROR')
//
// 주의:
// - RUNTIME은 CLIENT 코드를 사용 (기존 CLIENT 도메인과의 호환성)
export const ERROR_TYPE_DEFAULT_CODES: Record<ErrorType, string> = {
    NETWORK: ERROR_CODES.NETWORK.DEFAULT_ERROR,        // 네트워크 연결/타임아웃 에러
    VALIDATION: ERROR_CODES.VALIDATION.DEFAULT_ERROR,  // 입력 검증 실패 에러
    BUSINESS: ERROR_CODES.BUSINESS.DEFAULT_ERROR,      // 비즈니스 규칙 위반 에러
    RUNTIME: ERROR_CODES.CLIENT.DEFAULT_ERROR,         // 런타임 에러 (일반 Error 인스턴스)
    SYSTEM: ERROR_CODES.SYSTEM.DEFAULT_ERROR,          // 시스템 에러 (서버 5xx 등)
};

// ------------------------------------------------------------
// ERROR_TYPE_DEFAULT_SEVERITY
// ------------------------------------------------------------
// 에러 타입별 기본 심각도(severity) 매핑 테이블입니다.
//
// 사용 시점:
// - AppError 생성 시 severity가 지정되지 않았을 때
// - 로깅 및 모니터링에서 에러의 중요도를 판단할 때
//
// severity 레벨 설명:
// - LOW: 사용자 입력 문제, 재시도 가능한 에러 (예: VALIDATION, NETWORK)
// - MEDIUM: 일반적인 에러, 조사 필요 (예: BUSINESS, RUNTIME)
// - CRITICAL: 시스템 장애, 즉시 조치 필요 (예: SYSTEM)
//
// 예시:
// - 네트워크 타임아웃 → severity: 'LOW' (재시도 가능)
// - 서버 500 에러 → severity: 'CRITICAL' (시스템 장애)
export const ERROR_TYPE_DEFAULT_SEVERITY: Record<ErrorType, ErrorSeverity> = {
    NETWORK: 'LOW',        // 네트워크 에러는 재시도 가능하므로 낮은 심각도
    VALIDATION: 'LOW',     // 검증 에러는 사용자 입력 문제이므로 낮은 심각도
    BUSINESS: 'MEDIUM',     // 비즈니스 로직 에러는 중간 심각도
    RUNTIME: 'MEDIUM',     // 런타임 에러는 중간 심각도
    SYSTEM: 'CRITICAL',    // 시스템 에러는 치명적이므로 최고 심각도
};

// ------------------------------------------------------------
// DOMAIN_DEFAULT_SEVERITY
// ------------------------------------------------------------
// 비즈니스 도메인별 기본 심각도(severity) 매핑 테이블입니다.
//
// 사용 시점:
// - 비즈니스 도메인 관련 에러에서 severity가 지정되지 않았을 때
// - 도메인별로 에러의 중요도를 다르게 설정하고 싶을 때
//
// 예시:
// - AUTH 도메인 에러 → severity: 'HIGH' (보안 관련이므로 중요)
// - FLIGHT 도메인 에러 → severity: 'HIGH' (서비스 핵심 기능이므로 중요)
//
// 주의:
// - ErrorType의 severity와 함께 사용되며, 더 구체적인 값이 우선 적용됨
export const DOMAIN_DEFAULT_SEVERITY: Record<ErrorDomain, ErrorSeverity> = {
    AUTH: 'HIGH',      // 인증/인가 오류는 보안 관련이므로 높은 심각도
    FLIGHT: 'HIGH',    // 항공편 정보 오류는 서비스 핵심 기능이므로 높은 심각도
};

// ------------------------------------------------------------
// mapStatusToErrorType
// ------------------------------------------------------------
// HTTP 상태 코드를 ErrorType으로 분류하는 함수입니다.
//
// 분류 기준:
// - 500 이상: SYSTEM (서버 내부 에러)
// - 400, 422: VALIDATION (입력 검증 실패)
// - 400 이상 (401, 403 제외): BUSINESS (비즈니스 규칙 위반)
// - 그 외: SYSTEM (기본값)
//
// 사용 시나리오:
// - 서버가 ErrorType을 명시적으로 보내주지 않을 때
// - HTTP 상태 코드만으로 에러 타입을 추정해야 할 때
//
// 예시:
// - 500 → 'SYSTEM'
// - 400 → 'VALIDATION'
// - 404 → 'BUSINESS'
// - 401, 403 → 'BUSINESS' (단, mapStatusToCode에서 AUTH 코드로 처리됨)
//
// 반환값:
// - ErrorType: 에러의 타입 (NETWORK, VALIDATION, BUSINESS, RUNTIME, SYSTEM)
export const mapStatusToErrorType = (status: number): ErrorType => {
    // 500 이상: 서버 내부 에러 → SYSTEM
    if (status >= 500) return 'SYSTEM';
    
    // 400, 422: 입력 검증 실패 → VALIDATION
    // 422는 Unprocessable Entity로 주로 검증 에러에 사용됨
    if (status === 400 || status === 422) return 'VALIDATION';
    
    // 400 이상 (401, 403 포함): 클라이언트 요청 문제 → BUSINESS
    // 단, 401/403은 mapStatusToCode에서 AUTH 코드로 특별 처리됨
    if (status >= 400) return 'BUSINESS';
    
    // 그 외 (200-399 등): 기본값으로 SYSTEM 반환
    // 실제로는 성공 응답이므로 이 경우는 거의 발생하지 않음
    return 'SYSTEM';
};

// ------------------------------------------------------------
// mapStatusToOrigin
// ------------------------------------------------------------
// HTTP 상태 코드를 AppError origin으로 변환하는 함수입니다.
//
// 분류 기준:
// - 500 이상: 'server' (서버 측 에러)
// - 400 이상: 'client' (클라이언트 요청 문제)
// - 그 외: 'server' (기본값)
//
// 사용 시나리오:
// - HTTP 응답 에러에서 origin을 결정할 때
// - 서버가 origin을 명시적으로 보내주지 않을 때
//
// 예시:
// - 500 → 'server' (서버 내부 에러)
// - 400 → 'client' (잘못된 요청)
// - 404 → 'client' (리소스 없음)
//
// 주의:
// - origin은 "에러가 발생한 실행 환경"을 나타냄
// - 4xx는 클라이언트 요청 문제이지만, 서버에서 발생한 에러이므로 'client'로 분류
// - 실제 실행 환경(서버/클라이언트)과는 별개로 HTTP 상태 코드 기반으로 결정
//
// 반환값:
// - AppErrorOrigin: 'server' | 'client' | 'network' | 'unknown'
export const mapStatusToOrigin = (status: number): AppErrorOrigin => {
    // 500 이상: 서버 내부 에러 → 'server'
    if (status >= 500) return 'server';
    
    // 400 이상: 클라이언트 요청 문제 → 'client'
    // (서버에서 발생했지만 클라이언트 요청이 원인)
    if (status >= 400) return 'client';
    
    // 그 외 (200-399 등): 기본값으로 'server' 반환
    // 실제로는 성공 응답이므로 이 경우는 거의 발생하지 않음
    return 'server';
};

// ------------------------------------------------------------
// mapStatusToCode
// ------------------------------------------------------------
// HTTP 상태 코드와 도메인을 기반으로 AppError code를 결정하는 함수입니다.
//
// 우선순위:
// 1. 특정 상태 코드 (401, 403) → AUTH 도메인 특정 코드
// 2. 도메인 기본 코드 → DOMAIN_DEFAULT_CODES[domain]
//
// 사용 시나리오:
// - 서버가 code를 보내주지 않았을 때
// - HTTP 상태 코드만으로 기본 에러 코드를 추정해야 할 때
//
// 예시:
// - status: 401, domain: 'FLIGHT' → ERROR_CODES.AUTH.UNAUTHORIZED
//   (401은 인증 실패이므로 도메인과 무관하게 AUTH 코드 사용)
// - status: 500, domain: 'FLIGHT' → ERROR_CODES.FLIGHT.DEFAULT_ERROR
//   (도메인 기본 코드 사용)
//
// 매개변수:
// - status: HTTP 상태 코드 (예: 400, 401, 500 등)
// - domain: 비즈니스 도메인 (AUTH, FLIGHT 등)
//
// 반환값:
// - string: 에러 코드 (예: 'AUTH_UNAUTHORIZED', 'FLIGHT_DEFAULT_ERROR')
export const mapStatusToCode = (status: number, domain: ErrorDomain): string => {
    // 401 (Unauthorized): 인증 실패 → AUTH 도메인 특정 코드 사용
    // 도메인과 무관하게 인증 문제는 AUTH 코드로 통일
    if (status === 401) return ERROR_CODES.AUTH.UNAUTHORIZED;
    
    // 403 (Forbidden): 권한 없음 → AUTH 도메인 특정 코드 사용
    // 도메인과 무관하게 권한 문제는 AUTH 코드로 통일
    if (status === 403) return ERROR_CODES.AUTH.PERMISSION_DENIED;
    
    // 그 외: 전달받은 비즈니스 도메인의 기본 코드 사용
    // 예: FLIGHT 도메인 → 'FLIGHT_DEFAULT_ERROR'
    return DOMAIN_DEFAULT_CODES[domain];
};

