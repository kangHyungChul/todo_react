// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseSSR } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { EmailCheckResult } from '@/features/auth/types/auth';

export const POST = async (req: NextRequest) => {
    try {
        // 1) 요청 바디 파싱
        const { email, password, name, nickname, phone, birthday } = await req.json();
        // console.log('email', email, 'password', password);

        // 2) 최소한의 서버단 유효성 검사
        if (typeof email !== 'string' || !email.includes('@')) {
            return NextResponse.json(
                { ok: false, message: '유효한 이메일을 입력해 주세요.' },
                { status: 400 }
            );
        }
        if (typeof password !== 'string' || password.length < 6) {
            return NextResponse.json(
                { ok: false, message: '비밀번호는 6자 이상이어야 합니다.' },
                { status: 400 }
            );
        }

        // 2-1) 국내 UX 기준: 가입 전 "중복 이메일" 즉시 차단 (서버 전용 RPC)
        //      - is_exists: 해당 이메일 존재 여부
        //      - confirmed: 이메일 인증 완료 여부 (정책에 따라 메시지 분기 가능)
        const { data: existRow, error: rpcError } = await supabaseAdmin.rpc('is_email_registered', { p_email: email }).single();

        if (rpcError) {
            // RPC 실패는 내부 로그만 남기고 일반 메시지로 응답
            console.error('[RPC] is_email_registered error:', rpcError);
            return NextResponse.json(
                { ok: false, message: '회원가입 처리 중 오류가 발생했습니다.' },
                { status: 500 }
            );
        }

        if ((existRow as EmailCheckResult).is_exists) {
            // 정책 1) 무조건 차단(국내 일반 패턴)
            return NextResponse.json(
                { ok: false, message: '이미 가입된 이메일입니다. 로그인 또는 비밀번호 재설정을 이용해 주세요.' },
                { status: 400 }
            );

            // 정책 2) 미인증만 예외적으로 재발송하고 싶다면 아래 분기 사용
            // if (!existRow.confirmed) {
            //     const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
            //     const origin = req.headers.get('origin') ?? supabaseUrl;
            //     const emailRedirectTo = `${origin}/auth/callback`;
            //     await supabaseAdmin.auth.resend({ type: 'signup', email, options: { emailRedirectTo } });
            //     return NextResponse.json(
            //         { ok: true, message: '이미 가입 신청된 이메일입니다. 인증 메일을 다시 보냈습니다.' },
            //         { status: 200 }
            //     );
            // }
        }

        // 3) Supabase 클라이언트 생성
        // const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

        // 4) 인증 메일 콜백 URL 구성
        //    - 배포 후에는 실제 서비스 도메인 기준으로 돌아오도록 origin 사용
        const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host');
        const protocol = req.headers.get('x-forwarded-proto') ?? 'https';
        
        const origin = `${protocol}://${host}`;
        const emailRedirectTo = `${origin}/auth/callback`;

        // 5) 회원가입 요청
        const { data: signData, error: signError } = await(await supabaseSSR()).auth.signUp({
            email,
            password,
            options: { 
                emailRedirectTo,
                // 추가회원데이터를 메타데이터로 저장
                data: {
                    name,
                    nickname,
                    phone,
                    birthday,
                    // profileImage
                }
            }
        });

        console.log('signData', signData.user?.identities);

        // 5-1) 보조 방어: 일부 환경에서 중복 시 signError가 없을 수 있어 identities를 점검
        //      - 신규 생성이면 해당 provider(identity)가 포함되는 것이 일반적
        const identitiesLen = signData?.user?.identities?.length ?? 0;
        if (!signError && identitiesLen === 0) {
            // 중복 가능성이 매우 높으므로 국내 정책에 맞게 차단 응답
            return NextResponse.json(
                { ok: false, message: '이미 가입된 이메일입니다. 로그인 또는 비밀번호 재설정을 이용해 주세요.' },
                { status: 400 }
            );
        }

        if (signError) {
            // 기타 오류(약한 비밀번호 정책, 메일 전송 문제 등)
            console.error('[SIGNUP] error:', signError);
            return NextResponse.json(
                { ok: false, message: `회원가입에 실패했습니다: ${signError.message}` },
                { status: 400 }
            );
        }
        
        // 6) 성공 응답: 확인 메일 안내
        const userId = signData.user?.id;

        return NextResponse.json(
            {
                ok: true,
                message: '확인 메일을 전송했습니다. 메일의 링크로 인증을 완료해 주세요.',
                userId: userId ?? null
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { 
                ok: false, 
                message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' 
            },
            { status: 500 }
        );
    }
};
