// src/lib/types/error.ts
// 통합 에러 타입

// 에러 도메인 분류
export type ErrorDomain =
    'AUTH'      // 인증/인가 관련
    | 'FLIGHT'  // 항공편 서비스
    | 'NETWORK' // 네트워크 연결/타임아웃 등
    | 'SERVER'  // 백엔드 일반 에러
    | 'CLIENT'  // 프론트엔드 런타임 에러
    | 'VALIDATION' // 입력 검증 실패
    | 'BUSINESS'   // 비즈니스 규칙 위반
    | 'SYSTEM';    // 시스템 공통(Next.js Error Boundary 등)

// HTTP 상태 코드
export type HttpStatusCode = number;

// 에러 심각도 레벨
export type ErrorSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// 3. 에러 발생 출처(origin) 분류
//    에러가 어느 계층(서버/클라이언트/네트워크)에서 발생했는지 표현하기 위한 보조 타입입니다.
export type AppErrorOrigin = 'server' | 'client' | 'network' | 'unknown';

// 4. AppError
export interface AppError {
    domain: ErrorDomain;                 // 에러가 발생한 도메인
    code: string;                        // 에러 식별 코드 (서버/클라이언트 정의)
    message: string;                     // 사용자에게 노출할 메시지(초기엔 서버 문자열 그대로 사용)
    rawMessage?: string;                 // 서버/클라이언트가 전달한 원본 메시지 (디버깅용 보존)
    statusCode: HttpStatusCode;          // HTTP 상태 코드 (없으면 0 등으로 설정 가능)
    origin: AppErrorOrigin;              // 에러 발생 출처
    
    severity?: ErrorSeverity;            // 에러 심각도 레벨
    details?: Record<string, unknown>;   // 디버깅용 부가 정보 (요청 URL, 응답 body 등)
    traceId?: string;                    // 서버/외부 API가 내려준 추적 ID
    meta?: Record<string, unknown>;      // 재시도 가능 여부 등 UI에서 바로 쓰고 싶은 부가 정보
    timestamp?: string;                  // 에러 감지 시간 (ISO 문자열 등)
    originalError?: Error;               // 원본 Error 인스턴스
}

// 5. 통합 에러 인터페이스(AppError)
//    런타임에서 사용되는 최종 에러 객체로, timestamp와 originalError를 포함합니다.
// export interface AppError extends AppErrorBase {
//     timestamp?: string;                  // 에러 감지 시간 (ISO 문자열 등)
//     originalError?: Error;               // 원본 Error 인스턴스
// }

// 6. 에러 생성 옵션(CreateErrorOptions)
//    노멀라이저나 헬퍼 함수에서 AppError를 만들 때 사용할 설정 값입니다.
//    기본적으로 AppError와 같은 구조를 공유하며, 생성 시점에 timestamp/originalError를 같이 넘길 수 있도록 동일 필드를 노출합니다.
// export interface CreateErrorOptions extends AppErrorBase {
//     timestamp?: string;
//     originalError?: Error;
// }


// 7. 노멀라이저 전용 타입(NormalizerOptions 등)
// ------------------------------------------------------------
// error-normalizer 모듈에서 사용하는 보조 타입들을 한 곳에서 관리합니다.
// 서버/클라이언트 오류 소스를 표준 구조로 맞추기 위해 사용하며,
// 호출부가 toAppError에 fallback 정보를 주입하거나, axios/fetch 등
// 다양한 클라이언트가 던진 오류를 표준화된 형태로 전달할 수 있게 돕습니다.

export interface NormalizerOptions {
    fallbackDomain?: ErrorDomain; // 서버 응답에 domain이 없을 때 사용할 기본 도메인
    fallbackCode?: string;        // code가 비어 있을 때 사용할 앱 공통 에러 코드
    fallbackMessage?: string;     // 사용자에게 안내할 기본 메시지 (code 기반 문구가 없을 때 사용)
    fallbackStatus?: number;      // HTTP statusCode가 없을 때 채울 값 (예: 500)
    severity?: ErrorSeverity;      // 에러 심각도 레벨
}

// ------------------------------------------------------------
// ServerErrorSource
// ------------------------------------------------------------
// 서버가 HTTP 응답을 내려준 오류를 AppError로 변환하기 위해,
// axios/fetch 등 어떤 클라이언트라도 동일한 구조로 전달할 수 있도록 정의한 타입입니다.
// response 영역에는 서버가 내려준 상태/본문/헤더를, request 영역에는 원본 요청 정보를 포함합니다.
export interface ServerErrorSource {
    response: {
        status?: number; // HTTP 상태 코드 (예: 400, 401, 500), 없으면 fallbackStatus 사용
        data?: {
            domain?: string;  // 서버가 명시적으로 내려준 에러 도메인
            code?: string;    // 서버가 내려준 에러 식별 코드
            message?: string; // 서버가 내려준 원본 에러 메시지(사용자 노출용이 아닐 수 있음)
            traceId?: string; // 서버가 추적을 위해 내려준 trace ID (없을 수도 있음)
        };
        headers?: Record<string, string | undefined>; // 응답 헤더 (trace-id 추출 등)
    };
    request?: {
        url?: string;    // 요청 URL (디버깅용)
        method?: string; // 요청 메서드(GET, POST 등)
    };
}

// ------------------------------------------------------------
// NetworkErrorSource
// ------------------------------------------------------------
// 서버 응답 자체를 받지 못한 네트워크 계열 오류를 AppError로 변환할 때 사용할 입력 타입입니다.
// axios, fetch, 기타 클라이언트가 제공하는 최소 정보를 묶어 전달합니다.
export interface NetworkErrorSource {
    code?: string;   // 클라이언트에서 제공하는 네트워크 오류 코드 (예: ECONNABORTED, ERR_NETWORK)
    message?: string; // 원본 오류 메시지 (예: 'Network Error')
    request?: {
        url?: string;    // 실패한 요청 URL
        method?: string; // 실패한 요청 메서드
    };
}

// ------------------------------------------------------------
// HttpErrorPayload
// ------------------------------------------------------------
// fetch 기반 클라이언트가 throw할 때 사용할 입력 타입입니다.
// Next.js route 등에서 fetch를 감싼 후 toAppError에 전달할 수 있도록,
// Response 객체에서 꺼낸 상태/헤더/본문을 정규화한 구조입니다.
export interface HttpErrorPayload {
    response: {
        status?: number; // HTTP 상태 코드
        statusText?: string; // HTTP 상태 텍스트 (예: 'Not Found')
        headers?: Record<string, string | undefined>; // 응답 헤더 (trace-id 등 확인 가능)
        data?: {
            domain?: string;
            code?: string;
            message?: string;
            traceId?: string;
        } | unknown; // 서버가 JSON 이외의 데이터를 내려줄 수도 있어 unknown 허용
    };
    request?: {
        url?: string;    // 원본 요청 URL
        method?: string; // 원본 요청 메서드
    };
    body?: unknown; // 필요 시 Response.body 등을 그대로 담아 전달 (디버깅/재파싱용)
}