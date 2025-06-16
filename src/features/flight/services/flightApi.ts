import { FlightType } from '../types/flights';

const fetchFlights = async (responseBody: FlightType) => {

    // const url = `https://apis.data.go.kr/B551177/statusOfAllFltDeOdp/getFltArrivalsDeOdp?serviceKey=mgmocvfWzvWnvYVWMnE4RhRkM4iz3NbgedmhFfxBiSimGhi%2ByrWfvox%2FyvolU1NtfEaaWFytgEJFuy52aj7Frg%3D%3D&pageNo=1&numOfRows=10&searchdtCode=E&searchDate=20250616&searchFrom=0000&searchTo=2400&passengerOrCargo=P&airportCode=BKI&tmp1=-&tmp2=-&type=json`;
    const url = `${process.env.FLIGHT_API_URL}`;

    const body = new URLSearchParams({
        serviceKey: `${process.env.FLIGHT_API_KEY}`,
        pageNo: responseBody.pageNo || '1',
        numOfRows: responseBody.numOfRows || '10',
        searchdtCode: responseBody.searchdtCode || 'E', // 스케줄조회기준 (S: 예정시간, E: 변경시간, default=E)
        searchDate: responseBody.searchDate || '20250616', // 조회일자
        searchFrom: responseBody.searchFrom || '0000', // 스케줄 ~~부터
        searchTo: responseBody.searchTo || '2400', //  스케줄 ~~까지
        // flightId: responseBody.flightId || undefined, // 항공편명
        passengerOrCargo: responseBody.passengerOrCargo || 'P', // 여객화물구분 (P: 여객, C: 화물, default=P)
        // airportCode: responseBody.airportCode || undefined, // 도착하는 비행기 출발지 공항코드
        tmp1: '-',
        tmp2: '-',
        type: 'json',
    });

    try {

        const res = await fetch(`${url}?${body.toString()}`, {
            method: 'GET',
            // body: body.toString(),
            // headers: {
            //     'Content-Type': 'application/x-www-form-urlencoded',
            // },
        });

        if (!res.ok) {
            throw new Error('Failed to fetch arrival information');
        }

        const data = await res.json();

        return data.response.body;

        // const data = await res.json();
        // console.log(data.response.body);

        // const json = await res.json();
        // return data; // 실제 데이터 위치

    } catch (error) {
        console.error('Error fetching flights:', error);
        throw error;
    }
    // const data = await res.json();
    // console.log(process.env.NEXT_PUBLIC_FLIGHT_API_KEY);
    // console.log(res);
    // return res;
};

export { fetchFlights };