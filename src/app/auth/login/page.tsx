import type { Metadata } from 'next';
import LoginForm from '@/features/auth/components/LoginForm';
export const metadata: Metadata = {
    title: 'Flight Departure',
    description: 'Flight Departure',
};

const Login = async() => {
    return (
        <LoginForm />
    );
};

export default Login;