// src/lib/api/error/mappers/message.mapper.ts
// ------------------------------------------------------------
// 에러 메시지 해석 로직입니다.
//
// 목적:
// - AppError.message를 결정하는 순수 함수
// - 서버 메시지, 코드 기반 메시지, 클라이언트 메시지의 우선순위 처리
//
// 사용 시나리오:
// - 서버가 보내준 원본 메시지가 있는 경우 우선 사용
// - 코드에 대응하는 사전 정의된 메시지 사용
// - 클라이언트가 지정한 기본 메시지 사용
// - 모든 정보가 없을 때 안전망 메시지 사용
//
// 비대한 로직 분리:
// - 이 파일은 메시지 해석 로직만 담당 (비대한 로직 분리 원칙)
// - 핸들러에서 이 매퍼를 사용하여 최종 메시지 결정

import { ERROR_MESSAGES } from '@/constants/errorMessages';

// ------------------------------------------------------------
// ResolveMessageParams
// ------------------------------------------------------------
// 메시지 해석에 필요한 파라미터 타입입니다.
//
// 필드 설명:
// - code: ERROR_MESSAGES에서 찾을 key (없을 수 있음)
// - message: code로도 찾지 못했을 때 사용할 기본 문구
// - serverMessage: 서버에서 내려준 원본 메시지 (디버깅/보조 설명용)
interface ResolveMessageParams {
    // 에러 코드 (ERROR_MESSAGES에서 찾을 key)
    // - 예: 'FLIGHT_DEFAULT_ERROR'
    // - ERROR_MESSAGES에 매핑되어 있으면 해당 메시지 사용
    code?: string;
    
    // 클라이언트가 지정한 기본 메시지
    // - code로도 찾지 못했을 때 사용
    // - options.message 또는 metadata.message
    message?: string;
    
    // 서버에서 내려준 원본 메시지
    // - 가장 구체적이고 정확한 메시지
    // - 우선순위 1순위
    // - 사용자 노출용이 아닐 수 있음 (기술적 메시지)
    serverMessage?: string;
}

// ------------------------------------------------------------
// resolveMessage
// ------------------------------------------------------------
// AppError.message를 결정하는 공통 함수입니다.
//
// 우선순위:
// 1. serverMessage (서버가 보내준 원본 메시지) - 가장 구체적이고 정확
// 2. code 기반 ERROR_MESSAGES 매핑 - 일관성 유지
// 3. message (클라이언트가 지정한 기본 메시지) - fallback
// 4. 기본 안전망 메시지 - 모든 정보가 없을 때
//
// 사용 예시:
// - const message = resolveMessage({ code: 'FLIGHT_DEFAULT_ERROR', serverMessage: '항공편을 찾을 수 없습니다.' });
//   → '항공편을 찾을 수 없습니다.' (serverMessage 우선)
//
// - const message = resolveMessage({ code: 'FLIGHT_DEFAULT_ERROR' });
//   → ERROR_MESSAGES['FLIGHT_DEFAULT_ERROR'] (code 기반)
//
// - const message = resolveMessage({ message: '항공편 조회 실패' });
//   → '항공편 조회 실패' (클라이언트 메시지)
//
// - const message = resolveMessage({});
//   → '예상치 못한 오류가 발생했습니다.' (안전망)
//
// 반환값:
// - string: 사용자에게 노출할 최종 메시지
export const resolveMessage = ({
    code,
    message,
    serverMessage
}: ResolveMessageParams): string => {
    // 1) 서버에서 내려준 원본 메시지가 있다면 최우선 사용 (가장 구체적이고 정확)
    // - 서버가 보내준 메시지는 가장 구체적이고 정확한 정보
    // - 예: '항공편 FL1234를 찾을 수 없습니다.'
    if (serverMessage && serverMessage.trim().length > 0) {
        return serverMessage;
    }

    // 2) code가 존재하고 ERROR_MESSAGES에 매핑되어 있다면 그 문구 사용 (일관성 유지)
    // - 코드 기반 메시지는 일관된 사용자 경험 제공
    // - 예: 'FLIGHT_DEFAULT_ERROR' → '항공편 정보를 불러올 수 없습니다.'
    if (code) {
        const preset = ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES];
        if (preset) return preset;
    }

    // 3) 클라이언트가 지정한 message가 있다면 사용 (fallback)
    // - 호출부에서 지정한 기본 메시지
    // - 예: options.message 또는 metadata.message
    if (message) {
        return message;
    }

    // 4) 어떤 정보도 없다면 공통 안전망 문구로 안내
    // - 모든 정보가 없을 때 사용하는 기본 메시지
    // - 사용자에게 친화적인 안내 메시지
    return '예상치 못한 오류가 발생했습니다.';
};

