'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { CardType } from './types/card';
import { saveToStorage, loadFromStorage } from '@/lib/utils/localStorage';
import styles from './styles/CardSection.module.scss';
import CardForm, { CardFormRef } from './components/CardForm';
import CardList from './components/CardList';

const STORAGE_KEY = 'cards';

// type CardAction =
//     | { type: 'ADD_CARD'; payload: CardType }
//     | { type: 'DELETE_CARD'; payload: string } // id만 전달
//     | { type: 'CHANGE_COLOR'; payload: { id: string; color: string } }

// const cardReducer = (state: CardType[], action: CardAction) => {
//     console.log(state, action.type, action.payload);
//     switch (action.type) {
//         case 'ADD_CARD':
//             return [...state, action.payload];
//         case 'DELETE_CARD':
//             return state.filter((card) => card.id !== action.payload);
//         case 'CHANGE_COLOR':
//             return state.map((card) => card.id === action.payload.id ? { ...card, color: action.payload.color } : card);
//         default:
//             return state;
//     }
// }

const CardSection = () => {

    const [cards, setCards] = useState<CardType[]>([]);
    const [titlePreview, setTitlePreview] = useState('');
    const [contentPreview, setContentPreview] = useState('');
    const [cardAddDisabled, setCardAddDisabled] = useState(false);

    const formRef = useRef<CardFormRef>(null);
    
    // CardForm 컴포넌트에서 전달받은 ref를 사용하여 제목 입력 필드에 포커스 설정
    // useEffect(() => {
    //     if (formRef.current) {
    //         formRef.current.focusTitle();
    //     }
    // }, []);
    const cardDisabled = (boolean: boolean) => {
        setCardAddDisabled(boolean);
    };
    // console.time('CardSection');
    // 카드저장 useCallback 사용
    // cards배열을 참조로로 해당값이 변경되지 않으면 함수를 재생성하지 않음.
    const saveStorage = useCallback(() => {
        console.log('저장됨', cards.length);
        // console.timeEnd('CardSection');
        saveToStorage(STORAGE_KEY, cards);
    }, [cards]);

    // 카드 불러오기 mount
    useEffect(() => {
        console.log('useEffect 실행됨 - mount');
        const stored = loadFromStorage<CardType[]>(STORAGE_KEY);
        if (stored) {
            setCards(stored);
            cardDisabled(stored.length > 5);
        }
    }, []);

    // 카드 저장 useEffect 사용
    // saveStorage함수가 변경되지 않으면 함수를 재생성하지 않음.
    // saveStorage는 cards배열을 참조하고있음.
    useEffect(() => {
        console.log('useEffect 실행됨 - update');
        saveStorage();
        cardDisabled(cards.length > 5);
    }, [saveStorage, cards]);

    const handleAddCard = useCallback((title: string, content: string, color: string) => {
        const newCard: CardType = {
            id: `card-${Date.now()}`,
            title,
            content,
            color
        };
        setCards((prev) => [...prev, newCard]);
    }, []);

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
            <CardForm onAdd={handleAddCard} ref={formRef} cardAddDisabled={cardAddDisabled} titleState={{ title: titlePreview, setTitle: setTitlePreview }} contentState={{ content: contentPreview, setContent: setContentPreview }} />
            <CardList cards={cards} onDelete={handleDeleteCard} onColorChange={handleChangeColor} />
        </section>
    );
};

export default CardSection;