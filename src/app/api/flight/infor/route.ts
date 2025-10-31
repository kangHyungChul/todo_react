import { NextRequest, NextResponse } from 'next/server';
// import { FlightArrivalType } from '@/features/flight/types/flights';

const GET = async (request: NextRequest) => {
    try {

        const url = process.env.FLIGHT_AIRLINE_API_URL;
        const apiKey = process.env.FLIGHT_API_KEY;
        
        // 환경변수 체크
        if (!apiKey || !url) {
            return NextResponse.json({ error: 'Missing required environment variables' }, { status: 500 });
        }
        
        const searchParams = new URLSearchParams(request.nextUrl.searchParams);

        const body = new URLSearchParams({
            serviceKey: apiKey,
            airline_iata: searchParams.get('airline_iata') || '',
            type: 'json',
        });

        const res = await fetch(`${url}?${body.toString()}`, {
            method: 'GET',
            next: {
                revalidate: 60 * 60 * 48, // 48시간
            }
        });

        if (!res.ok) {
            throw new Error(`항공사 조회 실패: ${res.status} ${res.statusText}`);
        }

        // API 응답 데이터를 콘솔에 출력하여 확인하는 코드 추가
        const text = await res.text();
        // console.log('API Response Text:', text);


        try {
            const json = JSON.parse(text);
            return NextResponse.json(json);
        } catch (error) {
            console.error('error:', error);
            return NextResponse.json({ error: '응답 파싱 실패', raw: text }, { status: 500 });
        }

    } catch (error) {
        console.error('항공사 조회 서버 오류:', error);
        return NextResponse.json({ error: '항공사 조회 서버 오류 실패' }, { status: 500 });
    }
};

export { GET };