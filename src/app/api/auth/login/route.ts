// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
// import { supabaseAdmin } from '@/lib/supabase/server';

export const POST = async (req: NextRequest) => {
    try {
        const { email, password } = await req.json();

        console.log('email', email, 'password', password);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Login error:', error);
            return NextResponse.json({ 
                ok: false, 
                message: `로그인에 실패했습니다: ${error.message}`
            }, { status: 400 });
        }

        return NextResponse.json({
            ok: true,
            message: '로그인에 성공했습니다.',
            dbData: data
        }, { status: 200 });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
};
