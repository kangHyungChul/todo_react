'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const AuthErrorPage = () => {
    const searchParams = useSearchParams();
    const reason = searchParams.get('reason');

    // 에러 원인에 따른 메시지 매핑
    const getErrorMessage = (reason: string | null) => {
        switch (reason) {
            case 'no_code':
                return '인증 코드가 없습니다.';
            case 'invalid_code':
                return '유효하지 않은 인증 코드입니다.';
            case 'missing_profile':
                return '프로필 정보가 누락되었습니다.';
            case 'profile_creation_failed':
                return '프로필 생성에 실패했습니다.';
            case 'unexpected_error':
                return '예상치 못한 오류가 발생했습니다.';
            default:
                return '인증 과정에서 오류가 발생했습니다.';
        }
    };

    return (
        <div className="w-sm flex flex-col gap-8 items-center mx-auto justify-center h-screen">
            <h1 className="text-2xl font-bold text-red-600">인증 오류</h1>
            <div className="text-center">
                <p className="text-gray-700 mb-4">{getErrorMessage(reason)}</p>
                <p className="text-sm text-gray-500 mb-6">
                    다시 시도하거나 관리자에게 문의해주세요.
                </p>
            </div>
            <div className="flex gap-4">
                <Link href="/auth/signup" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">회원가입 다시하기</Link>
                <Link href="/auth/login" className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">로그인으로 이동</Link>
            </div>
        </div>
    );
};

export default AuthErrorPage;