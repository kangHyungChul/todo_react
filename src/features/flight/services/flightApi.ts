import { FlightArrivalType } from '../types/flights';

const fetchArrivalFlights = async (responseBody: FlightArrivalType) => {

    try {

        const res = await fetch(`http://localhost:3000/api/flight/arrival`, {
            method: 'POST',
            body: JSON.stringify(responseBody),
            cache: 'no-store',
            next: { revalidate: 0 },
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

const fetchFlightTrack = async () => {
    try {
        const res = await fetch(`https://opensky-network.org/api/tracks/all?icao24=71c071`, {
            method: 'GET'
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