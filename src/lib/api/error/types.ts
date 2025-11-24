// src/lib/api/error/types.ts
// ------------------------------------------------------------
// 에러 핸들링 시스템의 모든 타입 정의를 중앙화한 파일입니다.
// 
// 목적:
// - 모든 에러 관련 타입을 한 곳에서 관리하여 일관성 유지
// - 타입 변경 시 한 곳만 수정하면 전체 시스템에 반영
// - 타입 정의의 재사용성 향상
//
// 사용 패턴:
// - 다른 모듈에서 import하여 사용
// - 예: import type { AppError, ErrorDomain } from '@/lib/api/error/types';

// ------------------------------------------------------------
// ErrorDomain
// ------------------------------------------------------------
// 비즈니스 도메인별 에러 분류 타입입니다.
//
// 사용 목적:
// - 에러가 발생한 비즈니스 영역을 명확히 구분
// - 도메인별 에러 코드 및 메시지 매핑
// - 로깅 및 모니터링에서 도메인별 통계 수집
//
// 확장 방법:
// - 새로운 비즈니스 도메인이 추가되면 여기에 타입 추가
// - 예: 'PAYMENT' | 'USER' | 'NOTIFICATION' 등
//
// 주의사항:
// - 기술적 에러 타입(NETWORK, SYSTEM 등)은 ErrorType으로 분리
// - 비즈니스 도메인만 포함 (AUTH, FLIGHT 등)
export type ErrorDomain =
    'AUTH'      // 인증/인가 관련 에러 (로그인, 권한 등)
    | 'FLIGHT'  // 항공편 서비스 관련 에러 (조회, 예약 등)
    | 'UNKNOWN';  // 알수없음
// ------------------------------------------------------------
// ErrorType
// ------------------------------------------------------------
// 에러의 기술적 유형을 분류하는 타입입니다.
//
// 사용 목적:
// - 에러의 성격을 기술적으로 분류 (네트워크, 검증, 시스템 등)
// - ErrorType별 기본 에러 코드 및 severity 매핑
// - 에러 처리 전략 결정 (재시도 가능 여부 등)
//
// 분류 기준:
// - NETWORK: 네트워크 연결 실패, 타임아웃 등
// - VALIDATION: 입력 검증 실패 (400, 422 등)
// - BUSINESS: 비즈니스 규칙 위반 (404, 409 등)
// - RUNTIME: 런타임 에러 (일반 Error 인스턴스)
// - SYSTEM: 시스템 에러 (서버 5xx 등)
//
// 주의사항:
// - ErrorDomain과는 별개로 기술적 분류
// - HTTP 상태 코드 기반으로 자동 분류 가능
export type ErrorType =
    'NETWORK'     // 네트워크 연결/타임아웃 등
    | 'VALIDATION' // 입력 검증 실패
    | 'BUSINESS'   // 비즈니스 규칙 위반
    | 'RUNTIME'    // 런타임 에러 (일반 Error)
    | 'SYSTEM';    // 시스템 에러 (서버 5xx 등)

// ------------------------------------------------------------
// HttpStatusCode
// ------------------------------------------------------------
// HTTP 상태 코드 타입입니다.
//
// 사용 목적:
// - HTTP 응답의 상태 코드를 타입 안전하게 표현
// - 상태 코드 기반 에러 분류 및 처리
//
// 주의사항:
// - number 타입이지만 HTTP 표준 상태 코드만 사용 권장
// - 네트워크 에러 등 응답이 없는 경우 0 사용
export type HttpStatusCode = number;

// ------------------------------------------------------------
// ErrorSeverity
// ------------------------------------------------------------
// 에러의 심각도 레벨을 나타내는 타입입니다.
//
// 사용 목적:
// - 로깅 및 모니터링에서 에러의 중요도 판단
// - 프로덕션 환경에서 로깅 필터링 (HIGH, CRITICAL만 로깅 등)
// - 알림 시스템에서 우선순위 결정
//
// 레벨 설명:
// - LOW: 사용자 입력 문제, 재시도 가능한 에러 (예: VALIDATION, NETWORK)
// - MEDIUM: 일반적인 에러, 조사 필요 (예: BUSINESS, RUNTIME)
// - HIGH: 중요한 에러, 즉시 조사 필요 (예: AUTH, FLIGHT 도메인 에러)
// - CRITICAL: 시스템 장애, 즉시 조치 필요 (예: SYSTEM 에러)
//
// 기본값:
// - ErrorType별 기본 severity가 설정됨 (status.mapper.ts 참고)
// - 도메인별 기본 severity도 설정 가능 (도메인 중요도에 따라)
export type ErrorSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// ------------------------------------------------------------
// AppErrorOrigin
// ------------------------------------------------------------
// 에러가 발생한 실행 환경을 나타내는 타입입니다.
//
// 사용 목적:
// - 에러가 서버에서 발생했는지 클라이언트에서 발생했는지 구분
// - 로깅 및 모니터링에서 환경별 통계 수집
// - 디버깅 시 에러 발생 위치 파악
//
// 분류 기준:
// - server: 서버 환경에서 발생한 에러 (서버 컴포넌트, Route API 등)
// - client: 클라이언트 환경에서 발생한 에러 (브라우저, 클라이언트 컴포넌트 등)
// - network: 네트워크 계층에서 발생한 에러 (타임아웃, 연결 실패 등)
// - unknown: 알 수 없는 환경에서 발생한 에러
//
// 주의사항:
// - HTTP 상태 코드 기반으로도 결정 가능 (4xx → client, 5xx → server)
// - 실제 실행 환경(isServer)과는 별개로 에러 타입에 따라 결정
export type AppErrorOrigin = 'server' | 'client' | 'network' | 'unknown';

// ------------------------------------------------------------
// AppError
// ------------------------------------------------------------
// 애플리케이션 전체에서 사용하는 통합 에러 타입입니다.
//
// 목적:
// - 다양한 에러 소스(Axios, Fetch, 일반 Error 등)를 통일된 형식으로 변환
// - 에러 정보의 일관성 유지
// - 로깅, 모니터링, UI 표시 등에서 동일한 인터페이스 사용
//
// 필수 필드:
// - domain: 에러가 발생한 비즈니스 도메인
// - type: 에러의 기술적 유형
// - code: 에러 식별 코드 (서버/클라이언트 정의)
// - message: 사용자에게 노출할 메시지
// - statusCode: HTTP 상태 코드 (없으면 0)
// - origin: 에러 발생 출처
//
// 선택 필드:
// - rawMessage: 원본 에러 메시지 (디버깅용)
// - severity: 에러 심각도
// - details: 디버깅용 부가 정보 (요청 URL, 응답 body 등)
// - traceId: 서버/외부 API가 내려준 추적 ID
// - meta: UI에서 사용할 부가 정보 (재시도 가능 여부 등)
// - timestamp: 에러 감지 시간
// - originalError: 원본 Error 인스턴스
//
// 사용 예시:
// - try-catch에서 toAppError로 변환 후 사용
// - Logger.error(appError)로 로깅
// - UI에서 appError.message 표시
export interface AppError {
    // 필수 필드: 비즈니스 도메인 분류
    domain: ErrorDomain;
    
    // 필수 필드: 기술적 에러 유형
    type: ErrorType;
    
    // 필수 필드: 에러 식별 코드 (예: 'FLIGHT_DEFAULT_ERROR', 'AUTH_UNAUTHORIZED')
    // - 서버가 보내준 code 우선 사용
    // - 없으면 상태코드 기반 추정
    // - 없으면 도메인 기본값 사용
    code: string;
    
    // 필수 필드: 사용자에게 노출할 메시지
    // - 서버가 보내준 message 우선 사용
    // - 없으면 code 기반 ERROR_MESSAGES 매핑
    // - 없으면 options.message 사용
    // - 없으면 기본 안전망 메시지
    message: string;
    
    // 선택 필드: 서버/클라이언트가 전달한 원본 메시지
    // - 디버깅 및 로깅에 사용
    // - 사용자에게는 노출하지 않음 (기술적 메시지일 수 있음)
    rawMessage?: string;
    
    // 필수 필드: HTTP 상태 코드
    // - 서버 응답이 있는 경우: 실제 HTTP 상태 코드
    // - 네트워크 에러 등: 0
    // - 런타임 에러: 500 (기본값)
    statusCode: HttpStatusCode;
    
    // 필수 필드: 에러 발생 출처
    // - HTTP 상태 코드 기반으로 자동 결정
    // - 또는 실행 환경(isServer) 기반으로 결정
    origin: AppErrorOrigin;
    
    // 선택 필드: 에러 심각도 레벨
    // - ErrorType별 기본값 설정 가능
    // - 도메인별 기본값 설정 가능
    // - options에서 오버라이드 가능
    severity?: ErrorSeverity;
    
    // 선택 필드: 디버깅용 부가 정보
    // - 요청 URL, 메서드, 응답 body 등
    // - Sentry 등 모니터링 도구에 전달
    // - 민감한 정보는 제외해야 함
    details?: Record<string, unknown>;
    
    // 선택 필드: 서버/외부 API가 내려준 추적 ID
    // - 분산 추적 시스템에서 사용
    // - 헤더의 x-trace-id 또는 응답 body의 traceId
    traceId?: string;
    
    // 선택 필드: UI에서 사용할 부가 정보
    // - 재시도 가능 여부, 에러 발생 시간 등
    // - UI 컴포넌트에서 직접 사용 가능
    meta?: Record<string, unknown>;
    
    // 선택 필드: 에러 감지 시간 (ISO 문자열)
    // - 로깅 및 모니터링에서 사용
    // - 자동으로 현재 시간 설정
    timestamp?: string;
    
    // 선택 필드: 원본 Error 인스턴스
    // - 디버깅 시 stack trace 확인용
    // - 직렬화 시 제외해야 함 (순환 참조 가능)
    originalError?: Error;
}

// ------------------------------------------------------------
// NormalizerOptions
// ------------------------------------------------------------
// toAppError 함수에 전달하는 옵션 타입입니다.
//
// 목적:
// - 서버가 에러 정보를 보내주지 않을 때 기본값 제공
// - 호출부에서 에러 처리 방식을 커스터마이징
//
// 우선순위:
// - 서버 응답 > options > 기본값
// - 예: 서버 code > options.code > 상태코드 기반 추정 > 도메인 기본값
//
// 사용 예시:
// - httpClient 생성 시 기본 옵션 설정
// - 개별 요청 시 metadata로 오버라이드
export interface NormalizerOptions {
    // 서버 응답에 domain이 없을 때 사용할 기본 도메인
    // - 예: 'FLIGHT', 'AUTH'
    // - 기본값: 'FLIGHT' (ensureOptions에서 설정)
    domain?: ErrorDomain;
    
    // HTTP statusCode가 없을 때 채울 값
    // - 예: 500 (서버 에러)
    // - 기본값: 500
    status?: number;

    // 에러 타입을 강제로 지정하고 싶을 때 사용
    // - 예: 'VALIDATION', 'BUSINESS'
    // - 지정 시 자동 추론보다 우선 적용됨
    type?: ErrorType;
    
    // 서버가 code를 보내주지 않을 때 사용할 기본 코드
    // - 예: 'FLIGHT_DEFAULT_ERROR'
    // - 기본값: 도메인별 기본 코드 (DOMAIN_DEFAULT_CODES)
    code?: string;
    
    // 서버가 message를 보내주지 않을 때 사용할 기본 메시지
    // - 예: '항공편 정보를 불러올 수 없습니다.'
    // - 기본값: '예상치 못한 오류가 발생했습니다.'
    message?: string;
    
    // 에러 심각도 레벨
    // - ErrorType별 기본값보다 우선 적용
    // - 예: 'HIGH', 'CRITICAL'
    severity?: ErrorSeverity;
}

// ------------------------------------------------------------
// ServerErrorSource
// ------------------------------------------------------------
// 서버가 HTTP 응답을 내려준 오류를 AppError로 변환하기 위한 입력 타입입니다.
//
// 목적:
// - Axios, Fetch 등 다양한 HTTP 클라이언트의 에러를 통일된 형식으로 변환
// - 서버 응답 정보를 구조화하여 전달
//
// 구조:
// - response: 서버가 내려준 응답 정보 (상태, 본문, 헤더)
// - request: 원본 요청 정보 (URL, 메서드)
//
// 사용 예시:
// - AxiosError를 ServerErrorSource로 변환
// - Fetch Response를 ServerErrorSource로 변환
// - toAppError에 전달하여 AppError로 변환
//
// 주의사항:
// - Axios와 Fetch의 응답 구조가 다르므로 Adapter에서 변환 필요
export interface ServerErrorSource {
    // 서버 응답 정보
    response: {
        // HTTP 상태 코드 (예: 400, 401, 500)
        // - 없으면 options.status 사용
        status?: number;
        
        // 응답 본문 (서버가 보내준 에러 정보)
        data?: {
            // 서버가 명시적으로 내려준 에러 도메인
            // - 없으면 options.domain 사용
            domain?: string;
            
            // 서버가 내려준 에러 식별 코드
            // - 없으면 options.code 사용
            // - 없으면 상태코드 기반 추정
            code?: string;
            
            // 서버가 내려준 원본 에러 메시지
            // - 사용자 노출용이 아닐 수 있음 (기술적 메시지)
            // - AppError.message 결정 시 우선순위 1순위
            message?: string;
            
            // 서버가 추적을 위해 내려준 trace ID
            // - 없을 수도 있음
            traceId?: string;
        };
        
        // 응답 헤더
        // - x-trace-id 추출 등에 사용
        headers?: Record<string, string | undefined>;
    };
    
    // 원본 요청 정보 (디버깅용)
    request?: {
        // 요청 URL
        url?: string;
        
        // 요청 메서드 (GET, POST 등)
        method?: string;
    };
}

// ------------------------------------------------------------
// NetworkErrorSource
// ------------------------------------------------------------
// 서버 응답 자체를 받지 못한 네트워크 계열 오류를 AppError로 변환하기 위한 입력 타입입니다.
//
// 목적:
// - 네트워크 타임아웃, 연결 실패 등 HTTP 응답이 없는 에러 처리
// - Axios, Fetch 등 다양한 클라이언트의 네트워크 에러를 통일된 형식으로 변환
//
// 구조:
// - code: 클라이언트가 제공하는 네트워크 오류 코드
// - message: 원본 오류 메시지
// - request: 실패한 요청 정보
//
// 사용 예시:
// - Axios 타임아웃 에러 (ECONNABORTED)
// - Fetch 네트워크 에러
// - toAppError에 전달하여 AppError로 변환
//
// 주의사항:
// - HTTP 응답이 없으므로 statusCode는 0으로 설정
// - origin은 'network'로 설정
export interface NetworkErrorSource {
    // 클라이언트에서 제공하는 네트워크 오류 코드
    // - 예: 'ECONNABORTED' (Axios 타임아웃)
    // - 예: 'ERR_NETWORK' (Axios 네트워크 에러)
    // - 예: 'ERR_CANCELED' (Axios 요청 취소)
    code?: string;
    
    // 원본 오류 메시지
    // - 예: 'Network Error'
    // - 예: 'timeout of 5000ms exceeded'
    message?: string;
    
    // 실패한 요청 정보 (디버깅용)
    request?: {
        // 실패한 요청 URL
        url?: string;
        
        // 실패한 요청 메서드
        method?: string;
    };
}

// ------------------------------------------------------------
// HttpErrorPayload
// ------------------------------------------------------------
// Fetch 기반 클라이언트가 throw할 때 사용할 입력 타입입니다.
//
// 목적:
// - Next.js Route API 등에서 fetch를 감싼 후 toAppError에 전달
// - Response 객체에서 꺼낸 상태/헤더/본문을 정규화한 구조
//
// 구조:
// - response: Fetch Response에서 추출한 정보
// - request: 원본 요청 정보
// - body: 필요 시 Response.body 등을 그대로 담아 전달
//
// 사용 예시:
// - safeServerFetch에서 fetch 실패 시 HttpErrorPayload 구성
// - toAppError에 전달하여 AppError로 변환
//
// 주의사항:
// - AxiosError와는 다른 구조이므로 별도 처리 필요
// - ServerErrorSource와 유사하지만 Fetch 전용
export interface HttpErrorPayload {
    // Fetch Response에서 추출한 정보
    response: {
        // HTTP 상태 코드
        status?: number;
        
        // HTTP 상태 텍스트 (예: 'Not Found')
        statusText?: string;
        
        // 응답 헤더 (trace-id 등 확인 가능)
        headers?: Record<string, string | undefined>;
        
        // 응답 본문
        // - 서버가 JSON을 보내준 경우: { domain, code, message, traceId }
        // - 서버가 다른 형식을 보내준 경우: unknown
        data?: {
            domain?: string;
            code?: string;
            message?: string;
            traceId?: string;
        } | unknown; // 서버가 JSON 이외의 데이터를 내려줄 수도 있어 unknown 허용
    };
    
    // 원본 요청 정보 (디버깅용)
    request?: {
        // 원본 요청 URL
        url?: string;
        
        // 원본 요청 메서드
        method?: string;
    };
    
    // 필요 시 Response.body 등을 그대로 담아 전달
    // - 디버깅/재파싱용
    // - 일반적으로는 사용하지 않음
    body?: unknown;
}

