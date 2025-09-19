import type { Metadata } from 'next';
// import { useRouter } from 'next/navigation';
import { fetchFlightDetail } from '@/features/flight/services/flightApi';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getServerQueryClient from '@/lib/server-query-client';
// import { funcNowDate, funcNowTime, funcNowTimeAdd, funcDateTimeToType, funcTimeToHHMMReverse } from '@/lib/utils/dateTime';
// import FlightSection from '@/features/flight/FlightSection';
import { FlightDepartureItemType, FlightArrivalItemType } from '@/features/flight/types/flights';
import FlightInfor from './components/detail/FlightInfor';

export const metadata: Metadata = {
    title: 'Flight Departure',
    description: 'Flight Departure',
};

const FlightDetailSection = async({ flightId } : { flightId: string }) => {

    // const router = useRouter();
    const queryClient = getServerQueryClient();
    const fid = flightId;

    await queryClient.prefetchQuery({
        queryKey: ['flightDetail', fid], // queryParams 값이 바뀌면 쿼리키가 달라져서 새로운 데이터를 요청함
        queryFn: () => {
            // type이 'arrival'이면 도착편 API, 아니면 출발편 API를 호출
            return fetchFlightDetail(fid);
        },
        staleTime: 1000 * 30, // 30초
        gcTime: 1000 * 60, // 1분
    });

    const flightDetailData = queryClient.getQueryData<FlightDepartureItemType | FlightArrivalItemType>(['flightDetail', fid]);

    const type = flightDetailData && 'chkinRange' in flightDetailData ? 'departure' : 'arrival';

    return (
        <>
            {
                !flightDetailData || !type ? (
                    <div>데이터가 없습니다.</div>
                ) : (
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <FlightInfor flightData={flightDetailData} />
                    </HydrationBoundary>
                )
            }
        </>
    );
};

export default FlightDetailSection;