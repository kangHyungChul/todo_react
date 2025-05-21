'use client';

import Card from './Card';
import { CardType } from '../types/card';
import styles from '../styles/CardList.module.scss';
import { useCallback, useMemo } from 'react';

interface Props {
    cards: CardType[];
    onDelete: (id: string) => void;
    onColorChange: (id: string, color: string) => void;
}

// 카드 리스트 컴포넌트 - 단순 배열 map으로 렌더링.
const CardList = ({ cards, onDelete, onColorChange }: Props) => {

    console.time('CardList');

    // useCallback: 함수 재생성을 막아 하위 컴포넌트에서 props 변화 감지 방지
    const handleDelete = useCallback((id: string) => {
        console.log('카드 삭제 실행!');
        // console.timeEnd('CardList');
        onDelete(id);
    }, [onDelete]);

    const handleColorChange = useCallback((id: string, color: string) => {
        console.log('카드 색상 변경 실행!');
        // console.timeEnd('CardList');
        onColorChange(id, color);
    }, [onColorChange]);

    // const handleDelete = (id: string) => {
    //     console.log('카드 삭제 실행!');
    //     console.timeEnd('CardList');
    //     onDelete(id);
    // }

    // const handleColorChange = (id: string, color: string) => {
    //     console.log('카드 색상 변경 실행!');
    //     console.timeEnd('CardList');
    //     onColorChange(id, color);
    // };

    // useMemo: 카드 랜더링 최적화
    const RenderedCards = useMemo(() => {
        console.log('카드 랜더링!');
        console.timeEnd('CardList');
        return cards.map((card) => (
            <Card key={card.id} id={card.id} title={card.title} content={card.content} color={card.color} onDelete={handleDelete} onColorChange={handleColorChange} />
        ));
    }, [cards, handleDelete, handleColorChange]);

    // const handleDelete = (id: string) => {
    //     onDelete(id);
    // };

    // const handleColorChange = (id: string, color: string) => {
    //     onColorChange(id, color);
    // };

    return (
        <>
            {cards.length > 0 ? (
                <ul className={ styles['card-list'] }>
                    {RenderedCards}
                </ul>
            ) : (
                <p className={ styles['non-card'] }>카드가 없습니다.</p>
            )}
        </>
    );
};

export default CardList;