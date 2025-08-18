import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

export const metadata: Metadata = {
    title: 'Signup Complete',
    description: 'Signup Complete',
};

// Supabase에서 userId로 이메일을 조회하는 코드를 작성해야 합니다.
// 1. 서버 컴포넌트에서 Supabase 클라이언트를 생성하고, userId로 profiles 테이블에서 이메일을 조회합니다.
// 2. 이 코드는 서버 컴포넌트에서만 동작해야 하므로, 클라이언트 컴포넌트에서는 사용할 수 없습니다.
// 3. 환경변수에서 Supabase URL과 Service Key를 가져와야 하며, 클라이언트 키(anon key)는 사용하지 않습니다.
// 4. 아래 코드는 실제로 DB에서 이메일을 조회하는 예시입니다.


const getEmailByUserId = async (userId: string): Promise<string | null> => {
    'use server';

    // 환경변수에서 Supabase URL과 Service Key를 가져옵니다.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // Supabase 서비스 키로 관리자 권한 클라이언트 생성
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // profiles 테이블에서 id로 이메일 조회
    const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();

    if (error) {
        // 에러 발생 시 콘솔에 출력하고 null 반환
        console.error('이메일 조회 실패:', error);
        return null;
    }

    // 정상적으로 조회되면 이메일 반환
    return data?.email ?? null;
}

const Complete = async ({ params }: { params: { id: string } }) => {
    const email = await getEmailByUserId(params.id);
    return (
        <div className="w-sm flex flex-col gap-8 items-center mx-auto justify-center h-screen">
            <h1 className="text-2xl font-bold">Signup Complete</h1>
            <div className="flex flex-col items-center justify-center">
                <p>회원가입이 완료되었습니다.</p>
                <p>회원 아이디: {email}</p>
                <p>이메일 인증 후 로그인 가능합니다.</p>
            </div>
            <Link href="/auth/login" className="text-blue-500">로그인</Link>
        </div>
    );
};

export default Complete;