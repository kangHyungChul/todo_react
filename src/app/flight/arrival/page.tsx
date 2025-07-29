import type { Metadata } from 'next';
import { funcNowDate, funcNowTime, funcNowTimeAdd, funcDateTimeToType, funcTimeToHHMMReverse } from '@/lib/utils/dateTime';
import FlightSection from '@/features/flight/FlightSection';
export const metadata: Metadata = {
    title: 'Flight Arrival',
    description: 'Flight Arrival',
};

const FlightArrival = async({ searchParams } : { searchParams: Promise<{ searchDate?: string, searchFrom?: string, searchTo?: string, pageNo?: string, numOfRows?: string }> }) => {

    const parsedParams = await searchParams;

    const setSearchTo = Number(funcNowTimeAdd(60)) >= 2400 ? '2359' : funcNowTimeAdd(60);
    const searchDate = funcDateTimeToType(parsedParams.searchDate ?? funcNowDate(), 'YYYYMMDD');
    const searchFrom = funcTimeToHHMMReverse(parsedParams.searchFrom ?? funcNowTime());
    const searchTo = funcTimeToHHMMReverse(parsedParams.searchTo ?? setSearchTo);

    metadata.title = `항공기 도착정보 조회 : ${searchDate} ${searchFrom} ~ ${searchTo}`;
    metadata.description = `항공기 도착정보 조회 : ${searchDate} ${searchFrom} ~ ${searchTo}`;

    return (
        <>
            <FlightSection parsedParams={parsedParams} />
        </>
    );
};

export default FlightArrival;