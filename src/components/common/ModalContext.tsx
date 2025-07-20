'use client';

import { useModalContext } from '@/contexts/ModalContext';

const ModalContext = () => {
    const { isOpenContext, contentContext, closeModalContext } = useModalContext();

    if (!isOpenContext) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md relative">
                <button
                    onClick={closeModalContext}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black"
                >
                    ✕
                </button>
                {contentContext}
            </div>
        </div>
    );
};

export default ModalContext;