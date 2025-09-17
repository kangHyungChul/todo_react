// src/lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isProtectedPath, isAuthOnlyPath } from '@/lib/auth/route';

export const updateSession = async (request: NextRequest) => {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => 
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // 디버깅을 위한 로그 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
        console.log('[Middleware] Path:', request.nextUrl.pathname);
        console.log('[Middleware] User:', user ? `${user.email} (${user.id})` : 'No user');
    }

    // // 비로그인 사용자 접근 불가능한 페이지 (인증 필요)
    // const authRequiredPaths = [
    //     // '/flight/arrival',
    //     // '/flight/departure', 
    //     '/flight/detail',
    //     // 향후 추가될 사용자 전용 페이지들
    // ];

    // // 로그인 사용자 접근 불가능한 페이지 (인증 후 불필요)
    // const authBlockedPaths = [
    //     '/auth/:path*',
    //     // '/auth/signup',
    // ];

    // 누구나 접근 가능한 페이지 (특별 처리 없음)
    // const publicPaths = [
    //     '/',
    //     '/auth/callback',
    //     '/auth/complete',
    // ];

    const pathname = request.nextUrl.pathname;

    // 경로 매칭 확인
    const needsAuth = isProtectedPath(pathname);
    const blockedForAuth = isAuthOnlyPath(pathname);

    // 비로그인 사용자가 인증 필요 페이지 접근 시 로그인으로 리다이렉트
    if (!user && needsAuth) {
        // 미인증 사용자가 보호된 경로에 접근할 때 로그인 페이지로 리다이렉트
        console.log('[Middleware] Unauthenticated user accessing protected route, redirecting to login');
        const url = request.nextUrl.clone();
        url.pathname = '/auth/login';
        // redirectTo 파라미터에 인코딩된 경로를 사용하여 슬래시 등 특수문자 문제 방지
        url.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(url);
    }

    // 로그인 사용자가 인증 차단 페이지 접근 시 홈으로 리다이렉트
    if (user && blockedForAuth) {
        console.log('[Middleware] Authenticated user accessing auth-blocked page, redirecting to home');
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
};

export default updateSession;