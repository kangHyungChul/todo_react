// 모달 상태 로직을 커스텀 훅으로 분리
import { useState, useCallback } from 'react';
import { ReactNode } from 'react';

const useModalManagerContext = () => {
    const [isOpenContext, setIsOpenContext] = useState(false);
    const [contentContext, setContentContext] = useState<ReactNode>(null);

    const openModalContext = useCallback((component: ReactNode) => {
        setContentContext(component); // 콘텐츠 설정
        setIsOpenContext(true);
    }, []);

    const closeModalContext = useCallback(() => {
        setIsOpenContext(false);
        setContentContext(null);
    }, []);

    return { isOpenContext, contentContext, openModalContext, closeModalContext };
};

export default useModalManagerContext;