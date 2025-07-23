import { NextRequest, NextResponse } from 'next/server';
// import { FlightArrivalType } from '@/features/flight/types/flights';

const GET = async (request: NextRequest) => {
    try {

        // searchParams를 사용한 방식
        // const { searchParams } = new URL(request.url);
        // const icao24 = searchParams.get('icao24');
        // if (!icao24) {
        //     return NextResponse.json({ error: 'icao24 parameter is required' }, { status: 400 });
        // }
        // const res = await fetch(`${process.env.FLIGHT_TRACK_API_URL}?icao24=${encodeURIComponent(icao24)}`, {
        //     method: 'GET'
        // });

        // search가 비어있는 경우 체크
        if (!request.nextUrl.search) {
            return NextResponse.json({ error: 'flightReg parameter is required' }, { status: 400 });
        }

        // 기체등록번호로로 icao24 조회
        const flightReg = request.nextUrl.search.split('=')[1];
        console.log('flightReg:', request.nextUrl.search, `https://aerodatabox.p.rapidapi.com/aircrafts/reg/${flightReg}/all`, `${process.env.FLIGHT_X_RAPIDAPI_KEY}`);

        const [icao24Response, tokenResponse] = await Promise.all([
            fetch(`https://aerodatabox.p.rapidapi.com/aircrafts/reg/${flightReg}/all`, {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': `${process.env.FLIGHT_X_RAPIDAPI_KEY}`,
                    'x-rapidapi-host': 'aerodatabox.p.rapidapi.com'
                }
            }),
            fetch('https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token', {
                method: 'POST',
                next: {
                    // 25분(1500초) 동안 revalidate 설정
                    // 토큰발급시간 30분, 캐시 25분 설정
                    revalidate: 60 * 25,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'grant_type': 'client_credentials',
                    'client_id': `${process.env.FLIGHT_TRACK_CLIENT_ID}`,
                    'client_secret': `${process.env.FLIGHT_TRACK_CLIENT_SECRET}`,
                }),
            }),
        ]);

        const [icao24Data, tokenData] = await Promise.all([
            icao24Response.json(),
            tokenResponse.json(),
        ]);

        if(!icao24Response.ok || !tokenResponse.ok) {
            return NextResponse.json({ error: 'Failed to fetch flight information' }, { status: 500 });
        }
        
        const icao24 = icao24Data[0].hexIcao.toLowerCase();
        const accessToken = tokenData.access_token;

        console.log('icao24:', icao24);
        console.log('accessToken:', accessToken);

        // const icao24Response = await fetch(`https://aerodatabox.p.rapidapi.com/aircrafts/reg/${flightReg}/all`, {
        //     method: 'GET',
        //     headers: {
        //         'x-rapidapi-key': `${process.env.FLIGHT_X_RAPIDAPI_KEY}`,
        //         'x-rapidapi-host': 'aerodatabox.p.rapidapi.com'
        //     }
        // });

        // const icao24Data = await icao24Response.json();
        // console.log('icao24Data:', icao24Data);
        // const icao24 = icao24Data[0].hexIcao.toLowerCase();


        // // 토큰발급 open sky
        // const tokenUrl = 'https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token';
        // const tokenResponse = await fetch(tokenUrl, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //     },
        //     body: new URLSearchParams({
        //         'grant_type': 'client_credentials',
        //         'client_id': `${process.env.FLIGHT_TRACK_CLIENT_ID}`,
        //         'client_secret': `${process.env.FLIGHT_TRACK_CLIENT_SECRET}`,
        //     }),
        // });

        // const tokenData = await tokenResponse.json();
        // const accessToken = tokenData.access_token;
        // console.log('accessToken:', accessToken);

        // request.nextUrl.search -> ?포함해서 반환하니 주의
        // const res = await fetch(`${process.env.FLIGHT_TRACK_API_URL}${request.nextUrl.search}`, {
        // const res = await fetch(`${process.env.FLIGHT_TRACK_API_URL}${request.nextUrl.search}`, {

        const res = await fetch(`${process.env.FLIGHT_TRACK_API_URL}?icao24=${icao24}`, {
            method: 'GET',
            next: {
                revalidate: 10,
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch flight information: ${res.status} ${res.statusText}`);
        }

        // API 응답 데이터를 콘솔에 출력하여 확인하는 코드 추가
        const text = await res.text();
        console.log('API Response Text:', `${process.env.FLIGHT_TRACK_API_URL}?icao24=${icao24}`,text);

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