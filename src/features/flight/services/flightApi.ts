import { FlightArrivalType } from '../types/flights';

const fetchArrivalFlights = async (responseBody: FlightArrivalType) => {

    try {

        const res = await fetch(`http://localhost:3000/api/flight`, {
            method: 'POST',
            body: JSON.stringify(responseBody),
        });

        console.log(res);

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

export { fetchArrivalFlights };