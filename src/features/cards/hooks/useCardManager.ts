import { useState, useEffect } from 'react';
import { CardType } from '../types/card';
import { saveToStorage, loadFromStorage } from '@/lib/utils/localStorage';

// 단순 고유 ID 생성기
let idCounter = 0;
const generateId = (): string => `card-${idCounter++}`;

export const useCardManager = () => {
    const [cards, setCards] = useState<CardType[]>([]);
    const STORAGE_KEY = 'my-cards';

    useEffect(() => {
        const saved = loadFromStorage<CardType[]>(STORAGE_KEY);
        if (saved) setCards(saved);
    }, []);

    useEffect(() => {
        saveToStorage(STORAGE_KEY, cards);
    }, [cards]);

    const addCard = (title: string, content: string) => {
        const newCard: CardType = {
            id: generateId(),
            title,
            content,
            color: '#ffffff'
        };
        setCards((prev) => [...prev, newCard]);
    };

    const deleteCard = (id: string) => {
        setCards((prev) => prev.filter((card) => card.id !== id));
    };

    const changeColor = (id: string, color: string) => {
        setCards((prev) =>
            prev.map((card) =>
                card.id === id ? { ...card, color } : card
            )
        );
    };

    return { cards, addCard, deleteCard, changeColor };
};