// card기능 타입정의

export interface FlightType {
    pageNo?: string;
    numOfRows?: string;
    searchdtCode?: string; // 스케줄조회기준 (S: 예정시간, E: 변경시간, default=E)
    searchDate?: string; // 조회일자
    searchFrom?: string; // 스케줄 ~~부터
    searchTo?: string; //  스케줄 ~~까지
    flightId?: string | undefined; // 항공편명
    passengerOrCargo?: string; // 여객화물구분 (P: 여객, C: 화물, default=P)
    airportCode?: string | undefined; // 도착하는 비행기 출발지 공항코드
}