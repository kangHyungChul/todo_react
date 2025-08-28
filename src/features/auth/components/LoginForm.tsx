'use client';

import { Input } from '@/components/ui/input';
import Button from '@/components/common/Button';
import { useState, useActionState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submitFormData = async (prevState: { email: string; password: string }, fd: FormData): Promise<{ email: string; password: string }> => {
        
        const email = fd.get('email') as string;
        const password = fd.get('password') as string;
        // console.log(email, password);
        
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            console.log(response.data);
            if (response.status === 200) {
                console.log(response.data.message, response.data.userId);
                // router.push(`/auth/complete/${response.data.userId}`);
            }
        } catch (error) {
            // if (axios.isAxiosError(error)) {
            //     console.log(error.response);
            // } else {
            //     console.log(error);
            // }
        }

        return { email, password };
    };

    const [state, formAction, isPending] = useActionState(submitFormData, { email, password });

    return (
        <div className="w-sm flex flex-col gap-8 items-center mx-auto justify-center h-screen">
            <h1 className="text-2xl font-bold">Login</h1>
            <form className="w-full flex flex-col gap-2 items-center justify-center" action={formAction}>
                <Input type="text" placeholder="ID" sizes="large" name="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder="Password" sizes="large" name="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button variant="primary" sizes="large" type="submit" className="w-full">Login</Button>
                {isPending ? <p>Loading...</p> : <p>{state?.email}</p>}
            </form>
        </div>
    );
};

export default LoginForm;