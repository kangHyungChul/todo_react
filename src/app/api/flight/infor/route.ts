import { NextRequest, NextResponse } from 'next/server';
import { safeFlightFetch } from '@/lib/api/serverHttpClient';
import type { AppError } from '@/lib/api/error';
import { toAppError, Logger } from '@/lib/api/error';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import { ERROR_CODES } from '@/constants/errorCodes';
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

        // safeFlightFetch 사용 - 자동으로 에러 처리 및 JSON 파싱
        const json = await safeFlightFetch<{ response: { body: Record<string, unknown> } }>(
            `${url}?${body.toString()}`,
            {
                method: 'GET',
                metadata: {
                    category: 'INFOR',
                    code: ERROR_CODES.FLIGHT.INFOR_SEARCH_ERROR,
                    message: ERROR_MESSAGES[ERROR_CODES.FLIGHT.INFOR_SEARCH_ERROR]
                }
            }
        );

        return NextResponse.json(json);

    } catch (error) {
        // AppError 처리
        if (error && typeof error === 'object' && 'domain' in error && 'code' in error) {
            const appError = error as AppError;
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