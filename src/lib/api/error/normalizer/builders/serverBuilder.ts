// src/lib/api/error/normalizer/builders/serverBuilder.ts
// ------------------------------------------------------------
// - 서버(또는 외부 API)가 HTTP 응답을 내려준 뒤 실패한 케이스를 AppError로 정규화합니다.
// - axios, fetch 등 어떤 HTTP 클라이언트든 `ServerErrorSource` 형태만 맞춰 던지면 동일한 로직으로 처리할 수 있습니다.

import type {
    AppError,
    ErrorDomain,
    HttpStatusCode,
    ServerErrorSource
} from '@/lib/types/error';
import { resolveMessage } from '../messageResolver';
import { mapStatusToDomainCode } from '../statusCodeMapper';

// ------------------------------------------------------------
// AppError를 만들 때 fallback으로 사용할 값들을 모은 옵션입니다.
// - fallbackDomain: 서버가 domain을 내려주지 않을 때 사용할 도메인
// - fallbackCode: 코드가 없을 때 사용할 기본 코드
// - fallbackMessage: 사용자에게 보여줄 기본 문구
// - fallbackStatus: HTTP 상태코드가 없을 때 사용할 값
export interface BuildServerErrorOptions {
    fallbackDomain: ErrorDomain;
    fallbackCode: string;
    fallbackMessage: string;
    fallbackStatus: number;
}

// ------------------------------------------------------------
// ServerErrorSource → AppError 변환 함수
// - response.data.domain/code/message 등을 읽어 AppError에 맞게 정리합니다.
// - traceId, 요청 정보 등 디버깅에 필요한 정보도 details에 담아 반환합니다.
export const buildServerErrorFromSource = (
    source: ServerErrorSource,
    options: BuildServerErrorOptions
): AppError => {
    // ✅ 서버로부터 받은 응답 정보와 요청 정보를 꺼냅니다.
    const response = source.response ?? {};
    const body = response.data ?? {};
    const rawMessage = typeof body.message === 'string' ? body.message : undefined;

    // 1) 도메인 결정: 서버가 domain을 내려준 경우 우선 사용하고, 없으면 fallback
    const domain =
        (body.domain as ErrorDomain | undefined) ?? options.fallbackDomain;

    // 2) 상태코드: 서버가 status를 내려주지 않았다면 fallbackStatus 사용
    const status =
        (response.status as HttpStatusCode | undefined) ?? options.fallbackStatus;

    // 3) 에러 코드: 서버 code → 상태코드 기반 추정 → fallback 순서로 결정
    const code =
        (body.code as string | undefined) ??
        mapStatusToDomainCode(status, domain) ??
        options.fallbackCode;

    // 4) 메시지: 코드 기반 문구 → fallbackMessage → 서버 원본 순서로 선택
    const message = resolveMessage({
        code,
        fallbackMessage: options.fallbackMessage,
        serverMessage: rawMessage
    });

    // 5) traceId: 헤더의 x-trace-id 또는 바디의 traceId 중 하나를 사용
    const traceIdFromHeaders =
        typeof response.headers?.['x-trace-id'] === 'string'
            ? response.headers['x-trace-id']
            : undefined;

    // ✅ AppError 구조로 통합
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