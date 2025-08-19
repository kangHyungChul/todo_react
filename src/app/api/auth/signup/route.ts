// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/server';

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

        // 2-1) 이미 가입된 이메일인지 확인
        try {

            const { data: { users }, error: userCheckError } = await supabaseAdmin.auth.admin.listUsers();
            console.log('users', users);

            if (userCheckError) {
                console.error('사용자 목록 조회 실패:', userCheckError);
                return NextResponse.json(
                    { ok: false, message: '사용자 목록 조회 실패' },
                    { status: 500 }
                );
            }

            const existingUser = users?.find((user) => user.email === email);
            console.log('existingUser', existingUser);

            if (existingUser) {
                if (existingUser?.email_confirmed_at) {
                    return NextResponse.json(
                        { ok: false, message: '이미 가입된 이메일입니다. 로그인해 주세요.' },
                        { status: 400 }
                    );
                } else {
                    return NextResponse.json(
                        { ok: false, message: '이미 가입 신청된 이메일입니다. 이메일 인증 후 로그인해 주세요.' },
                        { status: 400 }
                    );
                }
            }

        } catch (error) {
            console.error('사용자 목록 조회 실패:', error);
            return NextResponse.json(
                { ok: false, message: '사용자 목록 조회 실패' },
                { status: 500 }
            );
        }
        

        // 3) Supabase 클라이언트 생성
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

        // 4) 인증 메일 콜백 URL 구성
        //    - 배포 후에는 실제 서비스 도메인 기준으로 돌아오도록 origin 사용
        const origin = req.headers.get('origin') ?? supabaseUrl;
        const emailRedirectTo = `${origin}/auth/callback`;

        // 5) 회원가입 요청
        const { data: signData, error: signError } = await supabase.auth.signUp({
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

        if (signError) {
            console.error('Signup error:', signError);
            return NextResponse.json({ 
                ok: false, 
                message: `회원가입에 실패했습니다: ${signError.message}`
            }, { status: 400 });
        }

        // console.log('[SIGNUP]', { hasError: !!signError, userId: signData?.user?.id, msg: signError?.message });

        // const userId = signData.user?.id;
        const userId = signData.user?.id;

        const { data: profileData, error: profileError } = await supabaseAdmin
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

        console.log('profileData', profileData);

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
