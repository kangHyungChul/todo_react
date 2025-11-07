'use client';

import { useQuery } from '@tanstack/react-query';
import { 
    // import { fetchArrivalFlights } from '../services/flightApi';
    FlightArrivalItemType, FlightArrivalSearchParamsType, 
    FlightDepartureItemType, FlightDepartureSearchParamsType, 
    FlightType
} from '../types/flights';
import { useMemo, memo, useCallback, useEffect, useTransition } from 'react';
import { funcTimeToHHMMReverse, funcDateTimeToType } from '@/lib/utils/dateTime';
// import FlightCard from './FlightCard';
import { useSearchParams } from 'next/navigation';
// import { useFlightArrival, useFlightArrivalSearch } from '../hook/useFlightArrival';
// import { useFlightState } from '../hook/useFlightArrival';
import FlightRefresh from './FlightRefresh';
import FlightReset from './FlightReset';
import { fetchArrivalFlights, fetchDepartureFlights } from '../services/flightApi';
import { parseSearchParams, parseSearchParamsToObject } from '@/lib/utils/utils';

import FlightCardLayout from './FlightCardLayout';
import FlightArrivalCard from './arrival/FlightCard';
import FlightDepartureCard from './departure/FlightCard';
import FlightSearchForm from './FlightSearchForm';
import FlightTab from './FlightTab';

// 클라이언트 컴포넌트 - 상태 관리와 이벤트 핸들링 담당
const FlightCardList = ({ queryParams, type }: { queryParams: FlightArrivalSearchParamsType | FlightDepartureSearchParamsType, type: FlightType }) => {

    // console.log('queryParams:', queryParams);
    
    // const flightId = resFlightData.flightId ? resFlightData.flightId : '';    
    // const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const searchParams = useSearchParams();
    // const queryClient = useQueryClient();
    const currentParams = useMemo(() => {
        const params = searchParams;
        return params.size > 0 ? parseSearchParamsToObject(searchParams.toString()) : queryParams; // 초기 로드 시 URL에 파라미터가 없으면 서버에서 받은 props를 사용합니다.
    }, [searchParams, queryParams]);


    // const [params, setParams] = useState<FlightArrivalSearchParamsType | FlightDepartureSearchParamsType>(queryParams);

    // 변경/확인: 최초 1회만 URL 채우기 (문자열 비교만 사용)
    // const bootedRef = useRef(false);
    // useEffect(() => {
    //     // console.log('bootedRef:', bootedRef.current, 'searchParams:', searchParams, 'searchParams.toString():', searchParams.toString(), 'queryParams:', queryParams);
    //     if (bootedRef.current) return;

    //     const currStr = searchParams.toString(); // ← 현재 URL 쿼리를 "그대로" 문자열로 사용
    //     if (currStr.length === 0) {
    //         const nextStr = parseSearchParams(queryParams as unknown as Record<string, unknown>);
    //         if (nextStr) {
    //             history.pushState(null, '', `?${nextStr}`);
    //         }
    //     }
    //     bootedRef.current = true;
    // }, [searchParams, queryParams, router]);
    

    // 최소 변환: URL → 객체 (fetch 호출용)
    // - 비교 로직에는 관여하지 않음
    // const params = useMemo(() => {
    //     const currStr = searchParams.toString();
    //     if (currStr.length === 0) {
    //         return queryParams;
    //     }
    //     return parseSearchParamsToObject(currStr) as FlightArrivalSearchParamsType | FlightDepartureSearchParamsType;
    // }, [searchParams, queryParams]);

    const { data, isFetching, isLoading, refetch } = useQuery({
        queryKey: ['flight', type, currentParams],
        queryFn: () => {
            if(type === 'arrival') {
                return fetchArrivalFlights(currentParams);
            } else {
                return fetchDepartureFlights(currentParams);
            }
        },
        placeholderData: (prev) => prev,
        staleTime: 1000 * 10, // 10초
        gcTime: 1000 * 20, // 20초
    });

    // useEffect(() => {
    //     router.replace(`?${parseSearchParams(params)}`, { scroll: false });
    // }, [params, router]);

    const updateParams = useCallback((
        newParams: FlightArrivalSearchParamsType | FlightDepartureSearchParamsType
    ) => {
        // const prevStr = parseSearchParams(params);
        const nextStr = parseSearchParams(newParams);

        // if (prevStr === nextStr) {
        //     console.log('refetching...');
        //     refetch();
        //     return;
        // }

        startTransition(() => {
            history.pushState(null, '', `?${nextStr}`);
        });

        // history.pushState(null, '', `?${nextStr}`);
        // setParams(newParams);
        // queryClient.invalidateQueries({ queryKey: ['flight', type] });
    }, []);

    const refetchParams = useCallback(() => {
        console.log('refetching...');
        refetch();
    }, [refetch]);

    useEffect(() => {
        if (data) {
            const title = type === 'arrival' ? '도착' : '출발';
            const searchDate = funcDateTimeToType(currentParams.searchDate as string, 'YYYYMMDD');
            const searchFrom = funcTimeToHHMMReverse(currentParams.searchFrom as string);
            const searchTo = funcTimeToHHMMReverse(currentParams.searchTo as string);
            const flightId = currentParams.flightId;

            document.title = `${flightId !== undefined ? `${flightId} - ` : ''}항공기 ${title}정보 조회 : ${searchDate} ${searchFrom} ~ ${searchTo}`;
            document.querySelector('meta[name="description"]')?.setAttribute('content', `${flightId && `${flightId} - `}항공기 ${title}정보 조회 : ${searchDate} ${searchFrom} ~ ${searchTo}`);
        }
    }, [data, currentParams, type]);

    
    // const { 
    //     setBulkState
    // } = useFlightState(resFlightData);
    
    // const { isLoading, setLoadingState } = useFlightStore();
    // useEffect(() => {
    //     // // 새로운 데이터가 도착하면 로딩 상태 해제
    //     // if (resFlightData) {
    //     //     setBulkState({
    //     //         flightData: resFlightData.items,
    //     //         totalCount: resFlightData.totalCount,
    //     //         searchDate: resFlightData.searchDate,
    //     //         searchFrom: resFlightData.searchFrom,
    //     //         searchTo: Number(resFlightData.searchTo) >= 2400 ? '2359' : resFlightData.searchTo,
    //     //         flightId: flightId ?? '',
    //     //     });
    //     // }
    //     setLoadingState(false); // 새로운 데이터가 도착했을 때만 로딩 상태 해제
    // }, [resFlightData, setLoadingState]);

    if (!data) return null;
    // const flightData = data?.items || [];
    // const totalCount = data?.totalCount || 0;
    // const searchDate = data?.searchDate || currentParams.searchDate;
    // const searchFrom = data?.searchFrom || currentParams.searchFrom;
    // const searchTo = data?.searchTo || currentParams.searchTo;
    const { items: flightData, totalCount, searchDate, searchFrom, searchTo } = data;
    const displayIsLoading = isLoading || isFetching || isPending;
    const title = type === 'arrival' ? '도착조회' : '출발조회';

    return (
        <>
            {/* { `isLoading: ${isLoading}` }, { `isFetching: ${isFetching}` }, { `isPending: ${isPending}` } */}
            <FlightTab />

            <FlightSearchForm 
                queryParams={currentParams} 
                updateParams={updateParams} 
                displayIsLoading={displayIsLoading}
                key={JSON.stringify(currentParams)}
            />

            <h2 className="mb-4 text-2xl font-bold text-center">{`${title} - ${totalCount}건`}</h2>
            <p className="mb-4 text-center">
                {`${funcDateTimeToType(searchDate, 'YYYYMMDD')} ${funcTimeToHHMMReverse(searchFrom)} ~ ${funcTimeToHHMMReverse(searchTo)}`}
            </p>

            <div className="flex gap-4 justify-between">
                <FlightRefresh displayIsLoading={displayIsLoading} refetchParams={refetchParams} />
                <FlightReset displayIsLoading={displayIsLoading} />
            </div>

            {
                displayIsLoading ? (
                    <ul className="flex flex-col gap-4">
                        <FlightCardLayout>
                            <div className="flex flex-col gap-2 justify-center items-center w-full">
                                <div className="w-1/4 h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="w-1/3 h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="flex gap-2 mt-2">
                                    <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
                                    <div className="w-20 h-8 bg-gray-100 rounded animate-pulse" />
                                </div>
                            </div>
                        </FlightCardLayout>
                    </ul>
                ) : (
                    <>
                        {flightData && flightData.length > 0 ? (
                            <ul className="flex flex-col gap-4">
                                {flightData.map((flight: FlightArrivalItemType | FlightDepartureItemType) => (
                                    <FlightCardLayout key={flight.fid}>
                                        {type === 'arrival' ? (
                                            <FlightArrivalCard flight={flight as FlightArrivalItemType} />
                                        ) : (
                                            <FlightDepartureCard flight={flight as FlightDepartureItemType} />
                                        )}
                                    </FlightCardLayout>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center text-gray-500">비행기 정보가 없습니다.</div>
                        )}
                    </>
                )
            }
        </>
    );
};

export default memo(FlightCardList);