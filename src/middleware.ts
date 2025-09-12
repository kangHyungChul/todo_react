// middleware.ts
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
    // API 라우트는 미들웨어에서 제외 (각 API에서 개별 처리)
    if (request.nextUrl.pathname.startsWith('/api/')) {
        return;
    }
    
    return await updateSession(request);
}

export const config = {
    matcher: [
        /*
         * 다음을 제외한 모든 경로에서 실행:
         * - /api (API routes)
         * - /_next/static (static files)
         * - /_next/image (image optimization files)
         * - /favicon.ico (favicon file)
         * - 이미지 파일들
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
