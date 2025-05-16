'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.scss';

const Header = () => {
    
    const currentPath = usePathname();

    const pathname = (path: string) => {
        return currentPath.startsWith(path);
    };

    const linkStyle = (path: string) => {
        return pathname(path) ? `${styles['header__dep2-link']} ${styles['header__dep2-link--active']}` : `${styles['header__dep2-link']}`;
    };

    return (
        <header className={styles.header}>
            <h1 className={`${styles['header__title']}`}><Link href='/'>TODO REACT</Link></h1>
            <nav>
                <ul className={`${styles['header__gnb']}`}>
                    <li>
                        <Link href='/hook/usestate' className={`${styles['header__gnb-link']}`}>hook</Link>
                        { 
                            pathname('/hook') &&
                            <ul className={`${styles['header__dep2']}`}>
                                <li>
                                    <Link href='/hook/usestate' className={linkStyle('/hook/usestate')}>useState</Link>
                                </li>
                                <li>
                                    <Link href='/hook/useeffect' className={linkStyle('/hook/useeffect')}>useEffect</Link>
                                </li>
                            </ul>
                        }
                    </li>
                </ul>
            </nav>
        </header>
    );

};

export default Header; 