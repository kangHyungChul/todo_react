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
// export type ErrorSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// 3. 에러 발생 출처(origin) 분류
//    에러가 어느 계층(서버/클라이언트/네트워크)에서 발생했는지 표현하기 위한 보조 타입입니다.
export type AppErrorOrigin = 'server' | 'client' | 'network' | 'unknown';

// 4. 공통 필드 묶음(AppErrorBase)
//    AppError와 CreateErrorOptions에서 동시에 사용하는 공통 필드를 한 번만 정의해 중복을 제거합니다.
export interface AppErrorBase {
    domain: ErrorDomain;                 // 에러가 발생한 도메인
    code: string;                        // 에러 식별 코드 (서버/클라이언트 정의)
    message: string;                     // 사용자에게 노출할 메시지(초기엔 서버 문자열 그대로 사용)
    rawMessage?: string;                 // 서버/클라이언트가 전달한 원본 메시지 (디버깅용 보존)
    statusCode: HttpStatusCode;          // HTTP 상태 코드 (없으면 0 등으로 설정 가능)
    origin: AppErrorOrigin;              // 에러 발생 출처

    details?: Record<string, unknown>;   // 디버깅용 부가 정보 (요청 URL, 응답 body 등)
    traceId?: string | null;             // 서버/외부 API가 내려준 추적 ID
    meta?: Record<string, unknown>;      // 재시도 가능 여부 등 UI에서 바로 쓰고 싶은 부가 정보
}

// 5. 통합 에러 인터페이스(AppError)
//    런타임에서 사용되는 최종 에러 객체로, timestamp와 originalError를 포함합니다.
export interface AppError extends AppErrorBase {
    timestamp?: string;                  // 에러 감지 시간 (ISO 문자열 등)
    originalError?: Error;               // 원본 Error 인스턴스
}

// 6. 에러 생성 옵션(CreateErrorOptions)
//    노멀라이저나 헬퍼 함수에서 AppError를 만들 때 사용할 설정 값입니다.
//    기본적으로 AppError와 같은 구조를 공유하며, 생성 시점에 timestamp/originalError를 같이 넘길 수 있도록 동일 필드를 노출합니다.
export interface CreateErrorOptions extends AppErrorBase {
    timestamp?: string;
    originalError?: Error;
}