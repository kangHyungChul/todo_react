// src/lib/auth/routes.ts
export const AUTH_ROUTES = {
    // 공개경로
    PUBLIC: [
        '/',
        '/auth/:path*',
        // '/auth/signup',
        // '/auth/callback',
        // '/auth/complete',
    ],

    // 비공개 경로
    PROTECTED: [
        '/flight/detail/',
    ],

    // 인증 전용 경로
    AUTH_ONLY: [
        '/auth/login',
        '/auth/signup',
    ]
} as const;

// 경로 체크 유틸리티 함수
export const isProtectedPath = (pathname: string): boolean => {
    return AUTH_ROUTES.PROTECTED.some(path => pathname.startsWith(path));
};

export const isPublicPath = (pathname: string): boolean => {
    return AUTH_ROUTES.PUBLIC.some(path => pathname.startsWith(path));
};

export const isAuthOnlyPath = (pathname: string): boolean => {
    return AUTH_ROUTES.AUTH_ONLY.some(path => pathname === path);
};