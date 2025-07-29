'use client';

// import { useState } from 'react';
// import Image from 'next/image';
import styles from './page.module.scss';
// import Button from '@/components/Button';
// import CardSection from '@/features/cards/CardSection';
import Link from 'next/link';

const TextComponent = () => {
    return (
        <div>
            <h1>TextComponent</h1>
        </div>
    );
};

export default function Home() {
    // const [count, setCount] = useState(0);

    // const countSet = (value: number = 1) => {
    //     setCount(prev => {
    //         const result = prev + value;
    //         return result;
    //         // if (result < 0) {
    //         //     // alert('카운트는 0 이하가 될 수 없습니다.');
    //         //     return 0;
    //         // } else {
    //         //     return result;
    //         // }
    //     });
    // };

    // const reset = () => {
    //     setCount(0);
    // };

    return (
        <main className={ styles.main }>
            <Link href="/modal">Modal</Link>
            <TextComponent />
            {/* <Link href="/flight">Flight</Link> */}
            {/* <CardSection /> */}
        </main>
        // <div className={styles.page}>
        //     <main className={styles.main}>
        //         <div className={styles.counter}>
        //             <strong>현재 카운트: {count}</strong>
        //             <div className={styles.buttonGroup}>
        //                 <Button type='primary' size='large' onClick={ () => countSet(1) }>
        //                     증가
        //                 </Button>
        //                 <Button type='danger' size='large' onClick={ () => countSet(-1) }>  
        //                     감소
        //                 </Button>
        //                 <Button type='secondary' size='large' onClick={ reset }>
        //                     초기화
        //                 </Button>
        //             </div>
        //         </div>
        //     </main>
        // </div>
    );
}
