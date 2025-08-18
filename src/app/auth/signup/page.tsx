import type { Metadata } from 'next';
import AuthForm from '@/features/auth/components/AuthForm';
export const metadata: Metadata = {
    title: 'Sign Up',
    description: 'Sign Up',
};

const Signup = async() => {
    return (
        <AuthForm />
    );
};

export default Signup;