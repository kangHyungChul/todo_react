import { NextRequest, NextResponse } from 'next/server';
// import { FlightArrivalType } from '@/features/flight/types/flights';

const GET = async (request: NextRequest) => {
    try {

        // searchParams를 사용한 방식
        const { searchParams } = new URL(request.url);
        const icao24 = searchParams.get('icao24');
        if (!icao24) {
            return NextResponse.json({ error: 'icao24 parameter is required' }, { status: 400 });
        }
        const res = await fetch(`${process.env.FLIGHT_TRACK_API_URL}?icao24=${encodeURIComponent(icao24)}`, {
            method: 'GET'
        });

        // // search가 비어있는 경우 체크
        // if (!request.nextUrl.search) {
        //     return NextResponse.json({ error: 'icao24 parameter is required' }, { status: 400 });
        // }

        // // request.nextUrl.search -> ?포함해서 반환하니 주의
        // const res = await fetch(`${process.env.FLIGHT_TRACK_API_URL}${request.nextUrl.search}`, {
        //     method: 'GET'
        // });

        if (!res.ok) {
            throw new Error(`Failed to fetch flight information: ${res.status} ${res.statusText}`);
        }

        // API 응답 데이터를 콘솔에 출력하여 확인하는 코드 추가
        const text = await res.text();
        console.log('API Response Text:', text);

        try {
            const json = JSON.parse(text);
            return NextResponse.json(json);
        } catch (error) {
            console.error('error:', error);
            return NextResponse.json({ error: '응답 파싱 실패', raw: text }, { status: 500 });
        }

    } catch (error) {
        console.error('Error fetching flights:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
};

export { GET };