// src/lib/api/error/utils/guards.ts
// ------------------------------------------------------------
// 타입 가드 함수 모음입니다.
//
// 목적:
// - 다양한 에러 소스를 타입 안전하게 판별
// - toAppError에서 에러 타입에 따라 적절한 핸들러 선택
// - TypeScript의 타입 좁히기(Type Narrowing) 활용
//
// 사용 패턴:
// - if (isAxiosError(error)) { ... } 형태로 사용
// - 타입 가드가 true를 반환하면 해당 타입으로 좁혀짐

import type { AxiosError } from 'axios';
import type { HttpErrorPayload, NetworkErrorSource } from '../types';

// ------------------------------------------------------------
// isAxiosError
// ------------------------------------------------------------
// 값이 AxiosError인지 판별하는 타입 가드입니다.
//
// 판별 기준:
// - value가 객체이고
// - isAxiosError 속성이 true인 경우
//
// 사용 시나리오:
// - Axios 인스턴스에서 throw된 에러인지 확인
// - AxiosError인 경우 handleHttpError로 처리
//
// 예시:
// - if (isAxiosError(error)) { ... } 
//   → 이 블록 내에서 error는 AxiosError 타입으로 좁혀짐
//
// 주의사항:
// - AxiosError는 response 속성이 있을 수도 있고 없을 수도 있음
// - response가 있으면 HTTP 에러, 없으면 네트워크 에러
export const isAxiosError = (value: unknown): value is AxiosError => {
    return !!(
        value && 
        typeof value === 'object' && 
        (value as AxiosError).isAxiosError === true
    );
};

// ------------------------------------------------------------
// isHttpErrorPayload
// ------------------------------------------------------------
// 값이 HttpErrorPayload인지 판별하는 타입 가드입니다.
//
// 판별 기준:
// - value가 객체이고
// - response 속성이 있고
// - response.status가 숫자인 경우
//
// 사용 시나리오:
// - Fetch 기반 클라이언트(safeServerFetch 등)에서 throw된 에러인지 확인
// - HttpErrorPayload인 경우 handleHttpError로 처리
//
// 예시:
// - if (isHttpErrorPayload(error)) { ... }
//   → 이 블록 내에서 error는 HttpErrorPayload 타입으로 좁혀짐
//
// 주의사항:
// - response.status가 숫자면 서버 응답을 정상적으로 받은 상황
// - 즉, HTTP 에러(4xx, 5xx)이지만 네트워크 에러는 아님
export const isHttpErrorPayload = (value: unknown): value is HttpErrorPayload => {
    if (!value || typeof value !== 'object') return false;
    
    const { response } = value as HttpErrorPayload;
    
    // response가 있고 status가 숫자면 HttpErrorPayload
    return !!response && typeof response.status === 'number';
};

// ------------------------------------------------------------
// isNetworkError
// ------------------------------------------------------------
// 값이 NetworkErrorSource인지 판별하는 타입 가드입니다.
//
// 판별 기준:
// - value가 객체이고
// - (code 또는 message) 속성이 있고
// - response 속성이 없는 경우
//
// 사용 시나리오:
// - 네트워크 타임아웃, 연결 실패 등 HTTP 응답이 없는 에러인지 확인
// - NetworkErrorSource인 경우 handleNetworkError로 처리
//
// 예시:
// - if (isNetworkError(error)) { ... }
//   → 이 블록 내에서 error는 NetworkErrorSource 타입으로 좁혀짐
//
// 주의사항:
// - HTTP 응답이 없는 경우만 NetworkErrorSource
// - AxiosError이지만 response가 없는 경우도 네트워크 에러
export const isNetworkError = (value: unknown): value is NetworkErrorSource => {
    if (!value || typeof value !== 'object') return false;
    
    const err = value as NetworkErrorSource;
    
    // code 또는 message가 있고, response가 없으면 NetworkErrorSource
    return !!(err.code || err.message) && !('response' in err);
};

