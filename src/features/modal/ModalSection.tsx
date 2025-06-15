'use client';

import Button from '@/components/common/Button';
import { useModal } from '@/contexts/ModalContext';

const ModalSection = () => {
    const { openModal } = useModal();

    return (
        <div className="px-4 py-8 grid-cols-2">
            <div className="bg-white rounded-lg p-4 shadow-md">
                <h2 className="text-2xl font-bold mb-4">Modal 예제</h2>
                <p>이 예제는 모달 컴포넌트를 보여주는 예제입니다.</p>
                <Button style="primary" size="large" className="mt-4" onClick={() => openModal(<div>모달 컴포넌트 내용</div>)}>모달 열기</Button>
            </div>
        </div>
    );
};

export default ModalSection;
