'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
    // import { fetchArrivalFlights } from '../services/flightApi';
    FlightArrivalItemType, FlightArrivalSearchParamsType, 
    FlightDepartureItemType, FlightDepartureSearchParamsType, 
    FlightType
} from '../types/flights';
import { useState, useEffect, memo } from 'react';
import { funcTimeToHHMMReverse, funcDateTimeToType } from '@/lib/utils/dateTime';
// import FlightCard from './FlightCard';
// import { useRouter } from 'next/navigation';
// import { useFlightArrival, useFlightArrivalSearch } from '../hook/useFlightArrival';
// import { useFlightStore } from '../store/FlightStore';
// import { useFlightState } from '../hook/useFlightArrival';
import FlightRefresh from './FlightRefresh';
import FlightReset from './FlightReset';
import { fetchArrivalFlights, fetchDepartureFlights } from '../services/flightApi';
import { parseSearchParams } from '@/lib/utils/utils';

import FlightCardLayout from './FlightCardLayout';
import FlightArrivalCard from './arrival/FlightCard';
import FlightDepartureCard from './departure/FlightCard';
import FlightSearchForm from './FlightSearchForm';
import FlightTab from './FlightTab';

// 클라이언트 컴포넌트 - 상태 관리와 이벤트 핸들링 담당
const FlightCardList = ({ queryParams, type }: { queryParams: FlightArrivalSearchParamsType | FlightDepartureSearchParamsType, type: FlightType }) => {

    // console.log(queryParams);

    // const flightId = resFlightData.flightId ? resFlightData.flightId : '';

    const [params, setParams] = useState<FlightArrivalSearchParamsType | FlightDepartureSearchParamsType>(queryParams);
    
    const queryClient = useQueryClient();
    const { data, isLoading, isFetching, dataUpdatedAt, error } = useQuery({
        queryKey: ['flight', type, params],
        queryFn: () => {
            if(type === 'arrival') {
                return fetchArrivalFlights(params);
            } else {
                return fetchDepartureFlights(params);
            }
        },
        placeholderData: (prev) => prev
    });

    useEffect(() => {
        history.replaceState(null, '', `?${parseSearchParams(params)}`);
    }, [params]);

    const updateParams = (newParams: FlightArrivalSearchParamsType | FlightDepartureSearchParamsType) => {
        console.log('updateParams:', newParams);
        setParams(newParams);
        queryClient.invalidateQueries({ queryKey: ['flight'], refetchType: 'active' });
    };

    const title = type === 'arrival' ? '도착조회' : '출발조회';
    
    // console.log(data, isLoading, isFetching, dataUpdatedAt, error);
    const { items: flightData, totalCount, searchDate, searchFrom, searchTo } = data;
    
    
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

    return (
        <>
            <FlightTab />

            <FlightSearchForm queryParams={params} updateParams={updateParams} isLoading={isLoading} isFetching={isFetching} />

            <h2 className="text-2xl font-bold mb-4 text-center">{`${title} - ${totalCount}건`}</h2>
            <p className="text-center mb-4">
                {`${funcDateTimeToType(searchDate, 'YYYYMMDD')} ${funcTimeToHHMMReverse(searchFrom)} ~ ${funcTimeToHHMMReverse(searchTo)}`}
            </p>

            <div className="flex justify-between gap-4">
                <FlightRefresh queryParams={params} isFetching={isFetching} isLoading={isLoading} updateParams={updateParams} />
                <FlightReset isFetching={isFetching} isLoading={isLoading} updateParams={updateParams} />
            </div>

            {
                isFetching ? (
                    <ul className="flex flex-col gap-4">
                        <FlightCardLayout>
                            <div className="w-full flex flex-col justify-center items-center gap-2">
                                <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
                                <div className="flex gap-2 mt-2">
                                    <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-8 w-20 bg-gray-100 rounded animate-pulse" />
                                </div>
                            </div>
                        </FlightCardLayout>
                    </ul>
                ) : (
                    <>
                        {flightData && flightData.length > 0 ? (
                            <ul className="flex flex-col gap-4">
                                {flightData.map((flight: FlightArrivalItemType | FlightDepartureItemType) => (
                                    <FlightCardLayout key={flight.fid} codeshare={flight.codeshare}>
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