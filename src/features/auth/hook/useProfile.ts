import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '../store/authStore';
import type { Profile } from '../types/auth';
import { postAuthMessage } from '../utils/authChannel';

const profileKey = (userId?: string) => ['profile', { userId }] as const;

export const useProfile = () => {

    const user = useAuthStore(state => state.user);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    return useQuery({
        queryKey: profileKey(user?.id),
        enabled: isAuthenticated && !!user?.id,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        queryFn: async (): Promise<Profile | null> => {
            if (!user?.id) return null;
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            if (error) throw new Error(error.message);
            return data;
        },
    });
};

export const useUpdateProfile = () => {
    const qc = useQueryClient();
    const user = useAuthStore(state => state.user);

    return useMutation({
        mutationFn: async (patch: Partial<Profile>) => {
            if (!user?.id) throw new Error('인증되지 않은 사용자입니다.');
            const { data, error } = await supabase
                .from('profiles')
                .update(patch)
                .eq('id', user.id)
                .select()
                .single();
            if (error) throw new Error(error.message);
            return data as Profile;
        },
        onSuccess: (data) => {
            qc.setQueryData(profileKey(user?.id), data);
            postAuthMessage('profile'); // 다른 탭에 프로필 변경 알림
        },
    });
};