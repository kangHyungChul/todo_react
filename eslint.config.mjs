import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

// 현재 파일의 URL을 파일 시스템 경로로 변환
const __filename = fileURLToPath(import.meta.url);

// 현재 파일이 위치한 디렉토리 경로를 가져옴
const __dirname = dirname(__filename);

// FlatCompat 인스턴스를 생성하고 기본 디렉토리를 현재 디렉토리로 설정
const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const defaultRules = {
    quotes: ['warn', 'single'], // 따옴표 사용 권장
    indent: ['warn', 4], // 들여쓰기(4칸) 권장
};

// ESLint 설정
const eslintConfig = [
  // Next.js의 기본 ESLint, TypeScript 규칙 확장
    ...compat.extends('next/core-web-vitals', 'next/typescript'),

    // ts, tsx, js, jsx 규칙
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'], // 파일 확장자 지정
        rules: {
            ...defaultRules,
            semi: ['warn', 'always'], // 세미콜론 사용 권장
        },
    },
];

export default eslintConfig;
