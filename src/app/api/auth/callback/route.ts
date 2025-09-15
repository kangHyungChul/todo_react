import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { EmailOtpType } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
    try {
        const { token, type } = await request.json();
        
        // 토큰과 타입이 제공되었는지 확인
        if (!token || !type) {
            return NextResponse.json(
                { error: '토큰과 타입이 필요합니다.' },
                { status: 400 }
            );
        }

        // 이메일 확인 토큰인 경우
        if (type === 'email_confirmation') {
        // Supabase Admin 클라이언트를 사용하여 토큰 검증
            const { data, error } = await supabaseAdmin.auth.verifyOtp({
                token_hash: token,
                type: 'email_confirmation' as EmailOtpType
            });

            if (error) {
                console.error('토큰 검증 오류:', error);
                return NextResponse.json(
                    { error: '토큰 검증에 실패했습니다.' },
                    { status: 400 }
                );
            }

            // 사용자 ID 추출
            const userId = data.user?.id;

            if (!userId) {
                return NextResponse.json(
                    { error: '사용자 정보를 찾을 수 없습니다.' },
                    { status: 400 }
                );
            }

            // 사용자 이메일 확인 상태 업데이트
            const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
                userId,
                { email_confirm: true }
            );

            if (updateError) {
                console.error('이메일 확인 상태 업데이트 오류:', updateError);
                return NextResponse.json(
                    { error: '이메일 확인 상태 업데이트에 실패했습니다.' },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                success: true,
                message: '이메일 인증이 완료되었습니다.',
                userId: userId
            });

        } else {
            return NextResponse.json(
                { error: '지원하지 않는 토큰 타입입니다.' },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error('Callback 처리 오류:', error);
        return NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}