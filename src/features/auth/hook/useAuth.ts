import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
    const store = useAuthStore();
    return {
        user: store.user,
        isAuthenticated: store.isAuthenticated,
        loading: store.loading,
        signIn: store.signIn,
        signOut: store.signOut,
        initialize: store.initialize,
    };
};