// import type { Metadata } from 'next';
import { funcNowDate, funcNowTime, funcNowTimeAdd, funcDateTimeToType, funcTimeToHHMMReverse } from '@/lib/utils/dateTime';
import FlightSection from '@/features/flight/FlightSection';
import { FlightArrivalSearchParamsType } from '@/features/flight/types/flights';

// export const metadata: Metadata = {
//     title: 'Flight Arrival',
//     description: 'Flight Arrival',
// };

const setSearchParams = (parsedParams: FlightArrivalSearchParamsType) => {
    const setSearchTo = Number(funcNowTimeAdd(60)) >= 2400 ? '2359' : funcNowTimeAdd(60);
    const searchDate = funcDateTimeToType(parsedParams.searchDate ?? funcNowDate(), 'YYYYMMDD');
    const searchFrom = funcTimeToHHMMReverse(parsedParams.searchFrom ?? funcNowTime());
    const searchTo = funcTimeToHHMMReverse(parsedParams.searchTo ?? setSearchTo);
    const flightId = parsedParams.flightId ?? '';
    return {
        searchDate,
        searchFrom,
        searchTo,
        flightId,
    };
};

export async function generateMetadata({ searchParams }: { searchParams: Promise<FlightArrivalSearchParamsType> }) {
    const parsedParams = await searchParams;
    const { searchDate, searchFrom, searchTo, flightId } = setSearchParams(parsedParams);
    const title = `${flightId ? `${flightId} - ` : ''}항공기 도착정보 조회 : ${searchDate} ${searchFrom} ~ ${searchTo}`;
    return {
        title,
        description: title,
    };
}

const FlightArrival = async({ searchParams } : { searchParams: Promise<FlightArrivalSearchParamsType> }) => {

    const parsedParams = await searchParams;
    // console.log('page searchParams:', parsedParams);

    // const setSearchTo = Number(funcNowTimeAdd(60)) >= 2400 ? '2359' : funcNowTimeAdd(60);
    // const searchDate = funcDateTimeToType(parsedParams.searchDate ?? funcNowDate(), 'YYYYMMDD');
    // const searchFrom = funcTimeToHHMMReverse(parsedParams.searchFrom ?? funcNowTime());
    // const searchTo = funcTimeToHHMMReverse(parsedParams.searchTo ?? setSearchTo);
    // const flightId = parsedParams.flightId ?? '';

    // metadata.title = `${flightId && `${flightId} - `}항공기 도착정보 조회 : ${searchDate} ${searchFrom} ~ ${searchTo}`;
    // metadata.description = `${flightId && `${flightId} - `}항공기 도착정보 조회 : ${searchDate} ${searchFrom} ~ ${searchTo}`;

    return (
        <>
            <FlightSection parsedParams={parsedParams} type="arrival" />
        </>
    );
};

export default FlightArrival;