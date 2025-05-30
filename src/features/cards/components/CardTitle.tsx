'use client';

import { memo } from 'react';

import styles from '../styles/CardTitle.module.scss';

export interface CardTitleProps {
    title: string;
    content: string;
}

const CardTitle = ({ title, content }: CardTitleProps) => {
    return (
        <>
            {
                title && (
                    <h2 className={styles['section-header']}>{title}</h2>
                )
            }
            {
                content && (
                    <p className={styles['section-typing']}>{content}</p>
                )
            }
        </>
    );
};

export default memo(CardTitle);