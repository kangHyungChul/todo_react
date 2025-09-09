'use client';
import React from 'react';
import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import styles from './Header.module.scss';

const Header = () => {
    
    // const currentPath = usePathname();

    // const pathname = (path: string) => {
    //     return currentPath.startsWith(path);
    // };

    // const linkStyle = (path: string) => {
    //     return pathname(path) ? `${styles['header__dep2-link']} ${styles['header__dep2-link--active']}` : `${styles['header__dep2-link']}`;
    // };

    return (
        <header className="flex items-center justify-center p-5 border-b-1 border-gray-300">
            <h1 className="text-2xl font-bold text-center mx-auto"><Link href="/">FLIGHT TRACKER</Link></h1>
            <nav className="text-right">
                <Link href="/auth/login" className="text-sm text-gray-500">Login</Link>
            </nav>
        </header>
    );

};

export default Header; 