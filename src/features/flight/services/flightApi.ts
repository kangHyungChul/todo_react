import axios from 'axios';
import { FlightArrivalType, FlightDepartureType } from '../types/flights';

const path = () => {
    if(process.env.NEXT_PUBLIC_VERCEL_URL === undefined) {
        return `${process.env.NEXT_PUBLIC_BASE_URL}`;
    } else {
        return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    }
};

const fetchArrivalFlights = async (responseBody: FlightArrivalType) => {

    // console.log('로그확인 - flightApi_1', process.env.NODE_ENV, process.env.VERCEL_URL, process.env.NEXT_PUBLIC_VERCEL_URL, process.env.BASE_URL);

    try {

        // console.log('로그확인 - flightApi_2', process.env.NODE_ENV, process.env.VERCEL_URL, process.env.NEXT_PUBLIC_VERCEL_URL, process.env.BASE_URL, path());
        
        const axiosInstance = axios.create({
            baseURL: path(),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        const res = await axiosInstance.get('/api/flight/arrival', {
            params: responseBody,
        });
        
        // 200 이 아니면 에러처리
        // catch는 2xx범위 아닐때만 애러로 블록 이외에는 try블록
        if (res.status !== 200) {
            throw new Error(`Failed to fetch flight information: ${res.status} ${res.statusText}`);
        }

        // console.log('res:', res);
        
        return res.data;
        
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

    } catch (error) {
        if(axios.isAxiosError(error)) {
            console.error('Error fetching flights:', error.response?.data);
            throw new Error(`Failed to fetch flight information: ${error.response?.status} ${error.response?.statusText}`);
        } else {
            console.error('Error fetching flights:', error);
            throw new Error(`Failed to fetch flight information: ${error}`);
        }
        // console.error('Error fetching flights:', error);
        // throw error;
    }
};

const fetchDepartureFlights = async (responseBody: FlightDepartureType) => {

    // console.log('로그확인 - flightApi_1', process.env.NODE_ENV, process.env.VERCEL_URL, process.env.NEXT_PUBLIC_VERCEL_URL, process.env.BASE_URL);

    try {

        // console.log('로그확인 - flightApi_2', process.env.NODE_ENV, process.env.VERCEL_URL, process.env.NEXT_PUBLIC_VERCEL_URL, process.env.BASE_URL, path());

        const axiosInstance = axios.create({
            baseURL: path(),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        const res = await axiosInstance.get('/api/flight/departure', {
            params: responseBody,
        });
        
        // 200 이 아니면 에러처리
        // catch는 2xx범위 아닐때만 애러로 블록 이외에는 try블록
        if (res.status !== 200) {
            throw new Error(`Failed to fetch flight information: ${res.status} ${res.statusText}`);
        }

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

    } catch (error) {
        if(axios.isAxiosError(error)) {
            console.error('Error fetching flights:', error.response?.data);
            throw new Error(`Failed to fetch flight information: ${error.response?.status} ${error.response?.statusText}`);
        } else {
            console.error('Error fetching flights:', error);
            throw new Error(`Failed to fetch flight information: ${error}`);
        }
        // console.error('Error fetching flights:', error);
        // throw error;
    }
};

const fetchFlightTrack = async ( flightReg: string, signal?: AbortSignal ) => {
    
    try {
        // // flights 데이터를 query parameter로 전달
        // const queryParams = new URLSearchParams({
        //     flights: flights
        // }).toString();

        // console.log('🚀 fetchFlightTrack 요청 시작:', flightReg);

        const axiosInstance = axios.create({
            baseURL: path(),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const res = await axiosInstance.get('/api/flight/tracker', {
            params: {
                flightReg: flightReg
            },
            signal: signal
        });

        if (res.status !== 200) {
            console.error('API Response Error fetching flight track:', res.status, res.statusText);
            throw new Error(`API Response Error fetching flight track: ${res.status} ${res.statusText}`);
        }

        return res.data;

    } catch (error) {

        if(axios.isAxiosError(error)) {
            if (error.code === 'ERR_CANCELED') {
                console.warn('API warn: fetchFlightTrack is canceled: unmounted');
                return;
            }
            console.error('API Error fetching flight track:', error.response?.data);
            throw new Error(`API Error fetching flight track: ${error.response?.status} ${error.response?.statusText}`);
        } else {
            console.error('Unknown Error fetching flight track:', error);
            throw new Error(`Unknown Error fetching flight track: ${error}`);
        }

        // console.error('Error fetching flight track:', error);
        // throw error;
    }
};


export { fetchArrivalFlights, fetchDepartureFlights, fetchFlightTrack };