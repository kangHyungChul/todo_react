import { NextRequest } from 'next/server';
// import { supabase } from '@/lib/supabase/client';
// import { supabaseAdmin } from '@/lib/supabase/server';
// import { CreateProfileData } from '@/features/auth/types/auth';

export async function POST(request: NextRequest) {

    console.log('request:', request);
    // try {

    //     const authHeader = request.headers.get('authorization');

    //     if (!authHeader) {
    //         // 1) 인증 코드 교환
    //         const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    //         if (error || !data.user) {
    //             console.error('인증 코드 교환 실패:', error);
    //             return NextResponse.redirect(new URL('/auth/error?reason=exchange_code_failed', request.url));
    //         }
            
    //         // 2) 사용자 메타데이터에서 프로필 정보 추출
    //         const userMetadata = data.user.user_metadata;
    //         const profileData: CreateProfileData = {
    //             email: data.user.email!,
    //             name: userMetadata?.name || '',
    //             nickname: userMetadata?.nickname || '',
    //             phone: userMetadata?.phone || '',
    //             birthday: userMetadata?.birthday || null,
    //             profileImage: userMetadata?.profile_image || null,
    //         };

    //         // 3) 필수 필드 검증
    //         if (!profileData.name || !profileData.nickname || !profileData.phone) {
    //             console.error('필수 프로필 정보가 누락되었습니다:', profileData);
    //             return NextResponse.redirect(new URL('/auth/error?reason=missing_profile', request.url));
    //         }

    //         // 4) profiles 테이블에 데이터 삽입 (upsert 사용)
    //         // profiles 테이블에 사용자 정보를 upsert(삽입 또는 갱신)하는 부분입니다.
    //         // - .from('profiles'): 'profiles' 테이블을 지정합니다.
    //         // - .upsert({ ... }): id가 이미 존재하면 해당 레코드를 업데이트, 없으면 새로 삽입합니다.
    //         //   - id: Supabase 인증 user의 id를 사용합니다.
    //         //   - ...profileData: 이메일, 이름, 닉네임, 전화번호, 생일, 프로필이미지 등 사용자 메타데이터를 포함합니다.
    //         // - onConflict: 'id'로 충돌 시 업데이트 동작을 지정합니다.
    //         // - ignoreDuplicates: false로 설정하여 중복 시 무시하지 않고 업데이트합니다.
    //         const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
    //                 id: data.user.id,
    //                 ...profileData,
    //             }, {
    //                 onConflict: 'id',  // id가 이미 존재하면 업데이트
    //                 ignoreDuplicates: false
    //             });

    //         if (profileError) {
    //             console.error('프로필 생성/업데이트 실패:', profileError);
    //             return NextResponse.redirect(new URL('/auth/error?reason=profile_creation_failed', request.url));
    //         }

    //         // 5) 성공 시 완료 페이지로 리다이렉트
    //         console.log('프로필 생성 성공:', data.user.id);
    //         return NextResponse.redirect(
    //             new URL(`/auth/complete/${data.user.id}`, request.url)
    //         );
    //     }
    // } catch (error) {
    //     console.error('인증 코드 처리 중 오류 발생:', error);
    //     return NextResponse.redirect(new URL('/auth/error?reason=internal_error', request.url));
    // }
}