// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseSSR } from '@/lib/supabase/server';
import { ERROR_MESSAGES } from '@/constants/errorMessages';

export const POST = async (req: NextRequest) => {
    try {
        const { email, password } = await req.json();

        console.log('email', email, 'password', password);

        const { data, error } = await(await supabaseSSR()).auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            const errorCode = `AUTH_${error.code?.toUpperCase()}`;
            const errorMessage = ERROR_MESSAGES[errorCode as keyof typeof ERROR_MESSAGES] || '알 수 없는 오류가 발생했습니다.';
            console.log('errorCode', errorCode);
            console.log('errorMessage', errorMessage);
            // console.log('Login error:', error.message, 'error.code', error.code, 'error.name', error.name);
            // if(error.code === 'invalid_credentials') {
            //     return NextResponse.json({ 
            //         ok: false, 
            //         message: '이메일 또는 비밀번호가 일치하지 않습니다.'
            //     }, { status: 400 });
            // }
            // if (error.code === 'email_not_confirmed') {
            //     return NextResponse.json({ 
            //         ok: false, 
            //         message: '이메일 인증이 되지 않았습니다.',
            //         data: {
            //             email: email
            //         }
            //     }, { status: 400 });
            // }
            // if (error.code === 'email_address_invalid') {
            //     return NextResponse.json({ 
            //         ok: false, 
            //         message: '이메일 형식이 올바르지 않습니다.'
            //     }, { status: 400 });
            // }
            return NextResponse.json({ 
                ok: false, 
                message: `로그인에 실패했습니다: ${errorMessage}`
            }, { status: 400 });
        }

        // console.log('data', data);

        return NextResponse.json({
            ok: true,
            message: '로그인에 성공했습니다.',
            data: data.user
        }, { status: 200 });

    } catch (error) {
        console.error('로그인 서버 오류:', error);
        return NextResponse.json({ error: '로그인 서버 오류 실패' }, { status: 500 });
    }
};
