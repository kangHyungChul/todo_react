/**
 * 에러 메시지 정의
 * errorCodes.ts의 실제 코드와 매핑되는 메시지들
 */

import { ERROR_CODES } from './errorCodes';

export const ERROR_MESSAGES = {
    // 인증 관련 메시지 (AUTH 도메인)
    
    // 로그인 관련 에러
    [ERROR_CODES.AUTH.INVALID_CREDENTIALS]: '이메일 또는 비밀번호가 올바르지 않습니다.',
    [ERROR_CODES.AUTH.EMAIL_NOT_CONFIRMED]: '이메일 인증이 되지 않았습니다.',
    [ERROR_CODES.AUTH.EMAIL_ADDRESS_INVALID]: '이메일 형식이 올바르지 않습니다.',
    [ERROR_CODES.AUTH.TOO_MANY_ATTEMPTS]: '로그인 시도 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.',
    
    // // 회원가입 관련 에러
    // [ERROR_CODES.AUTH.SIGNUP_EMAIL_EXISTS]: '이미 가입된 이메일입니다. 로그인 또는 비밀번호 재설정을 이용해 주세요.',
    // [ERROR_CODES.AUTH.SIGNUP_WEAK_PASSWORD]: '비밀번호가 너무 간단합니다. 더 복잡한 비밀번호를 사용해주세요.',
    // [ERROR_CODES.AUTH.SIGNUP_EMAIL_UNVERIFIED]: '이메일 인증을 완료해주세요.',
    
    // // 토큰 관련 에러
    // [ERROR_CODES.AUTH.TOKEN_EXPIRED]: '로그인이 만료되었습니다. 다시 로그인해주세요.',
    // [ERROR_CODES.AUTH.TOKEN_INVALID]: '유효하지 않은 인증 정보입니다.',
    // [ERROR_CODES.AUTH.TOKEN_MISSING]: '로그인이 필요합니다.',
    
    // // 권한 관련 에러
    // [ERROR_CODES.AUTH.PERMISSION_DENIED]: '접근 권한이 없습니다.',
    // [ERROR_CODES.AUTH.ROLE_INSUFFICIENT]: '해당 기능을 사용할 권한이 없습니다.',

    // // 항공편 관련 메시지 (FLIGHT 도메인)
    
    // // 조회 관련 에러
    // [ERROR_CODES.FLIGHT.SEARCH_NO_RESULTS]: '검색 조건에 맞는 항공편이 없습니다.',
    // [ERROR_CODES.FLIGHT.SEARCH_INVALID_DATE]: '올바른 날짜를 입력해주세요.',
    // [ERROR_CODES.FLIGHT.SEARCH_INVALID_ROUTE]: '유효하지 않은 항공 경로입니다.',
    
    // // 상세 정보 에러
    // [ERROR_CODES.FLIGHT.DETAIL_NOT_FOUND]: '해당 항공편 정보를 찾을 수 없습니다.',
    // [ERROR_CODES.FLIGHT.DETAIL_UNAVAILABLE]: '항공편 상세 정보를 일시적으로 조회할 수 없습니다.',
    
    // // 추적 관련 에러
    // [ERROR_CODES.FLIGHT.TRACKING_NOT_AVAILABLE]: '항공편 추적 정보를 제공할 수 없습니다.',
    // [ERROR_CODES.FLIGHT.TRACKING_OUTDATED]: '추적 정보가 최신이 아닐 수 있습니다.',
    
    // // 외부 API 관련 에러
    // [ERROR_CODES.FLIGHT.API_UNAVAILABLE]: '항공편 정보 서비스를 일시적으로 이용할 수 없습니다.',
    // [ERROR_CODES.FLIGHT.API_RATE_LIMITED]: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
    // [ERROR_CODES.FLIGHT.API_PARSE_ERROR]: '항공편 정보를 처리하는 중 오류가 발생했습니다.',

    // // 네트워크 관련 메시지 (NETWORK 도메인)
    // [ERROR_CODES.NETWORK.CONNECTION_FAILED]: '네트워크 연결에 실패했습니다.',
    // [ERROR_CODES.NETWORK.CONNECTION_TIMEOUT]: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
    // [ERROR_CODES.NETWORK.CONNECTION_REFUSED]: '서버에서 연결을 거부했습니다.',
    // [ERROR_CODES.NETWORK.DNS_RESOLUTION_FAILED]: 'DNS 조회에 실패했습니다. 네트워크 상태를 확인해주세요.',
    // [ERROR_CODES.NETWORK.SSL_HANDSHAKE_FAILED]: 'SSL 보안 연결에 실패했습니다.',

    // // 검증 관련 메시지 (VALIDATION 도메인)
    
    // // 필드 검증 에러
    // [ERROR_CODES.VALIDATION.FIELD_REQUIRED]: '필수 항목을 입력해주세요.',
    // [ERROR_CODES.VALIDATION.FIELD_INVALID_FORMAT]: '올바른 형식으로 입력해주세요.',
    // [ERROR_CODES.VALIDATION.FIELD_TOO_LONG]: '입력 길이가 너무 깁니다.',
    // [ERROR_CODES.VALIDATION.FIELD_TOO_SHORT]: '입력 길이가 너무 짧습니다.',
    
    // // 특정 타입 검증 에러
    // [ERROR_CODES.VALIDATION.EMAIL_INVALID]: '올바른 이메일 주소를 입력해주세요.',
    // [ERROR_CODES.VALIDATION.PHONE_INVALID]: '올바른 전화번호를 입력해주세요.',
    // [ERROR_CODES.VALIDATION.DATE_INVALID]: '올바른 날짜 형식을 입력해주세요.',
    // [ERROR_CODES.VALIDATION.PASSWORD_WEAK]: '더 강력한 비밀번호를 설정해주세요.',

    // // 서버 관련 메시지 (SERVER 도메인)
    // [ERROR_CODES.SERVER.INTERNAL_ERROR]: '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    // [ERROR_CODES.SERVER.DATABASE_ERROR]: '데이터베이스 처리 중 오류가 발생했습니다.',
    // [ERROR_CODES.SERVER.DATABASE_CONNECTION_FAILED]: '데이터베이스 연결에 실패했습니다.',
    // [ERROR_CODES.SERVER.SERVICE_UNAVAILABLE]: '서비스를 일시적으로 이용할 수 없습니다.',
    // [ERROR_CODES.SERVER.RATE_LIMIT_EXCEEDED]: '요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.',
    // [ERROR_CODES.SERVER.CONFIGURATION_ERROR]: '서버 설정에 문제가 있습니다.',
    // [ERROR_CODES.SERVER.DEPENDENCY_UNAVAILABLE]: '외부 서비스에 연결할 수 없습니다.',

    // // 클라이언트 관련 메시지 (CLIENT 도메인)
    // [ERROR_CODES.CLIENT.UNEXPECTED_ERROR]: '예상치 못한 오류가 발생했습니다.',
    // [ERROR_CODES.CLIENT.COMPONENT_RENDER_ERROR]: '화면 렌더링 중 오류가 발생했습니다.',
    // [ERROR_CODES.CLIENT.STATE_CORRUPTION]: '애플리케이션 상태가 손상되었습니다. 페이지를 새로고침해주세요.',
    // [ERROR_CODES.CLIENT.BROWSER_NOT_SUPPORTED]: '지원하지 않는 브라우저입니다.',

    // // 비즈니스 로직 관련 메시지 (BUSINESS 도메인)
    // [ERROR_CODES.BUSINESS.OPERATION_NOT_ALLOWED]: '허용되지 않는 작업입니다.',
    // [ERROR_CODES.BUSINESS.RESOURCE_CONFLICT]: '리소스 충돌이 발생했습니다.',
    // [ERROR_CODES.BUSINESS.QUOTA_EXCEEDED]: '할당량을 초과했습니다.',
    // [ERROR_CODES.BUSINESS.FEATURE_DISABLED]: '해당 기능이 비활성화되어 있습니다.',
} as const;