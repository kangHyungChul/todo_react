// context는 커스텀 훅에서 관리되는 상태를 받아 전달만 수행
'use client';

import { createContext, useContext, ReactNode } from 'react';
import useModalManager from '@/hooks/useModalManager';

// context 타입 정의
interface ModalContextType {
    isOpen: boolean;
    content: ReactNode;
    openModal: (component: ReactNode) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

// provider는 외부에서 useModalManager를 호출해서 사용
const ModalProvider = ({ children }: { children: ReactNode }) => {
    const modal = useModalManager();

    return (
        <ModalContext.Provider value={modal}>
            {children}
        </ModalContext.Provider>
    );
};

// context 사용을 위한 커스텀 훅
const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal은 ModalProvider 내부에서 사용되어야 합니다.');
    }
    return context;
};

export { ModalProvider, useModal };