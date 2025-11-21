import { NextRequest, NextResponse } from 'next/server';
import { safeFlightFetch } from '@/lib/api/serverHttpClient';
import type { AppError } from '@/lib/api/error';
import { toAppError, Logger } from '@/lib/api/error';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import { ERROR_CODES } from '@/constants/errorCodes';
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
            safeFlightFetch<Array<{ hexIcao: string }>>(`https://prod.api.market/api/v1/aedbx/aerodatabox/aircrafts/Reg/${flightReg}/registrations1`, {
                method: 'GET',
                metadata: {
                    category: 'AERODATABOX',
                    severity: 'CRITICAL',
                    code: 'AERODATABOX_DEFAULT_ERROR',
                    message: ERROR_MESSAGES[ERROR_CODES.FLIGHT.AERODATABOX_DEFAULT_ERROR]
                },
                headers: {
                    'x-api-market-key': `${process.env.FLIGHT_X_MARKET_KEY}`,
                }
            }),
            safeFlightFetch<{ access_token: string }>('https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token', {
                method: 'POST',
                metadata: {
                    category: 'OPENSKY',
                    severity: 'CRITICAL',
                    code: 'OPENSKY_DEFAULT_ERROR',
                    message: ERROR_MESSAGES[ERROR_CODES.FLIGHT.OPENSKY_DEFAULT_ERROR]
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
        
        const icao24 = icao24Response[0].hexIcao.toLowerCase();
        const accessToken = tokenResponse.access_token;

        // console.log('icao24:', icao24);
        // console.log('accessToken:', accessToken);

        const res = await safeFlightFetch<{ response: { body: Record<string, unknown> } }>(`${process.env.FLIGHT_TRACK_API_URL}?icao24=${icao24}&time=0`, {
            method: 'GET',
            metadata: {
                category: 'TRACKER',
                severity: 'CRITICAL',
                code: 'TRACKING_ERROR',
                message: ERROR_MESSAGES[ERROR_CODES.FLIGHT.TRACKING_ERROR]
            },
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        });
        // API 응답 데이터를 콘솔에 출력하여 확인하는 코드 추가
        console.log('API Response Text:', `${process.env.FLIGHT_TRACK_API_URL}?icao24=${icao24}&time=0`, res);

        return NextResponse.json(res);

    } catch (error) {
        // AppError 처리
        if (error && typeof error === 'object' && 'domain' in error && 'code' in error) {
            const appError = error as AppError;
            console.log('🚀 [GET] appError:', appError);
            return NextResponse.json(
                { error: appError.message },
                { status: appError.statusCode || 500 }
            );
        }
        
        // 예상치 못한 에러 → SYSTEM 도메인으로 자동 변환
        const systemError = toAppError(error);
        await Logger.error(systemError);
        return NextResponse.json(
            { error: systemError.message },
            { status: systemError.statusCode }
        );
    }
};

export { GET };