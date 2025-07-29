'use client';

// Props 타입 정의 typescript
interface SelectProps {
    children: React.ReactNode;
    value?: string; // 값
    style?: 'success' | 'warning' | 'danger' | null; // 버튼 스타일 타입
    size?: 'small' | 'medium' | 'large'; // 버튼 크기
    disabled?: boolean; // 비활성화 여부
    id?: string; // 아이디
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void; // 클릭 이벤트 핸들러
    className?: string; // 추가 클래스명
}

// Button 컴포넌트 정의

const setSelectStyle = (style: string | null) => {

    switch (style) {
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

const setSelectSize = (size: string) => {
    switch (size) {
        case 'small':
            return 'h-6 px-2 text-sm';
        case 'large':                               
            return 'h-12 px-4 text-lg';
        default:
            return 'h-8 px-2 text-base';
    }
};

const setSelectClasses = (style: string | null, size: string, disabled: boolean) => {

    const baseClasses = 'border rounded-md leading-1 transition-all duration-200 outline-none';

    const disabledClasses = 'bg-gray-200 border-gray-200 text-gray-400';

    if(disabled) {
        return `${baseClasses} ${disabledClasses} ${setSelectSize(size)} cursor-not-allowed`;
    }
    
    return `${baseClasses} ${setSelectStyle(style)} ${setSelectSize(size)} cursor-pointer`;
    
};

const Select = (
    {
        children,
        value,
        style = null,
        size = 'medium',
        disabled = false,
        id,
        onChange,
        className = '',
    }: SelectProps
) => {
    const selectClasses = `${setSelectClasses(style, size, disabled)} ${className}`;

    return (
        <select
            className={selectClasses}
            disabled={disabled}
            value={value}
            onChange={onChange}
            id={id}
        >
            {children}
        </select>
    );
};

export default Select;