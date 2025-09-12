// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { supabaseSSR } from '@/lib/supabase/server';

export const POST = async () => {
    try {
        const { error } = await(await supabaseSSR()).auth.signOut();

        if (error) {
            console.error('Logout error:', error);
            return NextResponse.json({ 
                ok: false, 
                message: `로그아웃에 실패했습니다: ${error.message}`,
                // data: error
            }, { status: 400 });
        }

        return NextResponse.json({
            ok: true,
            message: '로그아웃에 성공했습니다.',
        }, { status: 200 });

    } catch (error) {
        console.error('로그아웃 서버 오류:', error);
        return NextResponse.json({ error: '로그아웃 서버 오류 실패' }, { status: 500 });
    }
};
