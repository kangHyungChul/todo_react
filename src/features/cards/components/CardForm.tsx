'use client';

import { useState, useRef, useImperativeHandle } from 'react';
import Button from '@/components/common/Button';
import styles from '../styles/CardForm.module.scss';

// 부모 컴포넌트에서 접근 가능한 함수 정의
export interface CardFormRef {
    focusTitle: () => void;
    focusContent: () => void;
}

// 부모 컴포넌트에서 전달받는 속성 정의
// interface CardFormProps extends React.HTMLAttributes<HTMLDivElement>  사용시 HTML속성(ClassName, Style, onClick등등 까지 전달가능)
export interface CardFormProps {
    onAdd: (title: string, content: string, color: string) => void;
    ref: React.Ref<CardFormRef>;
    titleState: {
        title: string;
        setTitle: (value: string) => void;
    };
    contentState: {
        content: string;
        setContent: (value: string) => void;
    };
}

// CardForm 컴포넌트는 부모로부터 ref를 받아 내부 메서드를 외부에 노출가능
// CardFormRef만 노출시킨 상태 / 전체노출은 HTMLInputElement
const CardForm = ({onAdd, ref, titleState, contentState}: CardFormProps) => {

    const [color, setColor] = useState('#ffffff');

    const { title, setTitle } = titleState;
    const { content, setContent } = contentState;

    // 제목 input에 포커스를 주기 위한 참조.
    // Ref가 DOM요소를 참조함으로 초기값은 null로 해야함
    const titleInputRef = useRef<HTMLInputElement>(null);
    const contentInputRef = useRef<HTMLTextAreaElement>(null);

    // 유효성 로직
    const checkInput = [
        { value: title, message: '제목을 입력해주세요.', ref: titleInputRef },
        { value: content, message: '내용을 입력해주세요.', ref: contentInputRef }
    ];

    // 부모 ref가 자식 내부 메서드에 접근 가능하게 설정.
    useImperativeHandle(ref, () => ({
        focusTitle() {
            titleInputRef.current?.focus();
        },
        focusContent() {
            contentInputRef.current?.focus();
        }
    }));

    const handleSubmit = () => {

        // 유효성 검사 of
        // for.. of문
        for (const { value, message, ref } of checkInput) {
            if (!value.trim()) {
                alert(message);
                ref.current?.focus();
                return;
            }
        }
        onAdd(title, content, color);
        setTitle('');
        setContent('');
        setColor('#ffffff');
    };

    return (
        <div className={styles.form}>
            <div>
                <input type="text" placeholder="제목 입력" value={title} ref={titleInputRef} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div>
                <textarea placeholder="내용 입력" value={content} ref={contentInputRef} onChange={(e) => setContent(e.target.value)} />
            </div>

            <div>
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            </div>

            <Button type="button" style="primary" onClick={handleSubmit}>카드 만들기</Button>
        </div>
    );
};

export default CardForm;