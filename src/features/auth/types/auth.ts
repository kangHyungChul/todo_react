// auth 타입정의

interface AuthFormData {
    email: string;
    password: string;
    passwordConfirm?: string;
    name: string;
    nickname: string;
    phone: string;
    birthday: string;
    profileImage: File | null;
}

export type { AuthFormData };
