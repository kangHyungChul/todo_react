import type { Metadata } from 'next';
// import { Nanum_Gothic } from 'next/font/google';
import '../styles/globals.css';
// import styles from './page.module.scss';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
// import { ModalProvider } from '@/contexts/ModalContext';
import Modal from '@/components/common/Modal';
import Providers from './provider';
// import ModalContext from '@/components/common/ModalContext';
// const nanumGothic = Nanum_Gothic({
//     weight: ['400', '700', '800'],
//     subsets: ['latin'],
// });

export const metadata: Metadata = {
    title: 'Todo App',
    description: 'Todo App',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            {/* <body className={`${nanumGothic.className}`}> */}
            <body>
                <Providers>
                    <Header />
                    <main>
                        {children}
                        <Modal />
                    </main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
