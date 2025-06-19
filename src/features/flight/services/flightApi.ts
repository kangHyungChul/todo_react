import { FlightArrivalType } from '../types/flights';

const fetchFlights = async (type: string, responseBody: FlightArrivalType) => {

    const url = (type === 'arrival') ? `${process.env.FLIGHT_ARRIVAL_API_URL}` : `${process.env.FLIGHT_DEPARTURE_API_URL}`;

    const body = new URLSearchParams({
        serviceKey: `${process.env.FLIGHT_API_KEY}`,
        pageNo: responseBody.pageNo || '1',
        numOfRows: responseBody.numOfRows || '100',
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

        console.log(`Requesting URL: ${url}?${body.toString()}`);

        const res = await fetch(`${url}?${body.toString()}`, {
            method: 'GET',
            // body: body.toString(),
            // headers: {
            //     'Content-Type': 'application/x-www-form-urlencoded',
            // },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch flight information: ${res.status} ${res.statusText}`);
        }

        try {
            const data = await res.json();
            // console.log('API Response:', data);
            return data.response.body;
        } catch (error) {
            const data = await res.text();
            console.error('JSON Parse Error:', error);
            throw new Error(`Failed to parse API response: ${data}`);
        }


    } catch (error) {
        console.error('Error fetching flights:', error);
        throw error;
    }
};

export { fetchFlights };