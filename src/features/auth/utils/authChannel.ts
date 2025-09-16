'use client';

import { BroadcastChannel } from 'broadcast-channel';

export type AuthReason = 'login' | 'logout' | 'profile';

export interface AuthMessage {
    type: 'AUTH_UPDATE';
    reason: AuthReason;
    senderId: string;
}

// 내가 보낸 메시지를 구분하기 위한 탭 고유 ID
export const SENDER_ID = Math.random().toString(36).slice(2);

let authChannel: BroadcastChannel<AuthMessage> | null = null;

// 채널 생성/재사용
export const getAuthChannel = (): BroadcastChannel<AuthMessage> => {
    if (typeof window === 'undefined') {
        throw new Error('BroadcastChannel is not available on server.');
    }
    if (!authChannel) {
        authChannel = new BroadcastChannel<AuthMessage>('auth');
    }
    return authChannel;
};

// 송신 (로그인/로그아웃/프로필 업데이트 이벤트 전파)
export const postAuthMessage = (reason: AuthReason): void => {
    try {
        getAuthChannel().postMessage({
            type: 'AUTH_UPDATE',
            reason,
            senderId: SENDER_ID,
        });
    } catch (error) {
        console.warn('Auth broadcast failed:', error);
        // 실패해도 앱이 중단되지 않도록
    }
};

// 수신 구독 (내가 보낸 건 무시)
export const subscribeAuthMessage = (
    handler: (msg: AuthMessage) => void
): (() => void) => {
    const ch = getAuthChannel();
    const onMessage = (msg: AuthMessage) => {
        if (msg.senderId === SENDER_ID) return; // 내가 보낸 메시지는 무시
        handler(msg);
    };
    ch.addEventListener('message', onMessage);
    return () => ch.removeEventListener('message', onMessage);
};

// 채널 정리
export const closeAuthChannel = async (): Promise<void> => {
    if (authChannel) {
        await authChannel.close();
        authChannel = null;
    }
};