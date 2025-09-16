'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/features/auth/store/authStore';
import { subscribeAuthMessage } from '@/features/auth/utils/authChannel';

export const useAuthSync = (): void => {
    const qc = useQueryClient();
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        const unsubscribe = subscribeAuthMessage((msg) => {
            if (msg.type !== 'AUTH_UPDATE') return;
            
            // 단순하게 debounce만 적용해서 세션 재확인
            if (timerRef.current) window.clearTimeout(timerRef.current);
            timerRef.current = window.setTimeout(async () => {
                const { data } = await supabase.auth.getSession();
                useAuthStore.getState().setAuthState(
                    data.session?.user || null, 
                    !!data.session?.user, 
                    { broadcast: false }
                );
                
                // 필요한 쿼리만 무효화 (프로젝트에 따라 조정)
                qc.invalidateQueries({ queryKey: ['profile'] });
            }, 100);
        });

        return () => {
            if (timerRef.current) window.clearTimeout(timerRef.current);
            unsubscribe();
        };
    }, [qc]);
};