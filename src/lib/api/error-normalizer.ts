// src/lib/api/error-normalizer.ts
// ------------------------------------------------------------
// axios, fetch, 일반 Error 등 모든 예외를 우리 앱의 공통 AppError 구조로
// 변환하기 위한 유틸입니다. API 호출부, React Query, Next.js route 등에서
// 동일한 방식으로 재사용할 수 있도록 설계했습니다.

import type { AxiosError } from 'axios';
import type { AppError, ErrorDomain, HttpStatusCode } from '@/lib/types/error';
import { ERROR_CODES } from '@/constants/errorCodes';
import { ERROR_MESSAGES } from '@/constants/errorMessages';

// ------------------------------------------------------------
// toAppError 호출 시 전달할 수 있는 옵션 정의
// - fallbackDomain: 서버 응답에서 domain을 주지 않은 경우 사용할 기본 도메인
// - fallbackCode: code가 비어 있을 때 채워 넣을 기본 에러 코드
// - fallbackMessage: message가 비어 있을 때 사용자에게 보여줄 기본 문구
// - fallbackStatus: statusCode가 없을 때 채울 HTTP 상태 코드 (예: 500)
export interface NormalizerOptions {
    fallbackDomain?: ErrorDomain;
    fallbackCode?: string;
    fallbackMessage?: string;
    fallbackStatus?: number;
};


// ------------------------------------------------------------
// 도메인별 기본 에러 코드 테이블
// 서버/클라이언트/네트워크 등 도메인을 막론하고 최소한으로 보장할 코드입니다.
// (추후 ERROR_CODES가 확장되면 여기서도 함께 업데이트해 주세요.)
const DOMAIN_DEFAULT_CODES: Record<ErrorDomain, string> = {
    AUTH: ERROR_CODES.AUTH.DEFAULT_ERROR,
    FLIGHT: ERROR_CODES.FLIGHT.DEFAULT_ERROR,
    NETWORK: ERROR_CODES.NETWORK.DEFAULT_ERROR,
    SERVER: ERROR_CODES.SERVER.DEFAULT_ERROR,
    CLIENT: ERROR_CODES.CLIENT.DEFAULT_ERROR,
    VALIDATION: ERROR_CODES.VALIDATION.DEFAULT_ERROR,
    BUSINESS: ERROR_CODES.BUSINESS.DEFAULT_ERROR,
    SYSTEM: ERROR_CODES.SYSTEM.DEFAULT_ERROR
};


// ------------------------------------------------------------
// 공통 메시지 선택 순서
// message는 아래 우선순위를 따릅니다.
// 1) 에러 코드에 매핑된 기본 문구(ERROR_MESSAGES)
// 2) 호출 옵션에서 전달받은 fallback 메시지
// 3) 서버 응답이 명시적으로 제공한 message 문자열
// 4) 마지막 안전망 문구
const resolveMessage = ({
    code,
    fallbackMessage,
    serverMessage
}: {
    code?: string;
    fallbackMessage?: string;
    serverMessage?: string;
}): string => {
    if (code) {
        const preset = ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES];
        if (preset) return preset;
    }

    if (fallbackMessage) {
        return fallbackMessage;
    }

    if (serverMessage && serverMessage.trim().length > 0) {
        return serverMessage;
    }

    return '예상치 못한 오류가 발생했습니다.';
};


// ------------------------------------------------------------
// HTTP 상태 코드를 도메인별 에러 코드로 치환
// 서버가 code를 내려주지 않은 경우 상태 코드만 보고 합리적인 값을 추측합니다.
// - 401, 403은 AUTH 도메인 코드로 고정 (401 = UNAUTHORIZED / 인증 실패, 403 = PERMISSION_DENIED / 권한 없음)
// - 500 이상은 서버 공통 에러 코드
// - 그 외는 도메인 기본 코드
const mapStatusToDomainCode = (
    status: number,
    domain: ErrorDomain
): string => {
    if (status === 401) {
        return ERROR_CODES.AUTH.UNAUTHORIZED;
    }
    if (status === 403) {
        return ERROR_CODES.AUTH.PERMISSION_DENIED;
    }
    if (status >= 500) {
        return DOMAIN_DEFAULT_CODES.SERVER;
    }
    return DOMAIN_DEFAULT_CODES[domain];
};


// ------------------------------------------------------------
// 서버 응답형 오류를 공통 포맷으로 다루기 위한 입력 타입
// 어떤 HTTP 클라이언트(axios, fetch 등)을 사용하더라도 아래 구조만 맞춰주면
// 서버가 내려준 상태코드/본문/헤더 정보를 AppError로 변환할 수 있습니다.
export interface ServerErrorSource {
    response: {
        status?: number; // HTTP 상태 코드 (예: 400, 401, 500 등)
        data?: {
            domain?: string;  // 서버가 명시적으로 내려준 에러 도메인
            code?: string;    // 서버가 내려준 에러 코드
            message?: string; // 서버가 내려준 에러 메시지
            traceId?: string; // 서버에서 추적을 위해 제공하는 trace ID
        };
        headers?: Record<string, string | undefined>; // 응답 헤더 (trace-id 추출용)
    };
    request?: {
        url?: string;    // 요청 URL
        method?: string; // 요청 메서드 (GET, POST 등)
    };
};


// ------------------------------------------------------------
// 네트워크 오류(응답 자체를 받지 못한 경우)를 공통 포맷으로 다루기 위한 입력 타입
// 각 클라이언트가 제공하는 오류 코드/메시지/요청 정보를 최소한으로 묶습니다.
export interface NetworkErrorSource {
    code?: string;   // 클라이언트에서 제공하는 네트워크 오류 코드 (예: ECONNABORTED)
    message?: string; // 원본 오류 메시지 (예: 'Network Error')
    request?: {
        url?: string;
        method?: string;
    };
};


// ------------------------------------------------------------
// fetch 기반 클라이언트가 throw할 때 사용할 입력 타입
// SSR route 등에서 fetch를 감싸서 사용한다면 아래 포맷에 맞춰 던져주세요.
export interface HttpErrorPayload {
    response: {
        status?: number;
        statusText?: string;
        headers?: Record<string, string | undefined>;
        data?: {
            domain?: string;
            code?: string;
            message?: string;
            traceId?: string;
        } | unknown;
    };
    request?: {
        url?: string;
        method?: string;
    };
    body?: unknown; // 필요에 따라 body를 그대로 넘겨줄 수도 있습니다.
};


// ------------------------------------------------------------
// fetch 래퍼에서 던진 오류인지 체크하는 타입 가드
// response.status가 숫자라면 ServerErrorSource로 처리할 수 있습니다.
const isHttpErrorPayload = (value: unknown): value is HttpErrorPayload => {
    if (!value || typeof value !== 'object') return false;
    const { response } = value as HttpErrorPayload;
    return !!response && typeof response.status === 'number';
};

// axios에서 던진 오류인지 체크하는 타입 가드
const isAxiosError = (value: unknown): value is AxiosError => {
    return !!(value && typeof value === 'object' && (value as AxiosError).isAxiosError);
};


// ------------------------------------------------------------
// 네트워크 오류 코드 매핑 테이블
// 클라이언트가 제공하는 네트워크 오류 코드(예: axios의 ECONNABORTED)를
// 앱 공통에서 사용하는 에러 코드로 치환합니다.
const NETWORK_ERROR_CODE_MAP: Record<string, string> = {
    ECONNABORTED: ERROR_CODES.NETWORK.TIMEOUT,
    ERR_NETWORK: ERROR_CODES.NETWORK.UNREACHABLE,
    ERR_CANCELED: ERROR_CODES.NETWORK.REQUEST_CANCELLED
};


// ------------------------------------------------------------
// 네트워크 계열 오류를 AppError로 변환하는 공통 빌더
// - domain은 항상 'NETWORK'
// - 상태코드는 0으로 두고, origin은 'network'로 고정합니다.
const buildNetworkErrorFromSource = (
    source: NetworkErrorSource,
    fallbackMessage: string
): AppError => {
    const domain: ErrorDomain = 'NETWORK';

    // 클라이언트 코드(예: ECONNABORTED)를 앱 공통 코드로 치환
    const mappedCode = source.code ? NETWORK_ERROR_CODE_MAP[source.code] : undefined;
    const code = mappedCode ?? DOMAIN_DEFAULT_CODES.NETWORK;
    const rawMessage = source.message;

    // 위에서 정한 코드에 맞춰 메시지 선택
    const message = resolveMessage({
        code,                    // 네트워크 전용 코드 → ERROR_MESSAGES 우선
        fallbackMessage,         // 호출부에서 지정한 기본 문구 (없을 수 있음)
        serverMessage: rawMessage // 클라이언트가 전달한 원본 메시지
    });

    return {
        domain,
        code,
        message,
        rawMessage,
        statusCode: 0,
        origin: 'network',
        details: {
            url: source.request?.url,
            method: source.request?.method,
            rawCode: source.code,
            rawMessage
        },
        timestamp: new Date().toISOString()
    };
};


// ------------------------------------------------------------
// 서버가 응답을 내려준 오류를 AppError로 변환하는 공통 빌더
// 어떤 클라이언트에서도 ServerErrorSource 형태만 맞춰 전달하면 동일하게 처리됩니다.
const buildServerErrorFromSource = (
    source: ServerErrorSource,
    options: {
        fallbackDomain: ErrorDomain;
        fallbackCode: string;
        fallbackMessage: string;
        fallbackStatus: number;
    }
): AppError => {
    const response = source.response ?? {};
    const body = response.data ?? {};
    const rawMessage = typeof body.message === 'string' ? body.message : undefined;

    // 1) 도메인 결정: 응답 바디에 domain이 있으면 사용, 없으면 fallback
    const domain =
        (body.domain as ErrorDomain | undefined) ?? options.fallbackDomain;

    // 2) 상태 코드: 응답에 없으면 fallbackStatus 사용
    const status =
        (response.status as HttpStatusCode | undefined) ?? options.fallbackStatus;

    // 3) 코드 결정: 서버 code → 상태코드 기반 → fallbackCode 순으로 우선
    const code =
        (body.code as string | undefined) ??
        mapStatusToDomainCode(status, domain) ??
        options.fallbackCode;

    // 4) 메시지 결정: 서버 message → 코드별 메시지 → fallbackMessage 순
    const message = resolveMessage({
        code,                                      // 상태/도메인 기반으로 결정된 코드
        fallbackMessage: options.fallbackMessage,  // 호출자가 지정한 기본 문구
        serverMessage: rawMessage                  // 서버에서 내려준 원본 메시지
    });

    // 5) traceId 추출: 헤더 우선 → 바디 traceId → 없으면 undefined
    const traceIdFromHeaders =
        typeof response.headers?.['x-trace-id'] === 'string'
            ? response.headers['x-trace-id']
            : undefined;

    return {
        domain,
        code,
        message,
        rawMessage,
        statusCode: status,
        origin: 'server',
        details: {
            url: source.request?.url,
            method: source.request?.method,
            data: body,
            rawMessage
        },
        traceId: traceIdFromHeaders ?? body.traceId,
        timestamp: new Date().toISOString()
    };
};


// ------------------------------------------------------------
// axios 전용 래퍼: AxiosError에서 ServerErrorSource를 구성해 공통 빌더로 전달
const buildServerErrorFromAxios = (
    error: AxiosError,
    options: {
        domain: ErrorDomain;
        fallbackCode: string;
        fallbackMessage: string;
        fallbackStatus: number;
    }
): AppError => {
    return buildServerErrorFromSource(
        {
            response: {
                status: error.response?.status,
                data: error.response?.data as ServerErrorSource['response']['data'],
                headers: error.response?.headers as Record<string, string | undefined> | undefined
            },
            request: {
                url: error.config?.url,
                method: error.config?.method
            }
        },
        {
            fallbackDomain: options.domain,
            fallbackCode: options.fallbackCode,
            fallbackMessage: options.fallbackMessage,
            fallbackStatus: options.fallbackStatus
        }
    );
};


// ------------------------------------------------------------
// fetch 기반 래퍼: HttpErrorPayload에서 ServerErrorSource를 구성해 공통 빌더로 전달
const buildServerErrorFromHttp = (
    error: HttpErrorPayload,
    options: {
        domain: ErrorDomain;
        fallbackCode: string;
        fallbackMessage: string;
        fallbackStatus: number;
    }
): AppError => {
    return buildServerErrorFromSource(
        {
            response: {
                status: error.response?.status,
                data: (error.response?.data ?? error.body) as ServerErrorSource['response']['data'],
                headers: error.response?.headers
            },
            request: error.request
        },
        {
            fallbackDomain: options.domain,
            fallbackCode: options.fallbackCode,
            fallbackMessage: options.fallbackMessage,
            fallbackStatus: options.fallbackStatus
        }
    );
};



// ------------------------------------------------------------
// toAppError 진입점
// 어떤 종류의 예외(axios, fetch, 일반 Error, 문자열 등)가 들어오더라도 AppError로 정규화합니다.
export const toAppError = (
    error: unknown,
    options?: NormalizerOptions
): AppError => {

    // 1) 호출자가 전달한 fallback 값들을 우선 확정합니다.
    const domain = options?.fallbackDomain ?? 'SYSTEM';
    const fallbackCode = options?.fallbackCode ?? DOMAIN_DEFAULT_CODES[domain];
    const fallbackMessage =
        options?.fallbackMessage ?? '예상치 못한 오류가 발생했습니다.';
    const fallbackStatus = options?.fallbackStatus ?? 500;

    // 2) axios에서 던진 오류 + 서버 응답이 포함된 경우
    if (isAxiosError(error) && error.response) {
        return buildServerErrorFromAxios(error, {
            domain,
            fallbackCode,
            fallbackMessage,
            fallbackStatus
        });
    }

    // 3) axios에서 던진 오류인데 응답 자체를 받지 못한 네트워크 계열
    if (isAxiosError(error)) {
        return buildNetworkErrorFromSource(
            {
                code: error.code,
                message: error.message,
                request: {
                    url: error.config?.url,
                    method: error.config?.method
                }
            },
            fallbackMessage
        );
    }

    // 4) fetch 기반 래퍼에서 던진 오류인지 확인
    if (isHttpErrorPayload(error)) {
        return buildServerErrorFromHttp(error, {
            domain,
            fallbackCode,
            fallbackMessage,
            fallbackStatus
        });
    }

    // 5) 일반 Error 인스턴스(런타임 예외 등)
    if (error instanceof Error) {
        const message = resolveMessage({
            code: options?.fallbackCode, // 클라이언트 에러는 코드가 없을 수 있어 fallback 활용
            fallbackMessage,             // 사용자에게 보여줄 기본 문구
            serverMessage: error.message // 원본 오류 메시지(디버깅용)
        });

        return {
            domain: options?.fallbackDomain ?? 'CLIENT',
            code: options?.fallbackCode ?? DOMAIN_DEFAULT_CODES.CLIENT,
            message,
            rawMessage: error.message,
            statusCode: fallbackStatus,
            origin: 'client',
            details: { stack: error.stack },
            timestamp: new Date().toISOString(),
            originalError: error
        };
    }

    // 6) 문자열, 숫자 등 완전히 알 수 없는 값이 들어온 경우
    return {
        domain,
        code: fallbackCode,
        message:
            typeof error === 'string' && error.trim().length > 0
                ? error
                : fallbackMessage,
        rawMessage:
            typeof error === 'string' && error.trim().length > 0
                ? error
                : undefined,
        statusCode: fallbackStatus,
        origin: 'unknown',
        details: { raw: error },
        timestamp: new Date().toISOString()
    };
};