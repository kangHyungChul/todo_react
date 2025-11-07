// src/lib/api/error/normalizer/builders/networkBuilder.ts
// ------------------------------------------------------------
// - 서버에 도달하지 못한 네트워크 계열 오류를(AppError.origin === 'network') 정규화합니다.
// - axios/fetch 등 클라이언트가 제공하는 에러 코드(예: ECONNABORTED)를
//   우리가 정의한 ERROR_CODES.NETWORK.* 로 치환해 일관된 AppError를 생성합니다.

import type { AppError, ErrorDomain, NetworkErrorSource } from '@/lib/types/error';
import { resolveMessage } from '../messageResolver';
import { DOMAIN_DEFAULT_CODES } from '../statusCodeMapper';
import { ERROR_CODES } from '@/constants/errorCodes';

// ------------------------------------------------------------
// 클라이언트(axios 등)에서 넘어오는 네트워크 에러 코드를
// 프로젝트 내부의 공통 코드로 대응시키기 위한 매핑 테이블입니다.
const NETWORK_ERROR_CODE_MAP: Record<string, string> = {
    ECONNABORTED: ERROR_CODES.NETWORK.TIMEOUT,          // axios 타임아웃
    ERR_NETWORK: ERROR_CODES.NETWORK.UNREACHABLE,       // axios Generic Network Error
    ERR_CANCELED: ERROR_CODES.NETWORK.REQUEST_CANCELLED // axios 요청 취소
};

// ------------------------------------------------------------
// NetworkErrorSource → AppError 변환 함수
// - 서버 응답이 없으므로 statusCode는 0으로 고정합니다.
// - 네트워크 오류 메시지를 사용자 문구와 rawMessage로 분리해 저장합니다.
export const buildNetworkErrorFromSource = (
    source: NetworkErrorSource,
    fallbackMessage: string
): AppError => {
    const domain: ErrorDomain = 'NETWORK';

    // 1) axios 등에서 제공한 코드(ECONNABORTED 등)를 공통 코드로 치환
    const mappedCode = source.code ? NETWORK_ERROR_CODE_MAP[source.code] : undefined;
    const code = mappedCode ?? DOMAIN_DEFAULT_CODES.NETWORK;
    const rawMessage = source.message;

    // 2) 사용자에게 보여줄 문구 결정
    const message = resolveMessage({
        code,
        fallbackMessage,
        serverMessage: rawMessage
    });

    // 3) AppError 구조로 조립
    return {
        domain,
        code,
        message,
        rawMessage,
        statusCode: 0, // 네트워크 계열은 HTTP 응답 자체가 없으므로 0으로 고정
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