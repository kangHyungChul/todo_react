'use client';

// import { useModal } from '@/contexts/ModalContext';
import useModalStore from '@/store/ModalStore';
import { cn } from '@/lib/utils/utils';
// import { useShallow } from 'zustand/react/shallow';

const Modal = () => {
    // const { isOpen, content, closeModal } = useModal();
    // 객체나 배열의 최상위 레벨에서만 비교를 수행하는 얕은 비교 방식이다. 중첩된 객체나 배열의 내부 변경사항은 감지하지 않는다.
    // Zustand에서 shallow 비교는 불필요한 리렌더링을 방지하는 역할을 한다. 
    // 상태가 변경될 때마다 컴포넌트가 리렌더링된다면, 애플리케이션의 성능이 저하될 수 있다. 
    // shallow 비교를 통해 실제로 사용하는 상태만 변경되었을 때 리렌더링이 일어나도록 최적화할 수 있다.

    // const { isOpen, content, modalSize, closeModal } = useModalStore(
    //     useShallow((s) => {
    //         const state = {
    //             isOpen: s.isOpen,
    //             content: s.content,
    //             modalSize: s.modalSize,
    //             closeModal: s.closeModal
    //         };
    //         console.log('Selector state:', state);
    //         return state;
    //     })
    // );

    
    const isOpen = useModalStore((state) => state.isOpen);
    const content = useModalStore((state) => state.content);
    const modalSize = useModalStore((state) => state.modalSize);
    const closeModal = useModalStore((state) => state.closeModal);
        
    if (!isOpen) return null;

    const sizeClass = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
    }[modalSize || 'md'];

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center" onClick={closeModal}>
            <div className={cn('bg-white p-6 rounded shadow-lg w-full relative', sizeClass)} onClick={(e) => e.stopPropagation()}>
                <div className="overflow-y-auto">
                    {content}
                </div>
                <button type="button" onClick={closeModal} className="absolute top-3 right-3">
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Modal;