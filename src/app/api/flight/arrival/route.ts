import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
// import { FlightArrivalType } from '@/features/flight/types/flights';

const GET = async (request: NextRequest) => {
    try {

        const url = process.env.FLIGHT_ARRIVAL_API_URL;
        const apiKey = process.env.FLIGHT_API_KEY;

        // 환경변수 체크
        if (!apiKey || !url) {
            return NextResponse.json({ error: 'Missing required environment variables' }, { status: 500 });
        }

        const res = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                // request.nextUrl.searchParams는 URLSearchParams 객체로, axios의 params에 바로 넣으면 자동으로 쿼리스트링으로 변환됨
                // ...Object.fromEntries(request.nextUrl.searchParams.entries())는 searchParams를 일반 객체로 변환해서 params에 넣는 방식임
                // 둘 다 axios에서 params로 사용 가능하지만, 일반적으로 URLSearchParams 객체를 직접 넣는 것보다 객체로 변환해서 넣는 것이 더 명확하고, axios가 내부적으로 처리하기 쉬움
                // 따라서 ...Object.fromEntries(request.nextUrl.searchParams.entries()) 방식을 사용하는 것이 더 안전함
                ...Object.fromEntries(request.nextUrl.searchParams.entries()),
                // ...request.nextUrl.searchParams,
                // 추가 파라미터
                // api키는 숨기고 나머지는 고정값
                passengerOrCargo: request.nextUrl.searchParams.get('passengerOrCargo') || 'P',
                airportCode: request.nextUrl.searchParams.get('airportCode') || '',
                serviceKey: apiKey,
                type: 'json',
            },
        });
        
        if (res.status !== 200) {
            throw new Error(`Failed to fetch flight information: ${res.status} ${res.statusText}`);
        }
        
        const dateInfo = {
            searchDate: request.nextUrl.searchParams.get('searchDate'),
            searchFrom: request.nextUrl.searchParams.get('searchFrom'),
            searchTo: request.nextUrl.searchParams.get('searchTo'),
            flightId: request.nextUrl.searchParams.get('flightId'),
        };

        const resData = {
            ...dateInfo,
            ...res.data.response.body,
        };

        console.log('route API - Arrival response Data:', resData);

        return NextResponse.json(resData);
        

        // const searchParams = new URLSearchParams(request.nextUrl.searchParams);

        // const url = process.env.FLIGHT_ARRIVAL_API_URL;
        // const apiKey = process.env.FLIGHT_API_KEY;

        // // 환경변수 체크
        // if (!apiKey || !url) {
        //     return NextResponse.json({ error: 'Missing required environment variables' }, { status: 500 });
        // }

        // const body = new URLSearchParams({
        //     serviceKey: apiKey,
        //     pageNo: searchParams.get('pageNo') || '1',
        //     numOfRows: searchParams.get('numOfRows') || '100',
        //     searchdtCode: searchParams.get('searchdtCode') || 'E',
        //     searchDate: searchParams.get('searchDate') || '20250616',
        //     searchFrom: searchParams.get('searchFrom') || '0000',
        //     searchTo: searchParams.get('searchTo') || '2400',
        //     flightId: searchParams.get('flightId') || '',
        //     passengerOrCargo: searchParams.get('passengerOrCargo') || 'P',
        //     airportCode: searchParams.get('airportCode') || '',
        //     type: 'json',
        // });

        // const res = await fetch(`${url}?${body.toString()}`, {
        //     method: 'GET',
        // });

        // if (!res.ok) {
        //     throw new Error(`Failed to fetch flight information: ${res.status} ${res.statusText}`);
        // }

        // // API 응답 데이터를 콘솔에 출력하여 확인하는 코드 추가
        // const text = await res.text();
        // // console.log('API Response Text:', text);

        // try {
        //     const json = JSON.parse(text);
        //     //json.response.body에 조회날자정보 추가
        //     const dateInfo = {
        //         searchDate: searchParams.get('searchDate'),
        //         searchFrom: searchParams.get('searchFrom'),
        //         searchTo: searchParams.get('searchTo'),
        //     };
        //     return NextResponse.json({ 
        //         ...dateInfo,
        //         ...json.response.body,
        //     });
        // } catch (error) {
        //     console.error('error:', error);
        //     return NextResponse.json({ error: '응답 파싱 실패', raw: text }, { status: 500 });
        // }

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error:', error.response?.data);
            return NextResponse.json({ error: error.message }, { status: error.response?.status || 500 });
        }
        console.log('error:', error);
        return NextResponse.json({ error: 'Internal Server Error', message: `서버 오류가 발생했습니다.: ${error}` }, { status: 500 });
    }
};

// const POST = async (request: NextRequest) => {
//     try {

//         const requestBody: FlightArrivalType = await request.json();

//         const url = process.env.FLIGHT_ARRIVAL_API_URL;
//         const apiKey = process.env.FLIGHT_API_KEY;

//         // 환경변수 체크
//         if (!apiKey || !url) {
//             return NextResponse.json({ error: 'Missing required environment variables' }, { status: 500 });
//         }

//         const body = new URLSearchParams({
//             serviceKey: apiKey,
//             pageNo: requestBody.pageNo || '1',
//             numOfRows: requestBody.numOfRows || '100',
//             searchdtCode: requestBody.searchdtCode || 'E',
//             searchDate: requestBody.searchDate || '20250616',
//             searchFrom: requestBody.searchFrom || '0000',
//             searchTo: requestBody.searchTo || '2400',
//             flightId: requestBody.flightId || '',
//             passengerOrCargo: requestBody.passengerOrCargo || 'P',
//             airportCode: requestBody.airportCode || '',
//             type: 'json',
//         });

//         const res = await fetch(`${url}?${body.toString()}`, {
//             method: 'GET',
//         });

//         if (!res.ok) {
//             throw new Error(`Failed to fetch flight information: ${res.status} ${res.statusText}`);
//         }

//         // API 응답 데이터를 콘솔에 출력하여 확인하는 코드 추가
//         const text = await res.text();
//         // console.log('API Response Text:', text);

//         try {
//             const json = JSON.parse(text);
//             //json.response.body에 조회날자정보 추가
//             const dateInfo = {
//                 searchDate: requestBody.searchDate,
//                 searchFrom: requestBody.searchFrom,
//                 searchTo: requestBody.searchTo,
//             };
//             return NextResponse.json({ 
//                 ...dateInfo,
//                 ...json.response.body,
//             });
//         } catch (error) {
//             console.error('error:', error);
//             return NextResponse.json({ error: '응답 파싱 실패', raw: text }, { status: 500 });
//         }

//     } catch (error) {
//         console.error('Error fetching flights:', error);
//         return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//     }
// };

export { GET };