import type { Metadata } from 'next';
import FlightDetailSection from '@/features/flight/FlightDetailSection';
// import { funcNowDate, funcNowTime, funcNowTimeAdd, funcDateTimeToType, funcTimeToHHMMReverse } from '@/lib/utils/dateTime';
// import FlightSection from '@/features/flight/FlightSection';
// import { FlightDepartureSearchParamsType } from '@/features/flight/types/flights';

export const metadata: Metadata = {
    title: 'Flight Departure',
    description: 'Flight Departure',
};

const FlightDetail = async({ params } : { params: Promise<{ id: string }> }) => {

    const { id } = await params;

    return (
        <>
            <FlightDetailSection flightId={id} />
        </>
    );
};

export default FlightDetail;