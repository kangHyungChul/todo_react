import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export const POST = async (req: NextRequest) => {
    try {
        const { email } = await req.json();

        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return NextResponse.json(
                { ok: false, message: '유효한 이메일을 입력해 주세요.' },
                { status: 400 }
            );
        }

        // 1) 해당 이메일로 가입된 사용자 확인
        const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
        
        if (userError) {
            console.error('User lookup error:', userError);
            return NextResponse.json(
                { ok: false, message: '사용자 조회에 실패했습니다.' },
                { status: 500 }
            );
        }

        const user = users?.find(u => u.email === email);
        
        if (!user) {
            return NextResponse.json(
                { ok: false, message: '해당 이메일로 가입된 계정이 없습니다.' },
                { status: 404 }
            );
        }

        // 2) 이미 이메일이 확인된 경우 체크
        if (user.email_confirmed_at) {
            return NextResponse.json(
                { ok: false, message: '이미 이메일이 확인된 계정입니다.' },
                { status: 400 }
            );
        }

        // 3) 인증 메일 재전송
        const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const emailRedirectTo = `${origin}/auth/callback`;

        const { error: resendError } = await supabase.auth.admin.generateLink({
            type: 'recovery', 
            email: email,
            options: {
                redirectTo: emailRedirectTo
            }
        });

        if (resendError) {
            console.error('Resend email error:', resendError);
            return NextResponse.json(
                { ok: false, message: '메일 재전송에 실패했습니다.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            ok: true,
            message: '인증 메일을 재전송했습니다. 스팸함도 확인해 주세요.'
        });

    } catch (error) {
        console.error('Resend email error:', error);
        return NextResponse.json(
            { ok: false, message: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
};