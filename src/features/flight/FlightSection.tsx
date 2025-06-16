import { fetchFlights } from "./services/flightApi";
import { FlightType } from "./types/flights";

const FlightSection = async () => {

    const responseBody: FlightType = {
        searchdtCode: 'E',
        searchDate: '20250616',
        searchFrom: '0000',
        searchTo: '2400',
        flightId: '',
        passengerOrCargo: '',
        airportCode: '',
    };

    const res = await fetchFlights(responseBody);
    console.log(res);
    // console.log(res);

    // useEffect(() => {
    //     getFlights();
    // }, []);
    
    return (
        <div className="px-4 py-8 grid-cols-2">
            <a href="#" className="block mb-1 text-2xl font-bold text-center transition-color duration-[var(--duration-long)] text-primary/50 hover:text-primary-500 desktop:hover:text-secondary ring-4 ring-primary-500 ring-offset-1">항공편 목록</a>
            <a href="#" className="block mb-1 text-2xl font-bold text-center text-primary/50 hover:text-primary-500 desktop:hover:text-secondary ring-4 ring-primary-500 ring-offset-1">항공편 목록</a>
            <a href="#" className="block mb-1 text-2xl font-bold text-center text-primary/50 hover:text-primary-500 desktop:hover:text-secondary ring-4 ring-primary-500 ring-offset-1">항공편 목록</a>
            {/* <ul>
                {flights?.map((flight, index) => (
                    <li key={index}>{flight}</li>
                ))}
            </ul> */}
            <ul>
                <li className="text-2xl">1</li>
                <li>2</li>
            </ul>
        </div>
    );
};

export default FlightSection;
