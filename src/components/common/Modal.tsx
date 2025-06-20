'use client';

// import { useModal } from '@/contexts/ModalContext';
import useModalStore from '@/store/ModalStore';
import { useShallow } from 'zustand/react/shallow';

const Modal = () => {
    // const { isOpen, content, closeModal } = useModal();
    // 객체나 배열의 최상위 레벨에서만 비교를 수행하는 얕은 비교 방식이다. 중첩된 객체나 배열의 내부 변경사항은 감지하지 않는다.
    // Zustand에서 shallow 비교는 불필요한 리렌더링을 방지하는 역할을 한다. 
    // 상태가 변경될 때마다 컴포넌트가 리렌더링된다면, 애플리케이션의 성능이 저하될 수 있다. 
    // shallow 비교를 통해 실제로 사용하는 상태만 변경되었을 때 리렌더링이 일어나도록 최적화할 수 있다.
    const { isOpen, content, closeModal } = useModalStore(
        useShallow((s) => ({
            isOpen: s.isOpen,
            content: s.content,
            closeModal: s.closeModal
        }))
    );
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black/50 z-50 flex justify-center items-center'>
            <div className='bg-white p-6 rounded shadow-lg w-[90%] max-w-md relative'>
                <button
                    onClick={closeModal}
                    className='absolute top-2 right-2 text-gray-500 hover:text-black'
                >
                    ✕
                </button>
                {content}
            </div>
        </div>
    );
};

export default Modal;