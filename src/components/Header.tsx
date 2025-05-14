'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.scss';

const Header = () => {
    const pathname = usePathname();

    return (
        <header className={styles.header}>
            <h1 className={styles.title}><Link href='/'>todo react</Link></h1>
            <Link href='/hook'>hook</Link>
            { 
                pathname === '/hook' &&
                <Link href='/hook/usestate'>usestate</Link>
            }
        </header>
    );

};

export default Header; 