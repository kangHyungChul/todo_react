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

// profiles 테이블에 맞는 타입 정의
interface Profile {
    id: string;                    // UUID (필수)
    email: string;                 // 이메일 (필수)
    name: string;                  // 이름 (필수)
    nickname: string;              // 닉네임 (필수)
    phone: string;                 // 전화번호 (필수)
    birthday?: string | null;      // 생일 (선택)
    profileImage?: string | null; // 프로필 이미지 URL (선택)
    created_at?: string;           // 생성일시 (자동 생성)
    updated_at?: string;           // 수정일시 (자동 생성)
}

// 프로필 생성 시 사용할 타입 (id 제외)
interface CreateProfileData {
    email: string;
    name: string;
    nickname: string;
    phone: string;
    birthday?: string | null;
    profileImage?: string | null;
}

export type { AuthFormData, Profile, CreateProfileData };
