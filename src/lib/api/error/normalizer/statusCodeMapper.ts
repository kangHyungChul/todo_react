// src/lib/api/error/normalizer/statusCodeMapper.ts
// ------------------------------------------------------------
// HTTP 상태 코드를 AppError 코드로 치환하기 위한 헬퍼 모듈입니다.
// 서버가 명시적으로 error.code를 내려주지 않는 상황에서,
// 합리적인 기본 코드를 추정해 도메인별 메시지를 연결하기 위해 사용합니다.

import type { ErrorDomain, ErrorSeverity } from '@/lib/types/error';
import { ERROR_CODES } from '@/constants/errorCodes';

// 도메인별 기본 에러 코드를 매핑해 둔 테이블입니다.
// 서버가 code를 제공하지 않을 때 도메인에 맞는 DEFAULT_ERROR로 연결합니다.
export const DOMAIN_DEFAULT_CODES: Record<ErrorDomain, string> = {
    AUTH: ERROR_CODES.AUTH.DEFAULT_ERROR,
    FLIGHT: ERROR_CODES.FLIGHT.DEFAULT_ERROR,
    NETWORK: ERROR_CODES.NETWORK.DEFAULT_ERROR,
    SERVER: ERROR_CODES.SERVER.DEFAULT_ERROR,
    CLIENT: ERROR_CODES.CLIENT.DEFAULT_ERROR,
    VALIDATION: ERROR_CODES.VALIDATION.DEFAULT_ERROR,
    BUSINESS: ERROR_CODES.BUSINESS.DEFAULT_ERROR,
    SYSTEM: ERROR_CODES.SYSTEM.DEFAULT_ERROR
};

// 도메인별 기본 severity 매핑 추가
export const DOMAIN_DEFAULT_SEVERITY: Record<ErrorDomain, ErrorSeverity> = {
    AUTH: 'HIGH',        // 인증/인가 오류는 중요
    FLIGHT: 'MEDIUM',    // 항공편 정보 오류는 중간
    NETWORK: 'LOW',      // 네트워크 오류는 낮음 (재시도 가능)
    SERVER: 'HIGH',      // 서버 오류는 중요
    CLIENT: 'MEDIUM',    // 클라이언트 오류는 중간
    VALIDATION: 'LOW',   // 검증 오류는 낮음 (사용자 입력 문제)
    BUSINESS: 'MEDIUM',  // 비즈니스 로직 오류는 중간
    SYSTEM: 'CRITICAL'   // 시스템 오류는 치명적
};

// HTTP status를 받아 AppError code로 치환합니다.
export const mapStatusToDomainCode = (status: number, domain: ErrorDomain): string => {
    // 401 → 인증 실패, 403 → 권한 없음은 AUTH 도메인 코드로 고정
    if (status === 401) return ERROR_CODES.AUTH.UNAUTHORIZED;
    if (status === 403) return ERROR_CODES.AUTH.PERMISSION_DENIED;

    // 500 이상은 서버 공통 에러 코드 사용
    if (status >= 500) return DOMAIN_DEFAULT_CODES.SERVER;

    // 나머지는 호출자가 전달한 도메인의 DEFAULT_ERROR로 처리
    return DOMAIN_DEFAULT_CODES[domain];
};