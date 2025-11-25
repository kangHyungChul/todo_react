// src/app/error.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { toAppError, Logger } from '@/lib/api/error';

type GlobalErrorProps = {
    error: Error;
    reset: () => void;
};

const isDev = process.env.NODE_ENV !== 'production';

const GlobalError = ({ error, reset }: GlobalErrorProps) => {

    // 개발환경용 콘솔애러
    useEffect(() => {
        // 1. AppError로 변환 (기본적으로 RUNTIME 타입이 됨)
        const appError = toAppError(error, { 
            type: 'RUNTIME'
        });

        // 2. 통합 로거를 통해 Sentry/Slack 전송
        // (비동기 함수이므로 void 처리)
        void Logger.error(appError);
        
        // 개발 환경 콘솔 출력은 Logger 내부에서 처리하거나, 필요시 유지
        if (process.env.NODE_ENV === 'development') {
            console.error('[GlobalError Caught]', error);
        }
    }, [error]);

    return (
        <div className="flex flex-col gap-6 justify-center items-center p-6 mx-auto max-w-screen-sm min-h-dvh">
            <h1 className="text-2xl font-semibold text-red-500">ERROR!</h1>
            <p className="text-base text-neutral-700">문제가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>

            {/* 개발환경용 디버깅 메세지 */}
            {isDev && (
                <details className="p-4 w-full text-sm bg-white rounded-lg border border-neutral-200 text-neutral-800">
                    <summary className="font-medium cursor-pointer select-none">
                        디버그 정보(개발환경에서만 표시)
                    </summary>
                    <pre className="overflow-auto mt-3 text-xs leading-relaxed whitespace-pre-wrap">
                        {String(error?.stack || error?.message || 'no stack')}
                    </pre>
                </details>
            )}

            <div className="flex gap-3 items-center mt-2">
                <button
                    type="button"
                    onClick={() => reset()}
                    className="px-4 py-2 text-sm font-medium bg-white rounded-xl border border-neutral-300 hover:bg-neutral-100 active:bg-neutral-200"
                    aria-label="다시 시도"
                >
                    다시 시도
                </button>

                <Link
                    href="/"
                    className="px-4 py-2 text-sm font-medium text-white rounded-xl bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700"
                    aria-label="홈으로 이동"
                >
                    홈으로
                </Link>

                <Link
                    href="/support"
                    className="px-4 py-2 text-sm font-medium bg-white rounded-xl border border-neutral-300 hover:bg-neutral-100 active:bg-neutral-200"
                    aria-label="문의하기"
                >
                    문의하기
                </Link>
            </div>
        </div>
    );
};

export default GlobalError;
