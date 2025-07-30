'use client';

import { forwardRef } from 'react';

// Props 타입 정의 typescript
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>{
    // children: React.ReactNode;
    // value?: string; // 값
    variant?: 'success' | 'warning' | 'danger' | 'default'; // 스타일
    sizes?: 'small' | 'medium' | 'large'; // 크기
    // id?: string; // 아이디
    // onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void; // 클릭 이벤트 핸들러
    // className?: string; // 추가 클래스명
}

// Button 컴포넌트 정의

const setSelectStyle = (variant: string) => {

    switch (variant) {
        case 'success':
            return `
            border-primary hover:border-primary/80 focus:border-primary/80 focus-visible:border-primary/80
            `;
        case 'warning':
            return `
            border-warning hover:border-warning/80 focus:border-warning/80 focus-visible:border-warning/80
            `;
        case 'danger':
            return `
            border-danger hover:border-danger/80 focus:border-danger/80 focus-visible:border-danger/80
            `;
        default:
            return `
            border-gray-500 hover:border-gray-500/80 focus:border-gray-500/80 focus-visible:border-gray-500/80
            `;
    }
};

const setSelectSize = (sizes: string) => {
    switch (sizes) {
        case 'small':
            return 'h-6 px-2 text-sm';
        case 'large':                               
            return 'h-12 px-4 text-lg';
        default:
            return 'h-8 px-2 text-base';
    }
};

const setSelectClasses = (variant: string, sizes: string) => {

    const baseClasses = 'border rounded-md leading-1 transition-all duration-200 outline-none disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed';

    // const disabledClasses = 'bg-gray-200 border-gray-200 text-gray-400';

    // if(disabled) {
    //     return `${baseClasses} ${disabledClasses} ${setSelectSize(sizes)} cursor-not-allowed`;
    // }
    
    return `${baseClasses} ${setSelectStyle(variant)} ${setSelectSize(sizes)} cursor-pointer`;
    
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({
        className,
        variant = 'default',
        sizes = 'medium',
        ...props
    }, ref: React.Ref<HTMLSelectElement>
    ) => {
        const selectClasses = `${setSelectClasses(variant, sizes)} ${className}`;

        return (
            <select
                className={selectClasses}
                ref={ref}
                {...props}
            />
        );
    });

Select.displayName = 'Select';

export default Select;