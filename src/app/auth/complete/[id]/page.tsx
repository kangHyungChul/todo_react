import type { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

export const metadata: Metadata = {
    title: 'Signup Complete',
    description: 'Signup Complete',
};

const getEmailByUserId = async (userId: string): Promise<string | null> => {

    // profiles 테이블에서 id로 이메일 조회
    const { data, error } = await supabase.auth.getUser(userId);
    console.log('data', data);

    if (error) {
        // 에러 발생 시 콘솔에 출력하고 null 반환
        console.error('이메일 조회 실패:', error);
        return null;
    }

    // 정상적으로 조회되면 이메일 반환
    return data?.user?.email ?? null;
}

const Complete = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const email = await getEmailByUserId(id);
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