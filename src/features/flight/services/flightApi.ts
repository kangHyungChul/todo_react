import { flightHttpClient } from '@/lib/api/httpClient';
// import type { AppError } from '@/lib/types/error';
import { FlightArrivalType, FlightDepartureType, FlightType } from '../types/flights';
import { ERROR_CODES } from '@/constants/errorCodes';
import { ERROR_MESSAGES } from '@/constants/errorMessages';

export const fetchArrivalFlights = async (responseBody: FlightArrivalType) => {

    // console.log('로그확인 - flightApi_1', process.env.NODE_ENV, process.env.VERCEL_URL, process.env.NEXT_PUBLIC_VERCEL_URL, process.env.BASE_URL);

    // console.log('로그확인 - flightApi_2', process.env.NODE_ENV, process.env.VERCEL_URL, process.env.NEXT_PUBLIC_VERCEL_URL, process.env.BASE_URL, path());

    const res = await flightHttpClient.get('/api/flight/arrival', {
        params: responseBody,
        metadata: {
            category: 'ARRIVAL',
            code: ERROR_CODES.FLIGHT.ARRIVAL_SEARCH_ERROR,
            message: ERROR_MESSAGES[ERROR_CODES.FLIGHT.ARRIVAL_SEARCH_ERROR],
        },
    });

    // axios 인터셉터가 2xx 범위 이외의 응답을 예외로 던지므로 여기서는 데이터만 반환
    return res.data;
};

export const fetchDepartureFlights = async (responseBody: FlightDepartureType) => {

    // console.log('로그확인 - flightApi_1', process.env.NODE_ENV, process.env.VERCEL_URL, process.env.NEXT_PUBLIC_VERCEL_URL, process.env.BASE_URL);

    // console.log('로그확인 - flightApi_2', process.env.NODE_ENV, process.env.VERCEL_URL, process.env.NEXT_PUBLIC_VERCEL_URL, process.env.BASE_URL, path());

    const res = await flightHttpClient.get('/api/flight/departure', {
        params: responseBody,
        metadata: {
            category: 'DEPARTURE',
            code: ERROR_CODES.FLIGHT.DEPARTURE_SEARCH_ERROR,
            message: ERROR_MESSAGES[ERROR_CODES.FLIGHT.DEPARTURE_SEARCH_ERROR],
        },
    });

    // console.log('res:', res);

    return res.data;

    // const params = new URLSearchParams(responseBody as Record<string, string>).toString();

    // const res = await fetch(`${path()}/api/flight/departure?${params}`, {
    //     method: 'GET',
    //     cache: 'no-store',
    // });

    // if (!res.ok) {
    //     throw new Error(`Failed to fetch flight information: ${res.status} ${res.statusText}`);
    // }

    // try {
    //     const data = await res.json();
    //     return data;
    // } catch (error) {
    //     const data = await res.text();
    //     console.error('JSON Parse Error:', error);
    //     throw new Error(`Failed to parse API response: ${data}`);
    // }
};

export const fetchFlightTrack = async ( flightReg: string, signal?: AbortSignal ) => {

    // console.log('🚀 [fetchFlightTrack] 요청 시작, flightReg:', flightReg, 'signal:', signal);

    const res = await flightHttpClient.get('/api/flight/tracker', {
        params: {
            flightReg: flightReg
        },
        metadata: {
            category: 'TRACKER',
            code: ERROR_CODES.FLIGHT.TRACKING_ERROR,
            message: ERROR_MESSAGES[ERROR_CODES.FLIGHT.TRACKING_ERROR],
        },
        signal: signal
    });
    
    return res.data;
    // try {
    //     // // flights 데이터를 query parameter로 전달
    //     // const queryParams = new URLSearchParams({
    //     //     flights: flights
    //     // }).toString();

    //     // console.log('🚀 fetchFlightTrack 요청 시작:', flightReg);

    //     const res = await flightHttpClient.get('/api/flight/tracker333', {
    //         params: {
    //             flightReg: flightReg
    //         },
    //         metadata: {
    //             category: 'TRACKER',
    //         },
    //         signal: signal
    //     });

    //     // console.log('✅ [fetchFlightTrack] 요청 성공, res:', res);

    //     return res.data;

    // } catch (error) {

    //     // console.log('❌ [fetchFlightTrack] 에러 발생, error:', error);


    //     const appError = error as AppError;
    //     if (appError.code === ERROR_CODES.NETWORK.REQUEST_CANCELLED) {
    //         console.warn('API warn: fetchFlightTrack is canceled: unmounted');
    //         return;
    //     }

    //     // console.error('🔴 [fetchFlightTrack] 에러 throw');

    //     throw error;
    // }
};

export const fetchFlightDetail = async (responseBody: string, type: FlightType) => {

    const res = await flightHttpClient.get('/api/flight/detail', {
        params: {
            fid: responseBody,
        },
        headers: {
            'x-flight-type': type,
        },
        metadata: {
            category: 'DETAIL',
            code: ERROR_CODES.FLIGHT.DETAIL_ERROR,
            message: ERROR_MESSAGES[ERROR_CODES.FLIGHT.DETAIL_ERROR],
        },
    });
    
    const data = res.data.items?.[0];
    
    return data;
    
    // const params = new URLSearchParams(responseBody as Record<string, string>).toString();

    // const res = await fetch(`${path()}/api/flight/arrival?${params}`, {
    //     method: 'GET',
    //     cache: 'no-store',
    // });

    // if (!res.ok) {
    //     throw new Error(`Failed to fetch flight information: ${res.status} ${res.statusText}`);
    // }

    // try {
    //     const data = await res.json();
    //     return data;
    // } catch (error) {
    //     const data = await res.text();
    //     console.error('JSON Parse Error:', error);
    //     throw new Error(`Failed to parse API response: ${data}`);
    // }
};

export const fetchFlightInfor = async (flightCode: string) => {

    const res = await flightHttpClient.get('/api/flight/infor', {
        params: {
            airline_iata: flightCode
        },
        metadata: {
            category: 'INFOR',
        },
    });

    return res.data.response.body;
};

export const flightWish = async (flightCode: string) => {};