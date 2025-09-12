import { NextRequest, NextResponse } from 'next/server';
// import { FlightArrivalType } from '@/features/flight/types/flights';

const GET = async (request: NextRequest) => {
    try {

        // flightReg 비어있는 경우 체크
        if (!request.nextUrl.search) {
            return NextResponse.json({ error: 'flightReg가 비어있습니다(전달되지않음)' }, { status: 400 });
        }

        // 기체등록번호로로 icao24 조회
        const flightReg = request.nextUrl.search.split('=')[1];
        // console.log('flightReg:', request.nextUrl.search, `https://aerodatabox.p.rapidapi.com/aircrafts/reg/${flightReg}/all`, `${process.env.FLIGHT_X_RAPIDAPI_KEY}`);

        const [icao24Response, tokenResponse] = await Promise.all([
            fetch(`https://prod.api.market/api/v1/aedbx/aerodatabox/aircrafts/Reg/${flightReg}/registrations`, {
                method: 'GET',
                headers: {
                    'x-api-market-key': `${process.env.FLIGHT_X_MARKET_KEY}`,
                }
            }),
            fetch('https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token', {
                method: 'POST',
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

        // console.log('icao24:', icao24Data);
        // console.log('tokenData:', tokenData);

        if(!icao24Response.ok || !tokenResponse.ok) {
            return NextResponse.json({ error: 'icao24 또는 token 조회 실패' }, { status: 500 });
        }
        
        const icao24 = icao24Data[0].hexIcao.toLowerCase();
        const accessToken = tokenData.access_token;

        // console.log('icao24:', icao24);
        // console.log('accessToken:', accessToken);

        const res = await fetch(`${process.env.FLIGHT_TRACK_API_URL}?icao24=${icao24}&time=0`, {
            method: 'GET',
            // next: {
            //     revalidate: 10,
            // },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
        });

        if (!res.ok) {
            throw new Error(`항공편 추적 조회 실패: ${res.status} ${res.statusText}`);
        }

        // API 응답 데이터를 콘솔에 출력하여 확인하는 코드 추가
        const text = await res.text();
        console.log('API Response Text:', `${process.env.FLIGHT_TRACK_API_URL}?icao24=${icao24}&time=0`, text);

        try {
            const json = JSON.parse(text);
            return NextResponse.json(json);
        } catch (error) {
            console.error('error:', error);
            return NextResponse.json({ error: '응답 파싱 실패', raw: text }, { status: 500 });
        }

    } catch (error) {
        console.error('항공편 추적 조회 서버 오류:', error);
        return NextResponse.json({ error: '항공편 추적 조회 서버 오류 실패' }, { status: 500 });
    }
};

export { GET };