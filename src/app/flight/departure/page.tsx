// import type { Metadata } from 'next';
import { funcNowDate, funcNowTime, funcNowTimeAdd, funcDateTimeToType, funcTimeToHHMMReverse } from '@/lib/utils/dateTime';
import FlightSection from '@/features/flight/FlightSection';
import { FlightDepartureSearchParamsType } from '@/features/flight/types/flights';

const setSearchParams = (parsedParams: FlightDepartureSearchParamsType) => {
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

export async function generateMetadata({ searchParams }: { searchParams: Promise<FlightDepartureSearchParamsType> }) {
    try {
        const parsedParams = await searchParams;
        const { searchDate, searchFrom, searchTo, flightId } = setSearchParams(parsedParams);
        const title = `${flightId ? `${flightId} - ` : ''}항공기 출발정보 조회 : ${searchDate} ${searchFrom} ~ ${searchTo}`;
        return {
            title,
            description: title,
        };
    } catch (error) {
        console.error('generateMetadata error:', error);
        return {
            title: '항공기 출발정보 조회',
            description: '항공기 출발정보 조회',
        };
    }
    
}
const FlightDeparture = async({ searchParams } : { searchParams: Promise<FlightDepartureSearchParamsType> }) => {

    const parsedParams = await searchParams;
    // console.log('page searchParams:', parsedParams);

    // const setSearchTo = Number(funcNowTimeAdd(60)) >= 2400 ? '2359' : funcNowTimeAdd(60);
    // const searchDate = funcDateTimeToType(parsedParams.searchDate ?? funcNowDate(), 'YYYYMMDD');
    // const searchFrom = funcTimeToHHMMReverse(parsedParams.searchFrom ?? funcNowTime());
    // const searchTo = funcTimeToHHMMReverse(parsedParams.searchTo ?? setSearchTo);
    // const flightId = parsedParams.flightId ?? '';

    // metadata.title = `${flightId && `${flightId} - `}항공기 출발정보 조회 : ${searchDate} ${searchFrom} ~ ${searchTo}`;
    // metadata.description = `${flightId && `${flightId} - `}항공기 출발정보 조회 : ${searchDate} ${searchFrom} ~ ${searchTo}`;

    return (
        <>
            <FlightSection parsedParams={parsedParams} type="departure" />
        </>
    );
};

export default FlightDeparture;