// card기능 타입정의

export interface CardType {
    id: string; // 고유 식별자 (랜덤 또는 순차적)
    title: string; // 카드 제목
    content: string; // 카드 본문
    color: string; // 배경 색상 (색상 변경 기능용)
}