// card기능 타입정의

// 도착조회 보내기 타입입
export interface FlightArrivalType {
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

// 도착조회 받기 타입
export interface FlightArrivalItemType {
    aircraftRegNo: string; // 항공기 등록번호
    aircraftSubtype: string; // 서브타입 (IATA)
    airline: string; // 항공사
    airport: string; // 공항
    airportCode: string; // 공항코드
    carousel: string; // 수하물수취대번호
    codeshare: string; // 코드쉐어
    estimatedDatetime: string; // 출발발변경시간
    exitNumber: string; // 출구번호
    fid: string; // 항공편번호
    flightId: string; // 항공편번호
    fstandPosition: string; // 주기장위치치
    gateNumber: string; // 게이트번호
    masterFlightId: string; // 마스터항공편번호
    passengerOrCargo: string; // 여객화물구분 (P: 여객, C: 화물, default=P)
    remark: string; // 현황(도착, 결항, 지연, 회항, 착륙)
    scheduleDatetime: string; // 예정일시
    terminalId: string; // 터미널ID (P01 = 1터미널, P02 = 탑승동, P03 = 2터미널, C01:화물터미널 남측, C02:화물터미널 북측, C03:화물터미널(3단계))
    tmp1: string; // 임시1
    tmp2: string; // 임시2
    typeOfFlight: string; // 운항타입(I = 국제, D = 국내)
}
export interface FlightArrivalResponseType {
    items: FlightArrivalItemType[];
    numOfRows: number;
    pageNo: number;
    totalCount: number; 

}