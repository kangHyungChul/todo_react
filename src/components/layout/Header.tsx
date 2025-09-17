'use client';
import React from 'react';
import Link from 'next/link';
// import axios from 'axios';
import { memo, useCallback } from 'react';
import { useAuth } from '@/features/auth/hook/useAuth';
import { useProfile } from '@/features/auth/hook/useProfile';
// import LoadingProgress from '@/components/common/LoadingProgress';
// import { usePathname } from 'next/navigation';
// import styles from './Header.module.scss';

const AuthComponent = () => {

    const { user, signOut } = useAuth();  // user, profile, loading, signOut 상태 사용
    const { data: profile /*, error: profileError*/ } = useProfile();
    const handleSignOut = useCallback(async () => {
        const response = await signOut();
        console.log(response);
    }, [signOut]);

    return (
        !user ? (
            <Link href="/auth/login" className="text-sm text-gray-500">Login</Link>
        ) : (
            <div className="text-sm text-gray-500">
                <p>{profile?.nickname}({profile?.email})</p>
                <Link href="#" onClick={handleSignOut}>Logout</Link>
            </div>
        )
    )
}

const Header = () => {
    const { loading: authLoading } = useAuth();  // user, profile, loading, signOut 상태 사용
    const { isLoading: profileLoading/*, error: profileError*/ } = useProfile();

    const nowLoading = profileLoading || authLoading;

    return (
        <header className="relative flex items-center justify-center p-5 border-b-1 border-gray-300">
            <h1 className="text-2xl font-bold text-center mx-auto"><Link href="/">FLIGHT TRACKER</Link></h1>
            <nav className="absolute right-5 top-1/2 -translate-y-1/2">
                {
                    nowLoading ? (
                        <>인증중</>
                    ) : (
                        <AuthComponent />
                    )
                }
            </nav>
        </header>
    );

};

export default memo(Header); 