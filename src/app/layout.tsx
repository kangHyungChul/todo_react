import type { Metadata } from 'next';
import { Nanum_Gothic } from 'next/font/google';
import './globals.scss';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const nanumGothic = Nanum_Gothic({
    subsets: ['latin'],
    weight: ['400', '700', '800'],
});

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
        <html lang='ko'>
            <body className={`${nanumGothic.className}`}>
                <Header />
                <main>
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
