/**
 * 에러 관리 타입
*/

// 에러 도메인 분류
export type ErrorDomain = 
    | 'AUTH'        // 인증/인가
    | 'FLIGHT'      // 항공편 
    | 'NETWORK'     // 네트워크
    | 'VALIDATION'  // 입력 검증
    | 'SERVER'      // 서버 
    | 'CLIENT'      // 클라이언트
    | 'BUSINESS';   // 비즈니스 로직

// HTTP 상태 코드
export type HttpStatusCode = 
    | 200 | 201 | 204
    | 400 | 401 | 403 | 404 | 409 | 422 | 429
    | 500 | 502 | 503 | 504;

// 에러 심각도 레벨
// export type ErrorSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// 기본 에러 인터페이스
export interface AppError {
    domain: ErrorDomain;
    code: string;               // 에러 식별 코드
    statusCode: HttpStatusCode; // 상태 코드
    message: string;            // 사용자 메시지
    details?: Record<string, unknown>;           // 선택적 추가 정보
    originalError?: Error;
    traceId?: string;
    cause?: string;
    // severity: ErrorSeverity;
}

// API 응답 인터페이스 (통합)
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: AppError;
}

// 에러 생성 옵션
export interface CreateErrorOptions {
    domain: ErrorDomain;
    code: string;
    statusCode: HttpStatusCode; // 상태 코드
    message: string;
    details?: Record<string, unknown>;
    originalError?: Error;
    traceId?: string;
    cause?: string;
    // severity?: ErrorSeverity;
}
