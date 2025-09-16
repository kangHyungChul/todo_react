import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
    return useAuthStore(
        useShallow(state => ({
            user: state.user,
            isAuthenticated: state.isAuthenticated,
            loading: state.loading,
            signIn: state.signIn,
            signOut: state.signOut,
            initialize: state.initialize,
        }))
    );
};