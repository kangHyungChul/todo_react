import { NextRequest, NextResponse } from 'next/server';

const GET = async (request: NextRequest) => {
    
}

const POST = async (request: NextRequest) => {
    try {

        const { searchParams } = new URL(request.url);

        const pageNo = searchParams.get('pageNo');
        const numOfRows = searchParams.get('numOfRows');
        const searchdtCode = searchParams.get('searchdtCode');
        const searchDate = searchParams.get('searchDate');
        const searchFrom = searchParams.get('searchFrom');
        const searchTo = searchParams.get('searchTo');
        const flightId = searchParams.get('flightId');
        const passengerOrCargo = searchParams.get('passengerOrCargo');
        const airportCode = searchParams.get('airportCode');

        const url = process.env.FLIGHT_ARRIVAL_API_URL;
        const apiKey = process.env.FLIGHT_API_KEY;

        // 환경변수 체크
        if (!apiKey || !url) {
            return NextResponse.json({ error: 'Missing required environment variables' }, { status: 500 });
        }

        const body = new URLSearchParams({
            serviceKey: apiKey,
            pageNo: pageNo || '1',
            numOfRows: numOfRows || '100',
            searchdtCode: searchdtCode || 'E',
            searchDate: searchDate || '20250616',
            searchFrom: searchFrom || '0000',
            searchTo: searchTo || '2400',
            flightId: flightId || '',
            passengerOrCargo: passengerOrCargo || 'P',
            airportCode: airportCode || '',
            type: 'json',
        });

        const res = await fetch(`${url}?${body.toString()}`, {
            method: 'GET',
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch flight information: ${res.status} ${res.statusText}`);
        }

        const text = await res.text();

        try {
            const json = JSON.parse(text);
            return NextResponse.json(json.response.body);
        } catch (parseErr) {
            return NextResponse.json({ error: '응답 파싱 실패', raw: text }, { status: 500 });
        }

    } catch (error) {
        console.error('Error fetching flights:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export { GET, POST };