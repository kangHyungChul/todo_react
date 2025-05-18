'use client';

import React from 'react';
import styles from './Button.module.scss';

// Props 타입 정의 typescript
interface ButtonProps {
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    style?: 'primary' | 'secondary' | 'danger'; // 버튼 스타일 타입
    size?: 'small' | 'medium' | 'large'; // 버튼 크기
    disabled?: boolean; // 비활성화 여부
    onClick?: () => void; // 클릭 이벤트 핸들러
    className?: string; // 추가 클래스명
}

// Button 컴포넌트 정의
const Button: React.FC<ButtonProps> = ({
    children,
    type = 'button', // 기본값: button
    style = 'primary', // 기본값: primary
    size = 'medium', // 기본값: medium
    disabled = false, // 기본값: false
    onClick,
    className = '', // 기본값: 빈 문자열
}) => {
    const baseClass = styles.button;
    const buttonClasses = [
        baseClass,
        `${baseClass}--${style}`,
        size !== 'medium' ? `${baseClass}--${size}` : '',
        className,
    ].filter(Boolean).join(' ');

    // 버튼 컴포넌트 반환
    return (
        <button
            type={type}
            className={buttonClasses}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;