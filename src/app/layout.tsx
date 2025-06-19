import type { Metadata } from 'next';
// import { Nanum_Gothic } from 'next/font/google';
import '../styles/globals.css';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { ModalProvider } from '@/contexts/ModalContext';
import Modal from '@/components/common/Modal';
import ModalContext from '@/components/common/ModalContext';
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
                <Header />
                <main>
                    <ModalProvider>
                        {children}
                        <Modal />
                        <ModalContext />
                    </ModalProvider>
                    {/* {children}
                    <Modal /> */}
                </main>
                <Footer />
            </body>
        </html>
    );
}
