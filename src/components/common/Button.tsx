'use client';

import React from 'react';
import Link from 'next/link';
// import styles from './Button.module.css';

// Props 타입 정의 typescript
interface ButtonProps {
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset' | 'link';
    style?: 'primary' | 'secondary' | 'danger'; // 버튼 스타일 타입
    size?: 'small' | 'medium' | 'large'; // 버튼 크기
    href?: string; // 링크 주소
    outline?: boolean; // 버튼 테두리 여부
    disabled?: boolean; // 비활성화 여부
    onClick?: () => void; // 클릭 이벤트 핸들러
    className?: string; // 추가 클래스명
}

// Button 컴포넌트 정의

const setButtonStyle = (style: string, outline: boolean) => {

    switch (style) {
        case 'primary':
            return `
            border-primary hover:border-primary/80 focus:border-primary/80 focus-visible:border-primary/80
            ${outline ? 
                'bg-white text-primary hover:bg-primary/10 focus:bg-primary/10' : 
                'bg-primary text-white hover:bg-primary/80 focus:bg-primary/80'
            }
            `;
        case 'secondary':
            return `
            border-secondary hover:border-secondary/80 focus:border-secondary/80 focus-visible:border-secondary/80
            ${outline ? 
                'bg-white text-secondary hover:bg-secondary/80 focus:bg-secondary/80' : 
                'bg-secondary text-white hover:bg-secondary/80 focus:bg-secondary/80'
            }
            `;
        case 'danger':
            return `
            border-danger hover:border-danger/80 focus:border-danger/80 focus-visible:border-danger/80
            ${outline ? 
                'bg-danger text-white hover:bg-danger/80 focus:bg-danger/80' : 
                'bg-danger text-white hover:bg-danger/80 focus:bg-danger/80'
            }
            `;
        default:
            return `
            border-gray-500 hover:border-gray-500/80 focus:border-gray-500/80 focus-visible:border-gray-500/80
            ${outline ? 
                'bg-gray-500 text-gray-900 hover:bg-gray-500/80 focus:bg-gray-500/80' : 
                'bg-gray-500 text-gray-900 hover:bg-gray-500/80 focus:bg-gray-500/80'
            }
            `;
    }
};

const setButtonSize = (size: string) => {
    switch (size) {
        case 'small':
            return 'h-6 px-2 py-1 text-sm';
        case 'large':                               
            return 'h-12 px-4 py-2 text-lg';
        default:
            return 'h-8 px-2 py-2 text-base';
    }
};

const setButtonClasses = (style: string, size: string, outline: boolean, disabled: boolean) => {

    const baseClasses = 'border rounded-md leading-1 transition-all duration-200 outline-none';

    const disabledClasses = outline ? 'border-gray-400 bg-gray-200 text-gray-400' : 'bg-gray-200 border-gray-200 text-gray-400';

    if(disabled) {
        return `${baseClasses} ${disabledClasses} ${setButtonSize(size)} cursor-not-allowed`;
    }
    
    return `${baseClasses} ${setButtonStyle(style, outline)} ${setButtonSize(size)} cursor-pointer`;
    
};

const Button = (
    {
        children,
        type = 'button',
        style = 'primary',
        size = 'medium',
        href,
        outline = false,
        disabled = false,
        onClick,
        className = '',
    }: ButtonProps
) => {
    const buttonClasses = `${setButtonClasses(style, size, outline, disabled)} ${className}`;
    // const buttonClasses = [
    //     `border rounded-md leading-1 font-medium cursor-pointer transition-all duration-200 outline-none`,
    //     setButtonStyle(style, outline),
    //     size !== 'medium' ? setButtonSize(size) : '',
    //     className,
    // ].filter(Boolean).join(' ');
    // 버튼 컴포넌트 반환
    return (
        type === 'link' ? (
            <Link href={href || ''} className={buttonClasses}>
                {children}
            </Link>
        ) : (
        <button
            type={type}
            className={buttonClasses}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
        )
    );
};

export default Button;