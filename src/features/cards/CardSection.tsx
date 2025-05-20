'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { CardType } from './types/card';
import { saveToStorage, loadFromStorage } from '@/lib/utils/localStorage';
import styles from './styles/CardSection.module.scss';
import CardForm, { CardFormRef } from './components/CardForm';
import CardList from './components/CardList';

const STORAGE_KEY = 'cards';

const CardSection = () => {
    const [cards, setCards] = useState<CardType[]>([]);
    const [titlePreview, setTitlePreview] = useState('');
    const [contentPreview, setContentPreview] = useState('');
    const formRef = useRef<CardFormRef>(null);

    // 카드저장 useCallback 사용
    // cards배열이 종속되어 해당값이 변경되지 않으면 함수를 재생성하지 않음.
    const saveStorage = useCallback(() => {
        console.log('저장됨', cards.length);
        saveToStorage(STORAGE_KEY, cards);
    }, [cards]);
    // const saveStorage = () => {
    //     console.log('저장됨', cards.length);
    //     saveToStorage(STORAGE_KEY, cards);
    // };

    // 카드 불러오기 mount
    useEffect(() => {
        console.log('useEffect 실행됨 - mount');
        const stored = loadFromStorage<CardType[]>(STORAGE_KEY);
        if (stored) setCards(stored);
    }, []);

    // 카드 저장 useEffect 사용
    // saveStorage함수가 변경되지 않으면 함수를 재생성하지 않음.
    // saveStorage는 cards배열에 종속되어있음.
    useEffect(() => {
        console.log('useEffect 실행됨 - update');
        saveStorage();
    }, [saveStorage]);

    const handleAddCard = (title: string, content: string, color: string) => {
        const newCard: CardType = {
            id: `card-${Date.now()}`,
            title,
            content,
            color
        };
        setCards((prev) => [...prev, newCard]);
    };

    // 카드 삭제 useCallback 사용
    // 카드 삭제 함수가 변경되지 않으면 함수를 재생성하지 않음.
    // 참조할 setCards는 리액트에서 보장하는 stable한 값이므로 제외가능
    const handleDeleteCard = useCallback((id: string) => {
        setCards((prev) => prev.filter((card) => card.id !== id));
    }, []);

    // 카드 색상 변경 useCallback 사용
    // 카드 색상 변경 함수가 변경되지 않으면 함수를 재생성하지 않음.
    // 참조할 setCards는 리액트에서 보장하는 stable한 값이므로 제외가능
    const handleChangeColor = useCallback((id: string, color: string) => {
        setCards((prev) =>
            prev.map((card) =>
                card.id === id ? { ...card, color } : card
            )
        );
    }, []);

    return (
        <section>
            <h2 className={styles['section-header']}>나만의 카드 만들기</h2>
            <div className={styles['section-typing']}>
                <>
                    {
                        titlePreview && (
                            <h3>{titlePreview}</h3>
                        )
                    }
                    {
                        contentPreview && (
                            <p>{contentPreview}</p>
                        )
                    }
                </>
            </div>
            <CardForm onAdd={handleAddCard} ref={formRef} titleState={{ title: titlePreview, setTitle: setTitlePreview }} contentState={{ content: contentPreview, setContent: setContentPreview }} />
            <CardList cards={cards} onDelete={handleDeleteCard} onColorChange={handleChangeColor} />
        </section>
    );
};

export default CardSection;