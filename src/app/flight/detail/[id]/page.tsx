import type { Metadata } from 'next';
import { fetchFlightDetail } from '@/features/flight/services/flightApi';
import { useQuery } from '@tanstack/react-query';
// import { funcNowDate, funcNowTime, funcNowTimeAdd, funcDateTimeToType, funcTimeToHHMMReverse } from '@/lib/utils/dateTime';
// import FlightSection from '@/features/flight/FlightSection';
// import { FlightDepartureSearchParamsType } from '@/features/flight/types/flights';

export const metadata: Metadata = {
    title: 'Flight Departure',
    description: 'Flight Departure',
};

const FlightDetail = ({ params } : { params: { id: string } }) => {

    const { id } = params;

    const { data: flightDetail } = useQuery({
        queryKey: ['flightDetail', id],
        queryFn: () => fetchFlightDetail(id),
    });

    return (
        <>
            { id }<br />
            { flightDetail?.flightId }
            {/* <FlightSection parsedParams={parsedParams} type="departure" /> */}
        </>
    );
};

export default FlightDetail;