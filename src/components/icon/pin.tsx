import React from 'react';

interface PinIconProps {
width?: number;
height?: number;
className?: string;
}

/**
 * Flight 아이콘 컴포넌트
 * @param width - 아이콘의 너비 (기본값: 24)
 * @param height - 아이콘의 높이 (기본값: 24)
 * @param className - 추가 CSS 클래스명
 */

const PinIcon = ({
    width = 24,
    height = 24,
    className = '',
}: PinIconProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
            <circle cx="12" cy="10" r="3"></circle>
        </svg>
    );
};

export default PinIcon;
