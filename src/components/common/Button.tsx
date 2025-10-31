'use client';

import React from 'react';
import { cn } from '@/lib/utils/utils';
import { forwardRef } from 'react';

// Props 타입 정의 typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    // children: React.ReactNode;
    // type?: 'button' | 'submit' | 'reset' | 'link';
    variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'kakao'; // 버튼 스타일 타입
    sizes?: 'small' | 'medium' | 'large'; // 버튼 크기
    // href?: string; // 링크 주소
    outline?: boolean; // 버튼 테두리 여부
    // onClick?: () => void; // 클릭 이벤트 핸들러
    // className?: string; // 추가 클래스명
}

// Button 컴포넌트 정의

const setButtonStyle = (variant: string, outline: boolean) => {

    switch (variant) {
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
                    'bg-white text-danger hover:bg-danger/10 focus:bg-danger/10' : 
                    'bg-danger text-white hover:bg-danger/80 focus:bg-danger/80'
                }
            `;
        case 'warning':
            return `
                border-warning hover:border-warning/80 focus:border-warning/80 focus-visible:border-warning/80
                ${outline ? 
                    'bg-white text-warning hover:bg-warning/10 focus:bg-warning/10' : 
                    'bg-warning text-white hover:bg-warning/80 focus:bg-warning/80'
                }
            `;
        case 'kakao':
            return `
                border-kakao hover:border-kakao/80 focus:border-kakao/80 focus-visible:border-kakao/80
                ${outline ? 
                    'bg-white text-kakao hover:bg-kakao/10 focus:bg-kakao/10' : 
                    'bg-kakao text-kakao-symbol hover:bg-kakao/80 focus:bg-kakao/80'
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

const setButtonSize = (sizes: string) => {
    switch (sizes) {
        case 'small':
            return 'h-6 px-2 text-sm';
        case 'large':                               
            return 'h-12 px-4 text-lg';
        default:
            return 'h-8 px-2 text-base';
    }
};

const setButtonClasses = (variant: string, sizes: string, outline: boolean) => {

    const baseClasses = 'border rounded-md transition-all duration-200 outline-none';

    const disabledClasses = outline ? 'disabled:border-gray-400 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed' : 'disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed';

    // if(disabled) {
    //     return `${baseClasses} ${disabledClasses} ${setButtonSize(size)} cursor-not-allowed`;
    // }
    
    return `${baseClasses} ${setButtonStyle(variant, outline)} ${setButtonSize(sizes)} ${disabledClasses}`;
    
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        className = '',
        variant = 'primary',
        sizes = 'medium',
        outline = false,
        ...props
    }, ref: React.Ref<HTMLButtonElement>
    ) => {
        const buttonClasses = cn(setButtonClasses(variant, sizes, outline), className);
        // const buttonClasses = [
        //     `border rounded-md leading-1 font-medium cursor-pointer transition-all duration-200 outline-none`,
        //     setButtonStyle(style, outline),
        //     size !== 'medium' ? setButtonSize(size) : '',
        //     className,
        // ].filter(Boolean).join(' ');
        // 버튼 컴포넌트 반환
        // disabled prop을 명시적으로 boolean으로 변환하여 Hydration 오류 방지
        const disabled = props.disabled !== undefined ? Boolean(props.disabled) : false;
        
        return (

            <button 
                className={buttonClasses}
                ref={ref}
                {...props}
                disabled={disabled}
            />
        );
    }
);

Button.displayName = 'Button';

export default Button;