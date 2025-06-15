// 모달 상태 로직을 커스텀 훅으로 분리
import { useState, useCallback } from 'react';
import { ReactNode } from 'react';

const useModalManager = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState<ReactNode>(null);

    const openModal = useCallback((component: ReactNode) => {
        setContent(component); // 콘텐츠 설정
        setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setContent(null);
    }, []);

    return { isOpen, content, openModal, closeModal };
};

export default useModalManager;