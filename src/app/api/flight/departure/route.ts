import { NextRequest, NextResponse } from 'next/server';
import { FlightArrivalType } from '@/features/flight/types/flights';

const GET = async (request: NextRequest) => {
    
}

const POST = async (request: NextRequest) => {
    try {

        const requestBody: FlightArrivalType = await request.json();

        const url = process.env.FLIGHT_ARRIVAL_API_URL;
        const apiKey = process.env.FLIGHT_API_KEY;

        // 환경변수 체크
        if (!apiKey || !url) {
            return NextResponse.json({ error: 'Missing required environment variables' }, { status: 500 });
        }

        const body = new URLSearchParams({
            serviceKey: apiKey,
            pageNo: requestBody.pageNo || '1',
            numOfRows: requestBody.numOfRows || '100',
            searchdtCode: requestBody.searchdtCode || 'E',
            searchDate: requestBody.searchDate || '20250616',
            searchFrom: requestBody.searchFrom || '0000',
            searchTo: requestBody.searchTo || '2400',
            flightId: requestBody.flightId || '',
            passengerOrCargo: requestBody.passengerOrCargo || 'P',
            airportCode: requestBody.airportCode || '',
            type: 'json',
        });

        const res = await fetch(`${url}?${body.toString()}`, {
            method: 'GET',
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch flight information: ${res.status} ${res.statusText}`);
        }

        // API 응답 데이터를 콘솔에 출력하여 확인하는 코드 추가
        const text = await res.text();
        // console.log('API Response Text:', text);

        try {
            const json = JSON.parse(text);
            //json.response.body에 조회날자정보 추가
            const dateInfo = {
                searchDate: requestBody.searchDate,
                searchFrom: requestBody.searchFrom,
                searchTo: requestBody.searchTo,
            }
            return NextResponse.json({ 
                ...dateInfo,
                ...json.response.body,
            });
        } catch (parseErr) {
            return NextResponse.json({ error: '응답 파싱 실패', raw: text }, { status: 500 });
        }

    } catch (error) {
        console.error('Error fetching flights:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export { GET, POST };