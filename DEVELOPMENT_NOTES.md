# 개발 노트 및 참고사항

## 🔧 현재 개발 환경

- **Next.js**: 15.3.1
- **React**: 18.x
- **TypeScript**: 사용
- **Tailwind CSS**: v4
- **개발 서버**: Turbopack (호환성 문제 가능성)

## ⚠️ 알려진 이슈

### 1. Tailwind CSS v4 + Turbopack 호환성
- **문제**: CSS 클래스가 정상적으로 적용되지 않을 수 있음
- **해결책**: `package.json`에서 `"dev": "next dev --turbopack"` → `"dev": "next dev"`로 변경

### 2. 폰트 최적화
- **현재 상태**: `src/app/layout.tsx`에서 폰트 설정이 주석 처리됨
- **권장사항**: 성능 최적화를 위해 폰트 설정 활성화 고려

## 📁 폴더 구조 가이드

### App Router 구조
```
src/app/
├── layout.tsx          # 루트 레이아웃 (모든 페이지에 적용)
├── page.tsx            # 홈페이지 (/)
├── error.tsx           # 전역 에러 처리 (추천 생성)
├── loading.tsx         # 전역 로딩 상태 (선택적)
└── flight/             # 라우트 그룹
    ├── layout.tsx      # flight 전용 레이아웃 (선택적)
    ├── error.tsx       # flight 전용 에러 처리 (선택적)
    ├── arrival/
    │   └── page.tsx    # /flight/arrival
    └── departure/
        └── page.tsx    # /flight/departure
```

### Features 구조
```
src/features/
└── flight/
    ├── components/     # 클라이언트 컴포넌트
    ├── services/       # API 호출 로직
    ├── types/          # TypeScript 타입 정의
    ├── utils/          # 유틸리티 함수 (추천 생성)
    ├── hooks/          # 커스텀 훅 (선택적)
    └── FlightSection.tsx # 메인 컴포넌트
```

## 🎯 코드 품질 가이드

### 1. 컴포넌트 작성 원칙
- **서버 컴포넌트 우선**: 가능한 한 서버 컴포넌트 사용
- **클라이언트 컴포넌트**: 'use client' 지시어 필수
- **타입 안전성**: 모든 props에 타입 정의

### 2. 파일 명명 규칙
- **컴포넌트**: PascalCase (예: `FlightCard.tsx`)
- **유틸리티**: camelCase (예: `flightParams.ts`)
- **타입**: camelCase + Type (예: `flightTypes.ts`)

### 3. 주석 처리 규칙
- **기존 주석 유지**: 리팩토링 시 기존 주석 삭제 금지
- **새 주석 추가**: 코드 해석에 관한 세세한 주석 작성

## 🔄 리팩토링 체크리스트

### 파라미터 처리 로직 개선
- [ ] `src/features/flight/utils/` 폴더 생성
- [ ] `flightParams.ts` 파일 생성
- [ ] `flightMetadata.ts` 파일 생성
- [ ] arrival/departure 페이지 중복 코드 제거
- [ ] FlightSection 컴포넌트 타입 개선

### 에러 처리 개선
- [ ] `src/app/error.tsx` 생성
- [ ] 에러 로깅 설정
- [ ] 사용자 친화적 에러 메시지

### 성능 최적화
- [ ] 폰트 설정 활성화 검토
- [ ] 이미지 최적화
- [ ] 번들 크기 최적화

## 🧪 테스트 고려사항

### 단위 테스트
- 유틸리티 함수 테스트
- 컴포넌트 렌더링 테스트
- API 호출 모킹 테스트

### 통합 테스트
- 페이지 라우팅 테스트
- 사용자 인터랙션 테스트
- 에러 처리 테스트

## 📚 유용한 참고 자료

### Next.js 공식 문서
- [App Router](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)

### TypeScript 가이드
- [타입 정의](https://www.typescriptlang.org/docs/)
- [인터페이스 vs 타입](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)

### Tailwind CSS
- [v4 문서](https://tailwindcss.com/docs)
- [커스터마이징](https://tailwindcss.com/docs/configuration)

## 🚀 배포 고려사항

### 환경 변수
- API 키 관리
- 환경별 설정 분리

### 빌드 최적화
- 번들 분석
- 이미지 최적화
- 코드 스플리팅

### 모니터링
- 에러 추적
- 성능 모니터링
- 사용자 분석 