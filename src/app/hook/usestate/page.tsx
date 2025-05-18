'use client';

import { useState } from 'react';
// import Image from 'next/image';
import styles from './page.module.scss';
import Button from '@/components/common/Button';
// import { Metadata } from 'next';

// export const metadata: Metadata = {
//     title: 'useState',
//     description: 'useState',
// };

export default function Home() {
    
    const [count, setCount] = useState(0);

    const countSet = (value: number = 1) => {
        setCount(prev => {
            const result = prev + value;
            return result;
            // if (result < 0) {
            //     // alert('카운트는 0 이하가 될 수 없습니다.');
            //     return 0;
            // } else {
            //     return result;
            // }
        });
    };

    const reset = () => {
        setCount(0);
    };

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className={styles.counter}>
                    <strong>현재 카운트: {count}</strong>
                    <div className={styles.buttonGroup}>
                        <Button style="primary" size="large" onClick={ () => countSet(1) }>
                            증가
                        </Button>
                        <Button style="danger" size="large" onClick={ () => countSet(-1) }>  
                            감소
                        </Button>
                        <Button style="secondary" size="large" onClick={ reset }>
                            초기화
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
