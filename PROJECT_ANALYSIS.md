# Todo React 프로젝트 구조 분석 및 개선 방안

## 📁 현재 프로젝트 구조

```
todo_react/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   ├── page.tsx           # 홈페이지
│   │   └── flight/
│   │       ├── arrival/
│   │       │   └── page.tsx   # 도착 페이지
│   │       ├── departure/
│   │       │   └── page.tsx   # 출발 페이지
│   │       └── loading.tsx
│   ├── components/             # 공통 컴포넌트
│   │   ├── common/
│   │   └── layout/
│   ├── features/              # 기능별 모듈
│   │   ├── cards/
│   │   └── flight/
│   │       ├── components/
│   │       ├── services/
│   │       ├── types/
│   │       ├── utils/
│   │       └── FlightSection.tsx
│   ├── lib/                   # 유틸리티
│   │   └── utils/
│   └── styles/
```

## 🔍 현재 구조 분석

### 장점
- ✅ 명확한 관심사 분리 (features 폴더)
- ✅ TypeScript 사용으로 타입 안전성 확보
- ✅ 서버/클라이언트 컴포넌트 적절히 분리
- ✅ 재사용 가능한 컴포넌트 구조

### 개선 필요 사항
- ❌ 파라미터 처리 로직 중복 (arrival/departure 페이지)
- ❌ 비즈니스 로직이 UI 레이어에 혼재
- ❌ 전역 에러 처리 부재
- ❌ 동적 메타데이터 처리 미흡

## 🚀 권장 개선 방안

### 1. Flight Utils 생성

#### 파일 구조
```
src/features/flight/utils/
├── flightParams.ts      # 파라미터 처리 로직
├── flightMetadata.ts    # 메타데이터 생성 로직
└── flightTypes.ts       # 파라미터 타입 정의
```

#### flightParams.ts
```typescript
import { funcNowDate, funcNowTime, funcNowTimeAdd, funcDateTimeToType, funcTimeToHHMMReverse } from '@/lib/utils/dateTime';

export interface FlightSearchParams {
    searchDate?: string;
    searchFrom?: string;
    searchTo?: string;
    pageNo?: string;
    numOfRows?: string;
}

export interface ProcessedFlightParams {
    searchDate: string;
    searchFrom: string;
    searchTo: string;
    pageNo: string;
    numOfRows: string;
}

export const processFlightParams = (parsedParams: FlightSearchParams): ProcessedFlightParams => {
    const setSearchTo = Number(funcNowTimeAdd(60)) >= 2400 ? '2359' : funcNowTimeAdd(60);
    
    return {
        searchDate: funcDateTimeToType(parsedParams.searchDate ?? funcNowDate(), 'YYYYMMDD'),
        searchFrom: funcTimeToHHMMReverse(parsedParams.searchFrom ?? funcNowTime()),
        searchTo: funcTimeToHHMMReverse(parsedParams.searchTo ?? setSearchTo),
        pageNo: parsedParams.pageNo ?? '1',
        numOfRows: parsedParams.numOfRows ?? '20'
    };
};
```

#### flightMetadata.ts
```typescript
import type { Metadata } from 'next';
import { ProcessedFlightParams } from './flightParams';

export const generateFlightMetadata = (
    type: 'arrival' | 'departure',
    params: ProcessedFlightParams
): Metadata => {
    const title = type === 'arrival' ? '도착정보' : '출발정보';
    
    return {
        title: `항공기 ${title} 조회 : ${params.searchDate} ${params.searchFrom} ~ ${params.searchTo}`,
        description: `항공기 ${title} 조회 : ${params.searchDate} ${params.searchFrom} ~ ${params.searchTo}`,
    };
};
```

### 2. 개선된 Page 컴포넌트

#### arrival/page.tsx
```typescript
import { processFlightParams, generateFlightMetadata } from '@/features/flight/utils';
import FlightSection from '@/features/flight/FlightSection';

const FlightArrival = async({ searchParams }: { 
    searchParams: Promise<{ searchDate?: string, searchFrom?: string, searchTo?: string, pageNo?: string, numOfRows?: string }> 
}) => {
    const parsedParams = await searchParams;
    const processedParams = processFlightParams(parsedParams);
    
    // 동적 메타데이터 생성
    const metadata = generateFlightMetadata('arrival', processedParams);

    return (
        <>
            <FlightSection parsedParams={processedParams} type="arrival" />
        </>
    );
};

export default FlightArrival;
```

### 3. 전역 에러 처리 추가

#### src/app/error.tsx
```typescript
'use client';

import { useEffect } from 'react';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error('페이지 에러:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-2xl font-bold mb-4">문제가 발생했습니다</h2>
            <p className="text-gray-600 mb-4">
                {error.message || '예상치 못한 오류가 발생했습니다.'}
            </p>
            <button
                onClick={reset}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
            >
                다시 시도
            </button>
        </div>
    );
}
```

## 📋 구현 우선순위

### 1단계 (즉시 구현)
- [ ] `src/features/flight/utils/` 폴더 생성
- [ ] `flightParams.ts` 파일 생성
- [ ] `flightMetadata.ts` 파일 생성
- [ ] arrival/departure 페이지 리팩토링

### 2단계 (다음 구현)
- [ ] `src/app/error.tsx` 생성
- [ ] `src/app/flight/layout.tsx` 생성 (선택적)
- [ ] FlightSection 컴포넌트 타입 개선

### 3단계 (향후 고려)
- [ ] 폰트 최적화 (주석 처리된 폰트 설정 활성화)
- [ ] 로딩 상태 개선
- [ ] 테스트 코드 작성

## 🎯 기대 효과

- ✅ 코드 중복 제거 (약 50% 코드 감소)
- ✅ 유지보수성 향상
- ✅ 타입 안전성 강화
- ✅ 사용자 경험 개선 (에러 처리)
- ✅ SEO 최적화 (동적 메타데이터)

## 📝 참고 사항

- Next.js 15.3.1 + Turbopack 사용 시 Tailwind CSS v4 호환성 문제 가능성
- `package.json`의 dev 스크립트를 `"next dev"`로 변경 권장
- 모든 코드 수정 시 기존 주석 유지 필요 