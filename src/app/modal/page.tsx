import type { Metadata } from 'next';
import ModalSection from '@/features/modal/ModalSection';
export const metadata: Metadata = {
    title: 'Modal',
    description: 'Modal',
};

const Modal = () => {

    return (
        <>
            <ModalSection />
        </>
    );
};

export default Modal;