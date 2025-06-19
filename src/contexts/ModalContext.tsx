// context는 커스텀 훅에서 관리되는 상태를 받아 전달만 수행
'use client';

import { createContext, useContext, ReactNode } from 'react';
import useModalManagerContext from '@/hooks/useModalManagerContext';

// context 타입 정의
interface ModalContextType {
    isOpenContext: boolean;
    contentContext: ReactNode;
    openModalContext: (component: ReactNode) => void;
    closeModalContext: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

// provider는 외부에서 useModalManagerContext를 호출해서 사용
const ModalProvider = ({ children }: { children: ReactNode }) => {
    const modal = useModalManagerContext();

    return (
        <ModalContext.Provider value={modal}>
            {children}
        </ModalContext.Provider>
    );
};

const useModalContext = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModalContext는 ModalProvider 내부에서 사용되어야 합니다.');
    }
    return context;
};

export { ModalProvider, useModalContext };