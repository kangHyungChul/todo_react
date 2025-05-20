'use client';

import { useState, useEffect, useRef } from 'react';
import { CardType } from './types/card';
import { saveToStorage, loadFromStorage } from '@/lib/utils/localStorage';
import styles from './styles/Cardsection.module.scss';
import CardForm, { CardFormRef } from './components/CardForm';
import CardList from './components/CardList';

const STORAGE_KEY = 'cards';

const dummyCards: CardType[] = [
    {
        id: '1',
        title: '첫 번째 카드',
        content: '첫 번째 카드 내용',
        color: '#fff'
    },
    {
        id: '2',
        title: '두 번째 카드',
        content: '두 번째 카드 내용',
        color: '#fff'
    },
    {
        id: '3',
        title: '세 번째 카드',
        content: '세 번째 카드 내용',
        color: '#fff'
    },
    {
        id: '4',
        title: '네 번째 카드',
        content: '네 번째 카드 내용',
        color: '#fff'
    },
    {
        id: '5',
        title: '다섯 번째 카드',
        content: '다섯 번째 카드 내용',
        color: '#fff'
    },
    {
        id: '6',
        title: '여섯 번째 카드',
        content: '여섯 번째 카드 내용',
        color: '#fff'
    },
];

const CardSection = () => {
    const [cards, setCards] = useState<CardType[]>([]);
    const [titlePreview, setTitlePreview] = useState('');
    const formRef = useRef<CardFormRef>(null);

    useEffect(() => {
        console.log('useEffect 실행됨 - mount');
        const stored = loadFromStorage<CardType[]>(STORAGE_KEY);
        if (stored) setCards(stored);
    }, []);

    useEffect(() => {
        console.log('useEffect 실행됨 - update');
        if (cards.length === 0) setCards(dummyCards);
        saveToStorage(STORAGE_KEY, cards);
    }, [cards]);

    const handleAddCard = (title: string, content: string, color: string) => {
        const newCard: CardType = {
            id: `card-${Date.now()}`,
            title,
            content,
            color
        };
        setCards((prev) => [...prev, newCard]);
    };

    const handleDeleteCard = (id: string) => {
        setCards((prev) => prev.filter((card) => card.id !== id));
    };

    const handleChangeColor = (id: string, color: string) => {
        setCards((prev) =>
            prev.map((card) =>
                card.id === id ? { ...card, color } : card
            )
        );
    };

    return (
        <section>
            <h2 className={styles['section-header']}>나만의 카드 만들기 {titlePreview}</h2>
            <CardForm onAdd={handleAddCard} ref={formRef} title={titlePreview} setTitle={setTitlePreview} />
            <CardList cards={cards} onDelete={handleDeleteCard} onColorChange={handleChangeColor} />
        </section>
    );
};

export default CardSection;