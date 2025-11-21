// src/lib/types/error.ts
// ------------------------------------------------------------
// 하위 호환성을 위한 re-export 파일입니다.
// 
// 주의: 새 코드에서는 '@/lib/api/error'를 직접 사용하세요.
// 이 파일은 기존 코드와의 호환성을 위해 유지됩니다.
//
// 사용 권장:
// - import { AppError, toAppError, Logger } from '@/lib/api/error';
//
// 하위 호환:
// - import type { AppError } from '@/lib/types/error'; (여전히 작동)

export type {
    AppError,
    ErrorDomain,
    ErrorType,
    ErrorSeverity,
    AppErrorOrigin,
    NormalizerOptions,
    ServerErrorSource,
    NetworkErrorSource,
    HttpErrorPayload
} from '@/lib/api/error';
