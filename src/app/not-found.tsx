'use client';

import LinkButton from '@/components/common/LinkButton';
import Button from '@/components/common/Button';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl text-primary">404</h1>
                <h2 className="text-2xl font-semibold tracking-tight">페이지를 찾을 수 없습니다</h2>
                <p className="text-muted-foreground max-w-[500px] mx-auto">
                    요청하신 페이지가 존재하지 않거나, 주소가 잘못 입력되었습니다.<br />
                    입력하신 주소를 다시 확인해 주세요.
                </p>
            </div>
            <div className="mt-8 flex gap-4">
                <LinkButton variant="primary" href="/">홈으로 돌아가기</LinkButton>
                <Button variant="secondary"onClick={() => window.history.back()}>이전 페이지</Button>
            </div>
        </div>
    );
}

