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

    console.log(`렌더링된 카드: ${id}`);

    // useMemo: 카드 배경색이 변할 때만 스타일 객체를 다시 계산함.
    const cardStyle = useMemo(() => {
        // console.log(`${color} 스타일 계산`);
        return { backgroundColor: color };
    }, [color]);

    // // useMemo 사용안했을때 예시
    // const cardStyle = () => {
    //     // console.log(`${color} 스타일 계산`);
    //     return { backgroundColor: color };
    // };
    
    // console.time('render');
    // useEffect(() => {
    //     console.timeEnd('render');
    // });

    // console.log(`${title} 랜더링`);

    return (
        <li className={styles.card} style={cardStyle}>
            <h3>{title}</h3>
            <p>{content}</p>
            <div className={styles.controls}>
                <input type="color" value={color} onChange={(e) => onColorChange(id, e.target.value)} />
                <Button type="button" style="danger" size="small" onClick={() => onDelete(id)}>삭제</Button>
            </div>
        </li>
    );
};

// 메모이제이션된 컴포넌트로 내보냄
// export default memo(Card, (prev, next) => {
//     // console.log(prev, next);
//     // console.log('prev === next', prev.id, next.id, prev.color === next.color);
//     return (
//         // prev.id === next.id &&
//         // prev.title === next.title &&
//         // prev.content === next.content &&
//         prev.color === next.color
//     );
// });
export default Card;