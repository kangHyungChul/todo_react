import type { Metadata } from 'next';
import Link from 'next/link';
import { supabaseSSR } from '@/lib/supabase/server';

export const metadata: Metadata = {
    title: 'Signup Complete',
    description: 'Signup Complete',
};

// const getEmailByUserId = async (userId: string): Promise<string | null> => {

//     try {

//         // auth 테이블에서 id로 이메일찾기
//         const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

//         console.log('data', data);

//         if (error) {
//             // 에러 발생 시 콘솔에 출력하고 null 반환
//             console.error('이메일 조회 실패:', error);
//             return null;
//         }
        
//         // 정상적으로 조회되면 이메일 반환
//         return data?.user?.email ?? null;

//     } catch (error) {
//         console.error('이메일 조회 실패:', error);
//         return null;
//     }

// };

// const Complete = async ({ params }: { params: Promise<{ id: string }> }) => {
const Complete = async () => {

    // const { id } = await params;
    // const email = await getEmailByUserId(id);

    const { data, error } = await (await supabaseSSR()).auth.getUser();

    console.log('data', data);
    console.log('error', error);

    return (
        <div className="w-sm flex flex-col gap-8 items-center mx-auto justify-center h-screen">
            <h1 className="text-2xl font-bold">Signup Complete</h1>
            <div className="flex flex-col items-center justify-center">
                <p>회원가입이 완료되었습니다.</p>
                <p>가입시 입력한 이메일로 인증 메일이 발송되었습니다.</p>
                <p className="text-amber-600">⚠️이메일 인증 후 로그인 가능합니다!⚠️</p>
            </div>
            <Link href="/auth/login" className="text-blue-500">로그인</Link>
        </div>
    );
};

export default Complete;