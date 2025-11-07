'use client';

import { useAuthStore } from '@/features/auth/store/authStore';
import LinkButton from '@/components/common/LinkButton';
import Button from '@/components/common/Button';
import { useRouter } from 'next/navigation';

const FlightDetailViewButton = ({ path }: { path: string }) => {

    const { user } = useAuthStore();
    const router = useRouter();
    
    const sessionChk = () => {
        const confirm = window.confirm('로그인 사용자만 볼수있는데 볼껀가요?');
        if (confirm) {
            router.push(path);
        }
    };
    
    return (
        user ? (
            <LinkButton href={path} variant="secondary" outline={true} >상세페이지</LinkButton>
        ) : (
            <Button onClick={() => sessionChk() } variant="secondary" outline={true}>상세페이지</Button>
        )
    );
};

export default FlightDetailViewButton;
