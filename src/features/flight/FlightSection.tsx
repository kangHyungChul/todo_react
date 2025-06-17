// 'use client';
import { fetchFlights } from './services/flightApi';
import { FlightArrivalType } from './types/flights';
import Button from '@/components/common/Button';
import FlightCard from './components/FlightCard'
// import { useSearchParams } from 'next/navigation';

const FlightSection = async () => {
    // const searchParams = useSearchParams();
    // const page = searchParams.get('page') || '1';

    const responseBody: FlightArrivalType = {
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
        <div className="max-w-[600px] mx-auto my-6">
            <ul className="flex flex-col gap-4">
                <FlightCard flight={res} />
            </ul>
            {/* <Button type="link" href="?page=2" style="primary" size="large" outline={true}>
                <span>더보기</span>
            </Button> */}
        </div>
    );
};

export default FlightSection;
