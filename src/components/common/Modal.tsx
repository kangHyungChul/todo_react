'use client';

// import { useModal } from '@/contexts/ModalContext';
import useModalStore from '@/store/ModalStore';

const Modal = () => {
    // const { isOpen, content, closeModal } = useModal();
    const { isOpen, content, closeModal } = useModalStore();

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