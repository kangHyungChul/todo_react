import type { Metadata } from 'next';
// import { useRouter } from 'next/navigation';
import { fetchFlightDetail } from '@/features/flight/services/flightApi';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getServerQueryClient from '@/lib/server-query-client';
// import { funcNowDate, funcNowTime, funcNowTimeAdd, funcDateTimeToType, funcTimeToHHMMReverse } from '@/lib/utils/dateTime';
// import FlightSection from '@/features/flight/FlightSection';
import { FlightDepartureItemType, FlightArrivalItemType, FlightType } from './types/flights';
import FlightInfor from './components/detail/FlightInfor';

export const metadata: Metadata = {
    title: 'Flight Departure',
    description: 'Flight Departure',
};

const FlightDetailSection = async({ flightId, type } : { flightId: string, type: FlightType }) => {

    console.log('type:', type);
    console.log('flightId:', flightId);

    // const router = useRouter();
    const queryClient = getServerQueryClient();

    // const flightDetailData = queryClient.getQueryData<FlightDepartureItemType | FlightArrivalItemType>(['flightDetail', flightId]);

    await queryClient.prefetchQuery({
        queryKey: ['flightDetail', flightId], // queryParams 값이 바뀌면 쿼리키가 달라져서 새로운 데이터를 요청함
        queryFn: () => {
            return fetchFlightDetail(flightId, type);
        },
        staleTime: 1000 * 30, // 30초
        gcTime: 1000 * 60, // 1분
    });

    return (
        <>

            <HydrationBoundary state={dehydrate(queryClient)}>
                <FlightInfor flightId={flightId} type={type} />
            </HydrationBoundary>
        </>
    );
};

export default FlightDetailSection;