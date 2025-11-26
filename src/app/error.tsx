'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { RefreshCcwIcon } from 'lucide-react';
// import { toAppError } from '@/lib/api/error';
// import { Logger } from '@/lib/api/error/logger';
import Button from '@/components/common/Button';
import LinkButton from '@/components/common/LinkButton';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        // // 1. AppError로 변환 (기본적으로 RUNTIME 타입이 됨)
        // const appError = toAppError(error, { 
        //     type: 'RUNTIME', 
        // });

        // // 2. 통합 로거를 통해 Sentry/Slack 전송
        // // (비동기 함수이므로 void 처리)
        // void Logger.error(appError);
        
        // 개발 환경 콘솔 출력은 Logger 내부에서 처리하거나, 필요시 유지
        if (process.env.NODE_ENV === 'development') {
            console.error('[GlobalError Caught]', error);
        }
    }, [error]);

    const handleReset = () => {
        // 1. 서버 컴포넌트 데이터 갱신 (RSC Refresh)
        //    - 이를 통해 서버 컴포넌트를 다시 실행하고 새로운 데이터를 받아옵니다.
        router.refresh();
        
        // 2. Error Boundary 리셋
        //    - UI 상태를 초기화하고 다시 렌더링을 시도합니다.
        reset();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
            <div className="space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                        className="w-8 h-8 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-center">
                    문제가 발생했습니다
                </h2>
                <p className="text-muted-foreground max-w-[500px] mx-auto">
                    페이지를 불러오는 도중 예기치 않은 오류가 발생했습니다.<br />
                    잠시 후 다시 시도해 주세요.
                </p>
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-4 p-4 bg-slate-100 rounded-lg text-sm overflow-auto max-w-[600px] max-h-[200px] text-center">
                        <p className="font-bold text-red-500">{error.name}</p>
                        <p className="text-slate-700">{error.message}</p>
                    </div>
                )}
            </div>
            <div className="mt-8 flex gap-4">
                <Button onClick={() => handleReset()}>다시 시도</Button>
                <LinkButton variant="primary" href="/">홈으로 이동</LinkButton>
            </div>
        </div>
    );
}
