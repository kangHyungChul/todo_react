'use client';
import React from 'react';
import Link from 'next/link';
// import axios from 'axios';
import { useAuth } from '@/features/auth/hook/useAuth';
import { useProfile } from '@/features/auth/hook/useProfile';
import LoadingProgress from '@/components/common/LoadingProgress';
// import { usePathname } from 'next/navigation';
// import styles from './Header.module.scss';

const Header = () => {
    const { user, loading, signOut } = useAuth();  // user, profile, loading, signOut 상태 사용
    const { data: profile, isLoading: profileLoading, isPending: profilePending/*, error: profileError*/ } = useProfile();

    const authLoading = profileLoading || profilePending || loading;

    // const currentPath = usePathname();

    // const pathname = (path: string) => {
    //     return currentPath.startsWith(path);
    // };

    // const linkStyle = (path: string) => {
    //     return pathname(path) ? `${styles['header__dep2-link']} ${styles['header__dep2-link--active']}` : `${styles['header__dep2-link']}`;
    // };
    console.log('useProfile', useProfile);
    const signout = async () => {
        const response = await signOut();
        console.log(response);
    };

    return (
        <>
            <header className="relative flex items-center justify-center p-5 border-b-1 border-gray-300">
                <h1 className="text-2xl font-bold text-center mx-auto"><Link href="/">FLIGHT TRACKER</Link></h1>
                <nav className="absolute right-5 top-1/2 -translate-y-1/2">
                    {
                        !user ? (
                            <Link href="/auth/login" className="text-sm text-gray-500">Login</Link>
                        ) : (
                            <div className="text-sm text-gray-500">
                                <p>{profile?.nickname}({profile?.email})</p>
                                <Link href="#" onClick={signout}>Logout</Link>
                            </div>
                        )
                    }
                </nav>
            </header>

            {authLoading && <LoadingProgress />}
        </>
    );

};

export default Header; 