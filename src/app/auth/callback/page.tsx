'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const AuthCallbackPage = () => {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [showResendForm, setShowResendForm] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    useEffect(() => {
        const processCallback = async () => {
            try {
                const code = searchParams.get('code');

                console.log('code', code);
                
                // if (!code) {
                //     setStatus('error');
                //     setMessage('인증 코드가 없습니다.');
                //     return;
                // }

                // const response = await fetch(`/api/auth/callback?code=${code}`);
                
                // if (response.ok) {
                //     setStatus('success');
                //     setMessage('인증이 완료되었습니다. 잠시 후 완료 페이지로 이동합니다...');
                // } else {
                //     const errorData = await response.json();
                //     setStatus('error');
                //     setMessage(errorData.message || '인증 처리 중 오류가 발생했습니다.');
                    
                //     // 에러 시 재발송 폼 표시
                //     setShowResendForm(true);
                // }
            } catch (error) {
                console.error('Callback error:', error);
                setStatus('error');
                setMessage('예상치 못한 오류가 발생했습니다.');
                setShowResendForm(true);
            }
        };

        processCallback();
    }, [searchParams]);

    // 인증 메일 재발송 처리
    const handleResendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email.trim()) {
            alert('이메일을 입력해주세요.');
            return;
        }

        setResendLoading(true);
        
        try {
            const response = await fetch('/api/auth/resend-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.trim() }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                setShowResendForm(false);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Resend email error:', error);
            alert('재발송 요청 중 오류가 발생했습니다.');
        } finally {
            setResendLoading(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="w-sm flex flex-col gap-8 items-center mx-auto justify-center h-screen">
                <h1 className="text-2xl font-bold">이메일 인증 처리 중...</h1>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-600">잠시만 기다려주세요.</p>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="w-sm flex flex-col gap-8 items-center mx-auto justify-center h-screen">
                <h1 className="text-2xl font-bold text-green-600">✅ 인증 완료!</h1>
                <p className="text-center text-gray-700">{message}</p>
                <div className="animate-pulse">
                    <p className="text-sm text-gray-500">자동으로 이동합니다...</p>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="w-sm flex flex-col gap-8 items-center mx-auto justify-center h-screen">
                <h1 className="text-2xl font-bold text-red-600">❌ 인증 실패</h1>
                <p className="text-center text-red-500 mb-6">{message}</p>
                
                {/* 재발송 폼 */}
                {showResendForm && (
                    <div className="w-full max-w-md bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">인증 메일 재발송</h3>
                        <form onSubmit={handleResendEmail} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    이메일 주소
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="가입한 이메일을 입력하세요"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={resendLoading}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {resendLoading ? '발송 중...' : '인증 메일 재발송'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="flex gap-4">
                    <a 
                        href="/auth/signup" 
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        회원가입 다시하기
                    </a>
                    <a 
                        href="/auth/login" 
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        로그인으로 이동
                    </a>
                </div>
            </div>
        );
    }

    return null;
};

export default AuthCallbackPage;