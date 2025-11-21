// src/lib/api/error-normalizer.ts
// ------------------------------------------------------------
//    분리된 모듈을 다시 export 해 줍니다.
//    (하위 호환성을 위해 유지, 새 코드에서는 './error'를 직접 사용 권장)

export { toAppError, Logger } from './error';
export type { NormalizerOptions } from './error';