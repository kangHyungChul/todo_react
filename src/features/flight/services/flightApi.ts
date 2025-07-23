import { FlightArrivalType } from '../types/flights';

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

        // const path = () => {
        //     if(process.env.NEXT_PUBLIC_VERCEL_URL === undefined) {
        //         return `${process.env.NEXT_PUBLIC_BASE_URL}/api/flight/arrival`;
        //     } else {
        //         return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/flight/arrival`;
        //     }
        // };

        // console.log('path:', path());
        // const path = process.env.NODE_ENV === 'development' ? `${process.env.BASE_URL}/api/flight/arrival` : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/flight/arrival`;

        // console.log('로그확인 - flightApi_2', process.env.NODE_ENV, process.env.VERCEL_URL, process.env.NEXT_PUBLIC_VERCEL_URL, process.env.BASE_URL, path());

        const res = await fetch(`${path()}/api/flight/arrival`, {
            method: 'POST',
            body: JSON.stringify(responseBody),
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch flight information: ${res.status} ${res.statusText}`);
        }

        try {
            const data = await res.json();
            return data;
        } catch (error) {
            const data = await res.text();
            console.error('JSON Parse Error:', error);
            throw new Error(`Failed to parse API response: ${data}`);
        }

    } catch (error) {
        console.error('Error fetching flights:', error);
        throw error;
    }
};

const fetchFlightTrack = async ( flightReg: string ) => {
    
    try {
        // // flights 데이터를 query parameter로 전달
        // const queryParams = new URLSearchParams({
        //     flights: flights
        // }).toString();

        console.log('flightReg:', `${path()}/api/flight/tracker?flightReg=${flightReg}`);

        const res = await fetch(`${path()}/api/flight/tracker?flightReg=${flightReg}`, {
            method: 'GET',
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch flight track: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.error('Error fetching flight track:', error);
        throw error;
    }
};


export { fetchArrivalFlights, fetchFlightTrack };