'use client';

import { useState, useEffect, useRef } from 'react';
import { CardType } from './types/card';
import { saveToStorage, loadFromStorage } from '@/lib/utils/localStorage';
import CardForm, { CardFormRef } from './components/CardForm';
import CardList from './components/CardList';

// 로컬스토리지 키 정의
const STORAGE_KEY = 'cards';

// 카드 섹션: 전체 카드 상태를 관리하는 컨테이너 컴포넌트
const CardSection = () => {
    // useState: 카드 배열 상태를 관리  
    const [cards, setCards] = useState<CardType[]>([]);

    // useRef: CardForm에 focus 요청하기 위한 참조 ref
    // 이 ref는 CardForm 컴포넌트에서 forwardRef로 전달받음.
    const formRef = useRef<CardFormRef>(null);

    // useEffect: 마운트 시 로컬스토리지에서 카드 목록을 불러옴.
    useEffect(() => {
        const stored = loadFromStorage<CardType[]>(STORAGE_KEY);
        if (stored) {
            setCards(stored);
        }
    }, []);

    // useEffect: 카드 상태가 바뀔 때마다 로컬스토리지에 저장.
    useEffect(() => {
        saveToStorage(STORAGE_KEY, cards);
        // console.log(cards);
    }, [cards]);

    // 카드 추가 함수
    const handleAddCard = (title: string, content: string, color: string) => {
        const newCard: CardType = {
            id: `card-${Date.now()}`, // 간단한 고유 ID 생성
            title,
            content,
            color
        };
        setCards((prev) => [...prev, newCard]);
    };

    // 카드 삭제 함수
    const handleDeleteCard = (id: string) => {
        setCards((prev) => prev.filter((card) => card.id !== id));
    };

    // 카드 색상 변경 함수
    const handleChangeColor = (id: string, color: string) => {
        setCards((prev) =>
            prev.map((card) =>
                card.id === id ? { ...card, color } : card
            )
        );
    };

    // const refFunction = formRef.current?.focusContent;

    return (
        <section>
            <h2>나만의 카드 만들기</h2>

            {/* 카드 추가 입력 폼 (forwardRef로 참조) */}
            <CardForm onAdd={handleAddCard} ref={formRef} />

            {/* 카드 목록 컴포넌트 */}
            <CardList cards={cards} onDelete={handleDeleteCard} onColorChange={handleChangeColor} />

            {/* 나중에 버튼 추가 시: 폼 내부 포커스 제어 등 가능 */}
            {/* <button onClick={() => refFunction()}>제목 입력 포커스</button> */}
        </section>
    );
};

export default CardSection;