'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { CardType } from './types/card';
import { saveToStorage, loadFromStorage } from '@/lib/utils/localStorage';
import styles from './styles/CardSection.module.scss';
import CardForm, { CardFormRef } from './components/CardForm';
import CardList from './components/CardList';

const STORAGE_KEY = 'cards';

// const dummyCards: CardType[] = [
//     {id: '1', title: '카드1', content: '카드1 내용', color: '#ffffff'},
//     {id: '2', title: '카드2', content: '카드2 내용', color: '#ffffff'}, 
//     {id: '3', title: '카드3', content: '카드3 내용', color: '#ffffff'},
//     {id: '4', title: '카드4', content: '카드4 내용', color: '#ffffff'},
//     {id: '5', title: '카드5', content: '카드5 내용', color: '#ffffff'},
//     {id: '6', title: '카드6', content: '카드6 내용', color: '#ffffff'},
//     {id: '7', title: '카드7', content: '카드7 내용', color: '#ffffff'},
//     {id: '8', title: '카드8', content: '카드8 내용', color: '#ffffff'},
//     {id: '9', title: '카드9', content: '카드9 내용', color: '#ffffff'},
//     {id: '10', title: '카드10', content: '카드10 내용', color: '#ffffff'},
//     {id: '11', title: '카드11', content: '카드11 내용', color: '#ffffff'},
//     {id: '12', title: '카드12', content: '카드12 내용', color: '#ffffff'},
//     {id: '13', title: '카드13', content: '카드13 내용', color: '#ffffff'},
//     {id: '14', title: '카드14', content: '카드14 내용', color: '#ffffff'},
//     {id: '15', title: '카드15', content: '카드15 내용', color: '#ffffff'},
//     {id: '16', title: '카드16', content: '카드16 내용', color: '#ffffff'},
//     {id: '17', title: '카드17', content: '카드17 내용', color: '#ffffff'},
//     {id: '18', title: '카드18', content: '카드18 내용', color: '#ffffff'},
//     {id: '19', title: '카드19', content: '카드19 내용', color: '#ffffff'},
//     {id: '20', title: '카드20', content: '카드20 내용', color: '#ffffff'},
//     {id: '21', title: '카드21', content: '카드21 내용', color: '#ffffff'},
//     {id: '22', title: '카드22', content: '카드22 내용', color: '#ffffff'},
//     {id: '23', title: '카드23', content: '카드23 내용', color: '#ffffff'},
//     {id: '24', title: '카드24', content: '카드24 내용', color: '#ffffff'},
//     {id: '25', title: '카드25', content: '카드25 내용', color: '#ffffff'},
//     {id: '26', title: '카드26', content: '카드26 내용', color: '#ffffff'},
//     {id: '27', title: '카드27', content: '카드27 내용', color: '#ffffff'},
//     {id: '28', title: '카드28', content: '카드28 내용', color: '#ffffff'},
//     {id: '29', title: '카드29', content: '카드29 내용', color: '#ffffff'},
//     {id: '30', title: '카드30', content: '카드30 내용', color: '#ffffff'},
//     {id: '31', title: '카드31', content: '카드31 내용', color: '#ffffff'},
//     {id: '32', title: '카드32', content: '카드32 내용', color: '#ffffff'},
//     {id: '33', title: '카드33', content: '카드33 내용', color: '#ffffff'},
//     {id: '34', title: '카드34', content: '카드34 내용', color: '#ffffff'},
//     {id: '35', title: '카드35', content: '카드35 내용', color: '#ffffff'},
//     {id: '36', title: '카드36', content: '카드36 내용', color: '#ffffff'},
//     {id: '37', title: '카드37', content: '카드37 내용', color: '#ffffff'},
//     {id: '38', title: '카드38', content: '카드38 내용', color: '#ffffff'},
//     {id: '39', title: '카드39', content: '카드39 내용', color: '#ffffff'},
//     {id: '40', title: '카드40', content: '카드40 내용', color: '#ffffff'},
//     {id: '41', title: '카드41', content: '카드41 내용', color: '#ffffff'},
//     {id: '42', title: '카드42', content: '카드42 내용', color: '#ffffff'},
//     {id: '43', title: '카드43', content: '카드43 내용', color: '#ffffff'},
//     {id: '44', title: '카드44', content: '카드44 내용', color: '#ffffff'},
//     {id: '45', title: '카드45', content: '카드45 내용', color: '#ffffff'},
//     {id: '46', title: '카드46', content: '카드46 내용', color: '#ffffff'},
//     {id: '47', title: '카드47', content: '카드47 내용', color: '#ffffff'},
//     {id: '48', title: '카드48', content: '카드48 내용', color: '#ffffff'},
//     {id: '49', title: '카드49', content: '카드49 내용', color: '#ffffff'},
//     {id: '50', title: '카드50', content: '카드50 내용', color: '#ffffff'},
//     {id: '51', title: '카드51', content: '카드51 내용', color: '#ffffff'},
//     {id: '52', title: '카드52', content: '카드52 내용', color: '#ffffff'},
//     {id: '53', title: '카드53', content: '카드53 내용', color: '#ffffff'},
//     {id: '54', title: '카드54', content: '카드54 내용', color: '#ffffff'},
//     {id: '55', title: '카드55', content: '카드55 내용', color: '#ffffff'},
//     {id: '56', title: '카드56', content: '카드56 내용', color: '#ffffff'},
//     {id: '57', title: '카드57', content: '카드57 내용', color: '#ffffff'},
//     {id: '58', title: '카드58', content: '카드58 내용', color: '#ffffff'},
//     {id: '59', title: '카드59', content: '카드59 내용', color: '#ffffff'},
//     {id: '60', title: '카드60', content: '카드60 내용', color: '#ffffff'},
//     {id: '61', title: '카드61', content: '카드61 내용', color: '#ffffff'},
//     {id: '62', title: '카드62', content: '카드62 내용', color: '#ffffff'},
//     {id: '63', title: '카드63', content: '카드63 내용', color: '#ffffff'},
//     {id: '64', title: '카드64', content: '카드64 내용', color: '#ffffff'},
//     {id: '65', title: '카드65', content: '카드65 내용', color: '#ffffff'},
//     {id: '66', title: '카드66', content: '카드66 내용', color: '#ffffff'},
//     {id: '67', title: '카드67', content: '카드67 내용', color: '#ffffff'},
//     {id: '68', title: '카드68', content: '카드68 내용', color: '#ffffff'},
//     {id: '69', title: '카드69', content: '카드69 내용', color: '#ffffff'},
//     {id: '70', title: '카드70', content: '카드70 내용', color: '#ffffff'},
//     {id: '71', title: '카드71', content: '카드71 내용', color: '#ffffff'},
//     {id: '72', title: '카드72', content: '카드72 내용', color: '#ffffff'},
//     {id: '73', title: '카드73', content: '카드73 내용', color: '#ffffff'},
//     {id: '74', title: '카드74', content: '카드74 내용', color: '#ffffff'},
//     {id: '75', title: '카드75', content: '카드75 내용', color: '#ffffff'},
//     {id: '76', title: '카드76', content: '카드76 내용', color: '#ffffff'},
//     {id: '77', title: '카드77', content: '카드77 내용', color: '#ffffff'},
//     {id: '78', title: '카드78', content: '카드78 내용', color: '#ffffff'},
//     {id: '79', title: '카드79', content: '카드79 내용', color: '#ffffff'},
//     {id: '80', title: '카드80', content: '카드80 내용', color: '#ffffff'},
//     {id: '81', title: '카드81', content: '카드81 내용', color: '#ffffff'},
//     {id: '82', title: '카드82', content: '카드82 내용', color: '#ffffff'},
//     {id: '83', title: '카드83', content: '카드83 내용', color: '#ffffff'},
//     {id: '84', title: '카드84', content: '카드84 내용', color: '#ffffff'},
//     {id: '85', title: '카드85', content: '카드85 내용', color: '#ffffff'},
//     {id: '86', title: '카드86', content: '카드86 내용', color: '#ffffff'},
//     {id: '87', title: '카드87', content: '카드87 내용', color: '#ffffff'},
//     {id: '88', title: '카드88', content: '카드88 내용', color: '#ffffff'},
//     {id: '89', title: '카드89', content: '카드89 내용', color: '#ffffff'},
//     {id: '90', title: '카드90', content: '카드90 내용', color: '#ffffff'},
//     {id: '91', title: '카드91', content: '카드91 내용', color: '#ffffff'},
//     {id: '92', title: '카드92', content: '카드92 내용', color: '#ffffff'},
//     {id: '93', title: '카드93', content: '카드93 내용', color: '#ffffff'},
//     {id: '94', title: '카드94', content: '카드94 내용', color: '#ffffff'},
//     {id: '95', title: '카드95', content: '카드95 내용', color: '#ffffff'},
//     {id: '96', title: '카드96', content: '카드96 내용', color: '#ffffff'},
//     {id: '97', title: '카드97', content: '카드97 내용', color: '#ffffff'},
//     {id: '98', title: '카드98', content: '카드98 내용', color: '#ffffff'},
//     {id: '99', title: '카드99', content: '카드99 내용', color: '#ffffff'},
//     {id: '100', title: '카드100', content: '카드100 내용', color: '#ffffff'},
// ];

const CardSection = () => {
    const [cards, setCards] = useState<CardType[]>([]);
    const [titlePreview, setTitlePreview] = useState('');
    const [contentPreview, setContentPreview] = useState('');
    const formRef = useRef<CardFormRef>(null);
    
    // CardForm 컴포넌트에서 전달받은 ref를 사용하여 제목 입력 필드에 포커스 설정
    // useEffect(() => {
    //     if (formRef.current) {
    //         formRef.current.focusTitle();
    //     }
    // }, []);

    console.time('CardSection');
    // 카드저장 useCallback 사용
    // cards배열을 참조로로 해당값이 변경되지 않으면 함수를 재생성하지 않음.
    const saveStorage = useCallback(() => {
        console.log('저장됨', cards.length);
        // console.timeEnd('CardSection');
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
        // setCards(dummyCards);
    }, []);

    // 카드 저장 useEffect 사용
    // saveStorage함수가 변경되지 않으면 함수를 재생성하지 않음.
    // saveStorage는 cards배열을 참조하고있음.
    useEffect(() => {
        console.log('useEffect 실행됨 - update');
        saveStorage();
        console.timeEnd('CardSection');
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