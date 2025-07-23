'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
// import type { ReactNode } from 'react';

interface FlightStore {
    isLoading: boolean;
    setLoadingState: (isLoading: boolean) => void;
}

const useFlightStore = create<FlightStore>()(
    devtools(
        (set) => ({
            isLoading: false,
            setLoadingState: (isLoading: boolean) => set({ isLoading }),
        }), // 로직과 상태 정의 전달
        {
            name: 'ModalStore', // devtools에서 표시될 이름
            enabled: process.env.NODE_ENV === 'development', // 개발 환경에서만 활성화
        }
    )
);

export { useFlightStore };