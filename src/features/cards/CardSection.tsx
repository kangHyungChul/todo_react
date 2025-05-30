'use client';

import { useState, useEffect, useRef, useCallback, useReducer } from 'react';
import { CardType } from './types/card';
import { saveToStorage, loadFromStorage } from '@/lib/utils/localStorage';
// import styles from './styles/CardSection.module.scss';
import CardForm, { CardFormRef } from './components/CardForm';
import CardList from './components/CardList';
import CardTitle from './components/CardTitle';

const STORAGE_KEY = 'cards';

type CardAction =
    | { type: 'SET_CARDS'; payload: CardType[] }  // 카드 배열 전체를 설정하는 액션
    | { type: 'ADD_CARD'; payload: CardType } // cardType 전체 전달달
    | { type: 'DELETE_CARD'; payload: string } // id만 전달 - id값 기반 제거
    | { type: 'CHANGE_COLOR'; payload: { id: string; color: string } } // id와 색상 전달 - id값 기반 색상 변경

const cardReducer = (state: CardType[], action: CardAction) => {
    console.log(state, action.type, action.payload);
    switch (action.type) {
        case 'SET_CARDS':
            return action.payload;
        case 'ADD_CARD':
            return [...state, action.payload];
        case 'DELETE_CARD':
            return state.filter((card) => card.id !== action.payload);
        case 'CHANGE_COLOR':
            return state.map((card) => card.id === action.payload.id ? { ...card, color: action.payload.color } : card);
        default:
            return state;
    }
}

const CardSection = () => {

    // const [cards, setCards] = useState<CardType[]>([]);
    // 초기값 빈배열
    // 두번째 인자값에 undefined나 이후에 실행할 삼수 인자값 추가 (인자값 없으면 undefined)
    // 세번째 인자값에 초기값 설정 함수 추가 (인자값 없으면 초기값 빈배열)
    const [cards, dispatch] = useReducer(cardReducer, []);

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

    // 카드 불러오기 mount
    useEffect(() => {
        console.log('useEffect 실행됨 - mount');
        const stored = loadFromStorage<CardType[]>(STORAGE_KEY);
        if (stored) {
            // setCards(stored);
            dispatch({ type: 'SET_CARDS', payload: stored });
            cardDisabled(stored.length > 5);
        }
    }, []);

    // 카드 저장 useEffect 사용
    useEffect(() => {
        console.log('useEffect 실행됨 - update');
        saveToStorage(STORAGE_KEY, cards);
        cardDisabled(cards.length > 5);
    }, [cards]);
    

    const handleAddCard = useCallback((title: string, content: string, color: string) => {
        const newCard: CardType = {
            id: `card-${Date.now()}`,
            title,
            content,
            color
        };
        // setCards((prev) => [...prev, newCard]);
        dispatch({ type: 'ADD_CARD', payload: newCard });
    }, []);

    // 카드 삭제 useCallback 사용
    // 카드 삭제 함수가 변경되지 않으면 함수를 재생성하지 않음.
    // 참조할 setCards는 리액트에서 보장하는 stable한 값이므로 제외가능
    const handleDeleteCard = useCallback((id: string) => {
        // setCards((prev) => prev.filter((card) => card.id !== id));
        dispatch({ type: 'DELETE_CARD', payload: id });
    }, []);

    // 카드 색상 변경 useCallback 사용
    // 카드 색상 변경 함수가 변경되지 않으면 함수를 재생성하지 않음.
    // 참조할 setCards는 리액트에서 보장하는 stable한 값이므로 제외가능
    const handleChangeColor = useCallback((id: string, color: string) => {
        // setCards((prev) =>
        //     prev.map((card) =>
        //         card.id === id ? { ...card, color } : card
        //     )
        // );
        dispatch({ type: 'CHANGE_COLOR', payload: { id, color } });
    }, []);

    return (
        <section>
            <CardTitle title={titlePreview} content={contentPreview} />
            <CardForm onAdd={handleAddCard} ref={formRef} cardAddDisabled={cardAddDisabled} titleState={{ title: titlePreview, setTitle: setTitlePreview }} contentState={{ content: contentPreview, setContent: setContentPreview }} />
            <CardList cards={cards} onDelete={handleDeleteCard} onColorChange={handleChangeColor} />
        </section>
    );
};

export default CardSection;