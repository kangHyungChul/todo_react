'use client';

const LoadingProgress = (
) => {
    return (
        <div className="fixed inset-0 w-full h-full bg-black/50 flex justify-center items-center">
            <div className="flex items-center justify-center">
                <svg
                    className="animate-spin w-16 h-16 text-primary"
                    viewBox="0 0 50 50"
                    fill="none"
                >
                    {/* 배경 원 (연한 회색) */}
                    <circle
                        className="opacity-20"
                        cx="25"
                        cy="25"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="5"
                    />
                    {/* 진행 원 (진한 색) */}
                    <circle
                        cx="25"
                        cy="25"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray="90 130"
                        strokeDashoffset="0"
                    />
                </svg>
            </div>
        </div>
    );
};


export default LoadingProgress;