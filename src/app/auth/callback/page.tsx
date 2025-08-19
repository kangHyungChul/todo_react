'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Button from '@/components/common/Button';
import { useRouter } from 'next/navigation';

// 인증 상태를 나타내는 타입
type AuthStatus = 'loading' | 'success' | 'error' | 'expired' | 'idle';

// 인증 결과를 나타내는 타입
interface AuthResult {
    success: boolean;
    message: string;
    userId?: string;
}

const AuthCallbackPage = () => {
    const router = useRouter();

    // 상태 관리
    const [status, setStatus] = useState<AuthStatus>('idle');
    const [result, setResult] = useState<AuthResult | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');

    useEffect(() => {
        // 초기 상태 확인
        checkInitialAuthState();

        // Supabase 인증 상태 변경 감지
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth event:', event);
                console.log('Session:', session);
                
                switch (event) {
                    case 'SIGNED_IN':
                        if (session?.user?.email_confirmed_at) {
                            // 이메일 인증 완료
                            setStatus('success');
                            setResult({
                                success: true,
                                message: '이메일 인증이 완료되었습니다.',
                                userId: session.user.id
                            });
                        } else {
                            // 이메일 인증이 완료되지 않음
                            setStatus('expired');
                            setErrorMessage('이메일 인증이 완료되지 않았습니다. 인증 메일을 다시 발송해주세요.');
                            setUserEmail(session?.user.email || '');
                        }
                        break;

                    case 'SIGNED_OUT':
                        console.log('사용자 로그아웃');
                        break;
                        
                    case 'TOKEN_REFRESHED':
                        console.log('토큰 갱신됨');
                        break;
                        
                    case 'USER_UPDATED':
                        console.log('사용자 정보 업데이트');
                        break;
                        
                    default:
                        setStatus('idle');
                        console.log('기타 이벤트:', event);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // 초기 인증 상태 확인 함수
    const checkInitialAuthState = async () => {
        try {
            setStatus('loading');
            
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) {
                console.log('세션 확인 오류:', error);
                
                // 토큰 만료 에러인지 확인
                if (error.message.includes('expired') || error.message.includes('invalid')) {
                    setStatus('expired');
                    setErrorMessage('인증 토큰이 만료되었습니다. 새로운 인증 메일을 발송해주세요.');
                    
                    // URL에서 이메일 정보 추출 시도
                    const urlParams = new URLSearchParams(window.location.search);
                    const email = urlParams.get('email');
                    if (email) {
                        setUserEmail(email);
                    }
                } else {
                    setStatus('error');
                    setErrorMessage('인증 처리 중 오류가 발생했습니다.');
                }
                return;
            }

            // 세션이 있지만 이메일이 확인되지 않은 경우
            if (session?.user && !session.user.email_confirmed_at) {
                setStatus('expired');
                setErrorMessage('이메일 인증이 완료되지 않았습니다. 인증 메일을 다시 발송해주세요.');
                setUserEmail(session.user.email || '');
            } else if (session?.user?.email_confirmed_at) {
                // 이미 인증된 경우
                setStatus('success');
                setResult({
                    success: true,
                    message: '이미 인증이 완료된 계정입니다.',
                    userId: session.user.id
                });
            }
            
        } catch (error) {
            console.error('초기 인증 상태 확인 오류:', error);
            setStatus('error');
            setErrorMessage('인증 상태 확인 중 오류가 발생했습니다.');
        }
    };

    // 인증 메일 재전송 함수
    const handleResendEmail = async () => {
        if (!userEmail) {
            setErrorMessage('이메일 정보를 찾을 수 없습니다.');
            return;
        }

        setStatus('loading');
        
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: userEmail
            });

            if (error) {
                console.error('재전송 오류:', error);
                setStatus('error');
                setErrorMessage('인증 메일 재전송에 실패했습니다: ' + error.message);
            } else {
                setStatus('success');
                setResult({
                    success: true,
                    message: '새로운 인증 메일이 발송되었습니다. 이메일을 확인해주세요.',
                    userId: undefined
                });
            }
        } catch (error) {
            console.error('재전송 처리 오류:', error);
            setStatus('error');
            setErrorMessage('인증 메일 재전송 중 오류가 발생했습니다.');
        }
    };

    // 로그인 페이지로 이동
    const handleGoToLogin = () => {
        router.push('/auth/login');
    };

    // 메인 페이지로 이동
    const handleGoToMain = () => {
        router.push('/');
    };

    // 로딩 상태 렌더링
    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8 p-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">이메일 인증 중...</h2>
                        <p className="mt-2 text-sm text-gray-600">잠시만 기다려주세요.</p>
                    </div>
                </div>
            </div>
        );
    }

    // 에러 상태 렌더링
    if (status === 'error') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8 p-8">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">인증 실패</h2>
                        <p className="mt-2 text-sm text-gray-600">{errorMessage}</p>
                        <div className="mt-6 space-y-3">
                            <Button onClick={handleGoToLogin} className="w-full" variant="primary">
                                로그인 페이지로 이동
                            </Button>
                            <Button onClick={handleGoToMain} className="w-full" variant="secondary">
                                메인 페이지로 이동
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 성공 상태 렌더링
    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8 p-8">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">이메일 인증 완료!</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {result?.message || '계정이 성공적으로 활성화되었습니다.'}
                        </p>
                        <div className="mt-6 space-y-3">
                            <Button onClick={handleGoToLogin} className="w-full" variant="primary">
                                로그인하기
                            </Button>
                            <Button onClick={handleGoToMain} className="w-full" variant="secondary">
                                메인 페이지로 이동
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 토큰 만료 상태 렌더링
    if (status === 'expired') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8 p-8">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">토큰 만료</h2>
                        <p className="mt-2 text-sm text-gray-600">{errorMessage}</p>
                        {userEmail && (
                            <p className="mt-2 text-sm text-gray-500">이메일: {userEmail}</p>
                        )}
                        <div className="mt-6 space-y-3">
                            <Button 
                                onClick={handleResendEmail} 
                                className="w-full" 
                                variant="primary"
                            >
                                인증 메일 재전송
                            </Button>
                            <Button 
                                onClick={handleGoToLogin} 
                                className="w-full" 
                                variant="secondary"
                            >
                                로그인 페이지로 이동
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 초기 상태 (렌더링되지 않음)
    return null;
};

export default AuthCallbackPage;