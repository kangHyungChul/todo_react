import { NextRequest, NextResponse } from 'next/server';
// import { FlightArrivalType } from '@/features/flight/types/flights';

const GET = async (request: NextRequest) => {
    try {

        const url = process.env.FLIGHT_ARRIVAL_API_URL;
        const apiKey = process.env.FLIGHT_API_KEY;
        
        // 환경변수 체크
        if (!apiKey || !url) {
            return NextResponse.json({ error: 'Missing required environment variables' }, { status: 500 });
        }
        
        const searchParams = new URLSearchParams(request.nextUrl.searchParams);

        const body = new URLSearchParams({
            serviceKey: apiKey,
            fid: searchParams.get('fid') || '',
            // pageNo: searchParams.get('pageNo') || '1',
            // numOfRows: searchParams.get('numOfRows') || '100',
            // searchdtCode: searchParams.get('searchdtCode') || 'E',
            // searchDate: searchParams.get('searchDate') || '20250616',
            // searchFrom: searchParams.get('searchFrom') || '0000',
            // searchTo: searchParams.get('searchTo') || '2400',
            // flightId: searchParams.get('flightId') || '',
            // passengerOrCargo: searchParams.get('passengerOrCargo') || 'P',
            // airportCode: searchParams.get('airportCode') || '',
            type: 'json',
        });

        const res = await fetch(`${url}?${body.toString()}`, {
            method: 'GET',
            // next: {
            //     revalidate: 10,
            // }
        });

        if (!res.ok) {
            throw new Error(`항공편 상세 조회 실패: ${res.status} ${res.statusText}`);
        }

        // API 응답 데이터를 콘솔에 출력하여 확인하는 코드 추가
        const text = await res.text();
        // console.log('API Response Text:', text);

        try {
            const json = JSON.parse(text);
            //json.response.body에 조회날자정보 추가
            const dateInfo = {
                fid: searchParams.get('fid'),
                // searchDate: searchParams.get('searchDate'),
                // searchFrom: searchParams.get('searchFrom'),
                // searchTo: searchParams.get('searchTo'),
            };
            return NextResponse.json({ 
                ...dateInfo,
                ...json.response.body,
            });
        } catch (error) {
            console.error('error:', error);
            return NextResponse.json({ error: '응답 파싱 실패', raw: text }, { status: 500 });
        }

    } catch (error) {
        console.error('항공편 상세 서버 오류:', error);
        return NextResponse.json({ error: '항공편 상세 서버 오류 실패' }, { status: 500 });
    }
};

export { GET };