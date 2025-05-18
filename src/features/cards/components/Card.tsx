'use client';

import { memo, useMemo } from 'react';
// import { CardType } from '../types/card';
import Button from '@/components/common/Button';
import styles from '../styles/Card.module.scss';

interface CardProps {
    id: string;
    title: string;
    content: string;
    color: string;
    onDelete: (id: string) => void;
    onColorChange: (id: string, color: string) => void;
}

// React.memo: props가 변경되지 않으면 이 컴포넌트는 리렌더링 안됨.
// 카드가 많아졌을 때 렌더링 성능을 향상시켜줌.
const Card = ({ id, title, content, color, onDelete, onColorChange }: CardProps) => {

    console.log(color);
    // useMemo: 카드 배경색이 변할 때만 스타일 객체를 다시 계산함.
    const cardStyle = useMemo(() => {
        // console.log(`${color} 스타일 계산`);
        return { backgroundColor: color };
    }, [color]);

    // console.log(`${title} 랜더링`);

    return (
        <div className={styles.card} style={cardStyle}>
            <h3>{title}</h3>
            <p>{content}</p>
            <div className={styles.controls}>
                <input type="color" value={color} onChange={(e) => onColorChange(id, e.target.value)} />
                <Button type="button" style="danger" size="small" onClick={() => onDelete(id)}>삭제</Button>
            </div>
        </div>
    );
};

// 메모이제이션된 컴포넌트로 내보냄
export default memo(Card);

// // React.memo 사용안했을때
// const Card = ({ data, onDelete, onColorChange }: CardProps) => {

//     // useMemo 사용안했을때 예시
//     const cardStyle = () => {
        // console.log(`${data.title} 스타일 계산 / useMemo 사용안함`);
//         return { backgroundColor: data.color };
//     };

//     console.log(`${data.title} 랜더링`);

//     return (
//         <div className={styles.card} style={cardStyle()}>
//             <h3>{data.title}</h3>
//             <p>{data.content}</p>
//             <div className={styles.controls}>
//                 <input type="color" value={data.color} onChange={(e) => onColorChange(data.id, e.target.value)} />
//                 <Button type="button" style="danger" size="small" onClick={() => onDelete(data.id)}>삭제</Button>
//             </div>
//         </div>
//     );
// };

// // 메모이제이션된 컴포넌트로 내보냄
// export default Card;