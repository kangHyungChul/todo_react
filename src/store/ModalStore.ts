'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ReactNode, ComponentType } from 'react';

interface ModalStore {
    isOpen: boolean;
    content: ReactNode | null;
    component: ComponentType<Record<string, unknown>> | null;
    props: Record<string, unknown> | null;
    modalSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | null;
    openModal: (content: ReactNode, size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl') => void;
    openModalWithComponent: <P extends Record<string, unknown>>(
        component: ComponentType<P>,
        props: P,
        size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    ) => void;
    closeModal: () => void;
}

// const createModalLogic = (
//     // partial: Partial<ModalStore> 타입은 부분 상태만 전달 가능하게 만듬
//     // 그낭 set으로 ModalStore값중 하나를 변경하면 나머지는 사라지는데
//     // Partial을 사용하면 해당값만 변경하고 나머지는 유지가가능
//     set: (partial: Partial<ModalStore>) => void
// ): ModalStore => ({
//     isOpen: false,
//     content: null,
//     openModal: (content) => set({ isOpen: true, content }),
//     closeModal: () => set({ isOpen: false, content: null }),
// });

// const useModalStore = create<ModalStore>()(
//     devtools(
//         (set) => createModalLogic(set), // 로직과 상태 정의 전달
//         {
//             name: 'ModalStore', // devtools에서 표시될 이름
//             enabled: process.env.NODE_ENV === 'development', // 개발 환경에서만 활성화
//         }
//     )
// );

// const createModalLogic = (
//     // partial: Partial<ModalStore> 타입은 부분 상태만 전달 가능하게 만듬
//     // 그낭 set으로 ModalStore값중 하나를 변경하면 나머지는 사라지는데
//     // Partial을 사용하면 해당값만 변경하고 나머지는 유지가가능
//     set: (partial: Partial<ModalStore>) => void
// ): ModalStore => ({
//     isOpen: false,
//     content: null,
//     openModal: (content) => set({ isOpen: true, content }),
//     closeModal: () => set({ isOpen: false, content: null }),
// })

const useModalStore = create<ModalStore>()(
    devtools(
        (set) => ({
            isOpen: false,
            content: null,
            component: null,
            props: null,
            modalSize: 'md',
            openModal: (content, size = 'md') => {
                // console.log('openModal size:', size);
                set((state) => ({ 
                    ...state, 
                    isOpen: true, 
                    content,
                    component: null,
                    props: null,
                    modalSize: size
                }));
            },
            openModalWithComponent: (component, props, size = 'md') => {
                set((state) => ({ 
                    ...state, 
                    isOpen: true, 
                    content: null,  // content 방식과 구분
                    component: component as ComponentType<Record<string, unknown>>,
                    props: props as Record<string, unknown>,
                    modalSize: size
                }));
            },
            closeModal: () => set((state) => ({ 
                ...state, 
                isOpen: false, 
                content: null,
                component: null,
                props: null,
                modalSize: 'md'
            })),
        }), // 로직과 상태 정의 전달
        {
            name: 'ModalStore', // devtools에서 표시될 이름
            enabled: process.env.NODE_ENV === 'development', // 개발 환경에서만 활성화
        }
    )
);

export default useModalStore;