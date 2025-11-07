// src/lib/api/error/normalizer/messageResolver.ts
// ------------------------------------------------------------
// AppError.message를 결정하는 순수 함수 모음입니다.
// 에러 코드에 대응하는 기본 문구 → 호출자가 지정한 fallback → 서버 원본 메시지
// 순서대로 처리해 사용자에게 보여줄 최종 문구를 선택합니다.

import { ERROR_MESSAGES } from '@/constants/errorMessages';

// message를 어떻게 생성할지 설명하는 타입입니다.
interface ResolveMessageParams {
    code?: string;           // ERROR_MESSAGES에서 찾을 key (없을 수 있음)
    fallbackMessage?: string; // code로도 찾지 못했을 때 사용할 기본 문구
    serverMessage?: string;   // 서버에서 내려준 원본 메시지 (디버깅/보조 설명용)
}

// AppError.message를 결정하는 공통 함수입니다.
export const resolveMessage = ({
    code,
    fallbackMessage,
    serverMessage
}: ResolveMessageParams): string => {
    // 1) code가 존재하고 ERROR_MESSAGES에 매핑되어 있다면 그 문구를 최우선으로 사용
    if (code) {
        const preset = ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES];
        if (preset) return preset;
    }

    // 2) fallbackMessage가 있다면 호출자가 직접 지정한 문구를 사용
    if (fallbackMessage) {
        return fallbackMessage;
    }

    // 3) 서버에서 내려준 원본 메시지가 있다면 이를 그대로 보여줌
    if (serverMessage && serverMessage.trim().length > 0) {
        return serverMessage;
    }

    // 4) 어떤 정보도 없다면 공통 안전망 문구로 안내
    return '예상치 못한 오류가 발생했습니다.';
};