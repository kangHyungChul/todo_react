// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const POST = async (req: NextRequest) => {
    try {
        // 1) 요청 바디 파싱
        const { email, password, name, nickname, phone, birthday, profileImage } = await req.json();
        console.log('email', email, 'password', password);

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

        // 3) Supabase 클라이언트 생성
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // 4) 인증 메일 콜백 URL 구성
        //    - 배포 후에는 실제 서비스 도메인 기준으로 돌아오도록 origin 사용
        const origin = req.headers.get('origin') ?? supabaseUrl;
        const emailRedirectTo = `${origin}/auth/callback`;

        // 5) 회원가입 요청
        const { data: signData, error: signError } = await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo }
        });

        const userId = signData.user?.id;

        if (signError || !signData.user) {
            // 예: 이미 가입된 이메일, 정책 위반 등
            return NextResponse.json(
                { ok: false, message: signError?.message },
                { status: 400 }
            );
        }

        const admin = createClient(supabaseUrl, supabaseServiceKey);

        const { data: profileData, error: profileError } = await admin
            .from('profiles')
            .upsert(
                {
                    id: userId,
                    email: email || null,          // profiles.email을 유지한다면
                    name: name || null,
                    nickname: nickname || null,
                    phone: phone || null,
                    birthday: birthday || null,
                    // profile_image: ... (스토리지 업로드 후 URL)
                },
                { onConflict: 'id' }
            )
            .select()
            .single();

        if (profileError) {
            console.error('Profile creation error:', profileError);
            return NextResponse.json({ 
                ok: false, 
                message: `프로필 생성에 실패했습니다: ${profileError.message}`
            }, { status: 400 });
        }
        
        // 7) 성공 응답: 확인 메일 안내
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
