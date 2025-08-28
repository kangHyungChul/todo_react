import { NextResponse, NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export const config = {
    matcher: [
        '/auth/:path*'
    ]
};

export const middleware = async (req: NextRequest) => {
    const res = NextResponse.next();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get: (name: string) => req.cookies.get(name)?.value,
                set: (name: string, value: string, options: any) => {
                    res.cookies.set({ name, value, ...options });
                },
                remove: (name: string, options: any) => {
                    res.cookies.set({ name, value: '', ...options });
                }
            }
        }
    );

    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
        const returnTo = encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search);
        return NextResponse.redirect(new URL(`/login?returnTo=${returnTo}`, req.url));
    }

    return res;
};