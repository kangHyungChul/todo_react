// src/lib/api/error/normalizer/guards.ts
// ------------------------------------------------------------
// axios/fetch 기반에서 던져진 오류인지 판별하는 타입 가드 모음입니다.
// toAppError 내부에서 오류 유형을 정확히 식별하기 위해 사용됩니다.

import type { AxiosError } from 'axios';
import type { HttpErrorPayload } from '@/lib/types/error';

// 값이 AxiosError인지 판별합니다.
// axios 인스턴스에서 throw된 에러 여부를 확인할 때 사용합니다.
export const isAxiosError = (value: unknown): value is AxiosError => {
    return !!(value && typeof value === 'object' && (value as AxiosError).isAxiosError);
};

// fetch 래퍼에서 던진 HttpErrorPayload인지 판별합니다.
// response.status가 숫자면 서버 응답을 정상적으로 받은 상황이므로,
// ServerErrorSource로 변환할 수 있습니다.
export const isHttpErrorPayload = (value: unknown): value is HttpErrorPayload => {
    if (!value || typeof value !== 'object') return false;
    const { response } = value as HttpErrorPayload;
    return !!response && typeof response.status === 'number';
};