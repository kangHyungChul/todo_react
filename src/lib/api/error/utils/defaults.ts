// src/lib/api/error/utils/defaults.ts
// ------------------------------------------------------------
// 기본값 설정 유틸리티입니다.
//
// 목적:
// - NormalizerOptions의 기본값을 일관되게 설정
// - 도메인별 기본 코드 및 메시지 제공
// - 중복 코드 제거 및 유지보수성 향상
//
// 사용 패턴:
// - toAppError 내부에서 options가 없을 때 기본값 설정
// - 각 핸들러에서 공통으로 사용

import type { NormalizerOptions, ErrorDomain } from '../types';
import { DOMAIN_DEFAULT_CODES } from '../mappers/status.mapper';

// ------------------------------------------------------------
// getDefaultOptions
// ------------------------------------------------------------
// NormalizerOptions의 기본값을 설정하는 함수입니다.
//
// 우선순위:
// - options에 값이 있으면 사용
// - 없으면 기본값 사용
//
// 기본값 설정:
// - domain: 'FLIGHT' (항공편 서비스가 메인 도메인)
// - code: 도메인별 기본 코드 (DOMAIN_DEFAULT_CODES)
// - message: '예상치 못한 오류가 발생했습니다.'
// - status: 500 (서버 에러)
// - severity: undefined (나중에 ErrorType별 기본값 적용)
//
// 사용 예시:
// - const defaults = getDefaultOptions(options);
// - const domain = defaults.domain;
// - const code = defaults.code;
//
// 주의사항:
// - domain 기본값은 'FLIGHT'로 설정 (프로젝트의 메인 도메인)
// - 다른 도메인을 기본값으로 하고 싶으면 여기서 변경
// - DOMAIN_DEFAULT_CODES는 status.mapper.ts에서 import
export const getDefaultOptions = (options?: NormalizerOptions) => {
    // 도메인 기본값: 'FLIGHT' (항공편 서비스가 메인 도메인)
    // - 프로젝트의 메인 비즈니스 도메인으로 설정
    // - 다른 도메인을 기본값으로 하고 싶으면 여기서 변경
    const domain: ErrorDomain = options?.domain ?? 'FLIGHT';
    
    return {
        // 도메인: options에서 지정하거나 기본값 'FLIGHT'
        domain,
        
        // 에러 코드: options에서 지정하거나 도메인별 기본 코드
        // - DOMAIN_DEFAULT_CODES[domain] 사용
        // - 예: 'FLIGHT' → ERROR_CODES.FLIGHT.DEFAULT_ERROR
        code: options?.code ?? DOMAIN_DEFAULT_CODES[domain],
        
        // 에러 메시지: options에서 지정하거나 기본 안전망 메시지
        // - 사용자에게 노출할 메시지
        // - 서버가 보내주지 않을 때 사용
        message: options?.message ?? '예상치 못한 오류가 발생했습니다.',
        
        // HTTP 상태 코드: options에서 지정하거나 500 (서버 에러)
        // - 서버 응답이 없을 때 사용
        // - 기본값은 500 (Internal Server Error)
        status: options?.status ?? 500,
        
        // 에러 심각도: options에서 지정하거나 undefined
        // - undefined인 경우 나중에 ErrorType별 기본값 적용
        // - 또는 도메인별 기본값 적용
        severity: options?.severity // undefined 가능
    };
};

