// src/app/error.tsx
// 전역 에러 페이지(루트 세그먼트). Next.js App Router에서는 error.tsx가 "클라이언트 컴포넌트"여야 함
// - SSR/CSR 어디서 던져진 예외든 이 경계에서 사용자에게 안전한 메시지를 노출
// - reset() 호출로 해당 경계를 초기화하고 재시도
// - 개발환경에서는 디버깅 편의를 위해 에러 상세 노출(운영환경에서는 숨김)

'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';

// 에러 경계로부터 전달되는 props 타입
type GlobalErrorProps = {
    error: Error;            // 던져진 에러 객체(직렬화 불가 속성 일부는 undefined일 수 있음)
    reset: () => void;       // 경계 초기화 후 해당 세그먼트 재렌더
};

// 환경 플래그(Next 15에서도 process.env.NODE_ENV는 클라이언트 번들에 인라인됨)
const isDev = process.env.NODE_ENV !== 'production';

// 사용자 친화 메시지 매핑(프로젝트의 ERROR_MESSAGES/i18n 도입 전 임시 버전)
// - 실제로는 userMessageKey 기반(i18n 딕셔너리)으로 치환하도록 개선 가능
const pickUserFriendlyMessage = (err: Error): string => {
    // 가장 흔한 케이스를 우선 처리(권한/네트워크/알 수 없음)
    const msg = String(err?.message || '').toLowerCase();

    if (msg.includes('unauthorized') || msg.includes('forbidden') || msg.includes('permission')) {
        return '권한이 없습니다. 로그인 상태를 확인해 주세요.';
    }
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('axios')) {
        return '네트워크 상태를 확인해 주세요. 잠시 후 다시 시도해 주세요.';
    }
    if (msg.includes('not found') || msg.includes('404')) {
        return '요청하신 페이지를 찾을 수 없습니다.';
    }
    return '문제가 발생했습니다. 잠시 후 다시 시도해 주세요.';
};

const GlobalError = ({ error, reset }: GlobalErrorProps) => {
    // 사용자에게 보여줄 1차 메시지(민감 정보/내부 스택 노출 금지)
    const userMessage = useMemo(() => pickUserFriendlyMessage(error), [error]);

    // 개발환경에서는 콘솔에 원본 에러를 출력해 디버깅 편의 제공
    useEffect(() => {
        if (isDev) {
            console.error('[GlobalError] ', error);
        }
    }, [error]);

    // UI는 단순하고 행동 지향적으로 구성(재시도/홈 이동/문의)
    return (
        <html lang="ko">
            <body className="min-h-dvh bg-neutral-50 text-neutral-900">
                <main className="mx-auto flex min-h-dvh max-w-screen-sm flex-col items-center justify-center gap-6 p-6">
                    {/* 사용자에게 전달할 1차 메시지 */}
                    <h1 className="text-2xl font-semibold">문제가 발생했습니다</h1>
                    <p className="text-base text-neutral-700">{userMessage}</p>

                    {/* 개발환경에서만 디버깅용 상세 메시지/스택을 노출 */}
                    {isDev && (
                        <details className="w-full rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-800">
                            <summary className="cursor-pointer select-none font-medium">
                                디버그 정보(개발환경에서만 표시)
                            </summary>
                            <pre className="mt-3 overflow-auto whitespace-pre-wrap text-xs leading-relaxed">
                                {String(error?.stack || error?.message || 'no stack')}
                            </pre>
                        </details>
                    )}

                    {/* 액션 영역: 다시 시도 / 홈으로 / 문의하기 */}
                    <div className="mt-2 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => reset()} // 경계 초기화 → 현재 세그먼트 재시도
                            className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-100 active:bg-neutral-200"
                            aria-label="다시 시도"
                        >
                            다시 시도
                        </button>

                        <Link
                            href="/"
                            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 active:bg-neutral-700"
                            aria-label="홈으로 이동"
                        >
                            홈으로
                        </Link>

                        {/* 문의/지원 경로가 있다면 연결(향후 실제 경로로 교체) */}
                        <Link
                            href="/support"
                            className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-100 active:bg-neutral-200"
                            aria-label="문의하기"
                        >
                            문의하기
                        </Link>
                    </div>

                    {/* 접근성: 스크린리더용 안내 */}
                    <span className="sr-only">
                        오류가 발생했습니다. 다시 시도 버튼을 눌러 복구를 시도하거나 홈으로 이동해 주세요.
                    </span>
                </main>
            </body>
        </html>
    );
};

export default GlobalError;
