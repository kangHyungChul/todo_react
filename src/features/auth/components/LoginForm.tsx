'use client';

import { Input } from '@/components/ui/input';
import Button from '@/components/common/Button';
import { useState, useActionState } from 'react';
// import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import Link from 'next/link';

const LoginForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { signIn, loading } = useAuthStore();

    const submitFormData = async (prevState: { email: string; password: string }, fd: FormData): Promise<{ email: string; password: string }> => {
        
        const email = fd.get('email') as string;
        const password = fd.get('password') as string;

        const { ok, error, callbackUrl } = await signIn(email, password);

        console.log('callbackUrl', callbackUrl);

        if (ok) {
            console.log('로그인 성공');
            setError(null);
            router.replace(callbackUrl || '/');
        } else {
            console.log('로그인 실패:', error);
            setError(error || '로그인에 실패했습니다.');
        }

        return { email, password };
    };

    const handleKakaoLogin = () => {
        console.log('Kakao Login');
    };

    // state값이 있지만 안써서 제거
    const [/*state*/, formAction, /*isPending*/] = useActionState(submitFormData, { email, password });

    return (
        <div className="w-sm flex flex-col gap-8 items-center mx-auto justify-center h-screen">
            <h1 className="text-2xl font-bold">Login</h1>
            <form className="w-full flex flex-col gap-2 items-center justify-center" action={formAction}>
                <Input type="text" placeholder="ID" sizes="large" name="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder="Password" sizes="large" name="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button variant="primary" sizes="large" type="submit" className="w-full" disabled={loading}>
                    {loading ? '로그인 중...' : 'Login'}
                </Button>
                <Button variant="kakao" sizes="large" type="button" className="w-full" disabled={loading} onClick={handleKakaoLogin}>
                    {loading ? '로그인 중...' : 'Kakao Login'}
                </Button>

                {/* 로딩 상태 표시 */}
                {loading && (
                    <div className="w-full p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-blue-600 text-sm text-center">로그인 중입니다...</p>
                    </div>
                )}

                {/* 에러 메시지 표시 */}
                {(!loading && error) && (
                    <div className="w-full p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-600 text-sm text-center">{error}</p>
                    </div>
                )}

                <Link href="/auth/signup">회원가입</Link>
                
            </form>
        </div>
    );
};

export default LoginForm;