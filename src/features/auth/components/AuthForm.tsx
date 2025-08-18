'use client';

import { useState, useActionState } from 'react';
// import { useFormStatus } from 'react-dom';
import { Input } from '@/components/ui/input';
import Button from '@/components/common/Button';
import { AuthFormData } from '../types/auth';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const AuthForm = () => {

    const router = useRouter();

    const [formData, setFormData] = useState<AuthFormData>({
        email: '',
        password: '',
        passwordConfirm: '',
        name: '',
        nickname: '',
        phone: '',
        birthday: '',
        profileImage: null,
    });

    // form제출
    const submitFormData = async(prevState: AuthFormData, fd: FormData) => { // prevState = 이전상태, fd = 실제 폼 데이터
        console.log('prevState', prevState, 'fd', fd);

        // 디버깅용: 실제 들어온 폼 쌍들
        console.log('entries:', [...fd.entries()]);

        // 파일은 필요 시 이렇게 꺼냅니다.
        const file = fd.get('profileImage');

        const nextState: AuthFormData = {
            email: String(fd.get('email') ?? ''),
            password: String(fd.get('password') ?? ''),
            name: String(fd.get('name') ?? ''),
            nickname: String(fd.get('nickname') ?? ''),
            phone: String(fd.get('phone') ?? ''),
            birthday: String(fd.get('birthday') ?? ''),
            // profileImage를 문자열로 유지한다면 서버에서 따로 처리
            // File로 다루려면 AuthFormData 타입을 변경하세요.
            profileImage: fd.get('profileImage') as File | null,
        };

        try {
            // axios를 통해 회원가입 요청을 보낸 후, 응답 status가 200(정상)일 경우 페이지 이동을 처리합니다.
            const response = await axios.post('/api/auth/signup', nextState);
            // console.log('response', response);

            if (response.status === 200) {
                console.log('response.data', response.data.userId);
                router.push(`/auth/complete/${response.data.userId}`);
            }

            // 응답 데이터를 반환 (기존 로직 유지)
            return response.data;
        } catch (error: any) {
            const message = error.response.data.message;
            alert(`${message}`);
        }
    };

    const [state, formAction, isPending] = useActionState(submitFormData, formData);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     formAction();
    // };

    return (
        <div className="w-sm flex flex-col gap-8 items-center mx-auto justify-center h-screen">
            <h1 className="text-2xl font-bold">Signup</h1>
            <form className="w-full flex flex-col gap-2 items-center justify-center" action={formAction}>
                <Input type="email" placeholder="Email" sizes="large" name="email" required value={formData.email} onChange={handleChange} disabled={isPending} />
                <Input type="password" placeholder="Password" sizes="large" name="password" required value={formData.password} onChange={handleChange} disabled={isPending} />
                <Input type="password" placeholder="Password Confirm" sizes="large" name="passwordConfirm" required value={formData.passwordConfirm} onChange={handleChange} disabled={isPending} />
                <Input type="text" placeholder="Name" sizes="large" name="name" required value={formData.name} onChange={handleChange} disabled={isPending} />
                <Input type="text" placeholder="Nickname" sizes="large" name="nickname" required value={formData.nickname} onChange={handleChange} disabled={isPending} />
                <Input type="tel" placeholder="Phone" sizes="large" name="phone" required value={formData.phone} onChange={handleChange} disabled={isPending} />
                <Input type="date" placeholder="Birthday" sizes="large" name="birthday" value={formData.birthday} onChange={handleChange} disabled={isPending} />
                <Input type="file" placeholder="Profile Image" sizes="large" name="profileImage" onChange={handleChange} disabled={isPending} />
                <Button variant="primary" sizes="large" type="submit" className="w-full">Signup</Button>
                {isPending ? <p>Loading...</p> : <p>{state?.email}</p>}
                {/* {state && <p>{state.email}</p>} */}
            </form>
        </div>
    );
};

export default AuthForm;