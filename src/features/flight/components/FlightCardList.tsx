'use client';

// import { fetchArrivalFlights } from '../services/flightApi';
import { FlightArrivalItemType, FlightArrivalResponseType, FlightDepartureItemType, FlightDepartureResponseType } from '../types/flights';
// import { useEffect } from 'react';
// import { funcNowDate, funcNowTime, funcNowTimeAdd } from '@/lib/utils/dateTime';
// import FlightCard from './FlightCard';
// import { useRouter } from 'next/navigation';
// import { useFlightArrival, useFlightArrivalSearch } from '../hook/useFlightArrival';
import { useFlightStore } from '../store/FlightStore';
import FlightRefresh from './FlightRefresh';
import FlightCardLayout from './FlightCardLayout';

import FlightArrivalCard from './arrival/FlightCard';
import FlightDepartureCard from './departure/FlightCard';

// 클라이언트 컴포넌트 - 상태 관리와 이벤트 핸들링 담당
const FlightCardList = ({ resFlightData }: { resFlightData: FlightArrivalResponseType | FlightDepartureResponseType }) => {

    const { items: flightData, totalCount, searchDate, searchFrom, searchTo } = resFlightData;
    
    console.log('flightData:', flightData);
    
    // 라우터 인스턴스 생성
    // const router = useRouter();

    // useFlightArrivalSearch Hook 사용 - 올바른 Hook 사용법
    // const { FlightArrivalSearch } = useFlightArrivalSearch();
    // const { isLoading, setLoadingState } = useFlightStore();

    // const { 
    //     flightData, totalCount, pageNo, numOfRows, searchDate, searchFrom, searchTo, 
    //     setFlightData, setTotalCount, setPageNo, setNumOfRows, setSearchDate, setSearchFrom, setSearchTo 
    // } = useFlightArrival();
    // const { 
    //     flightData, totalCount, searchDate, searchFrom, searchTo, 
    //     setBulkState
    // } = useFlightArrival(resFlightData);

    const { isLoading } = useFlightStore();

    // resFlightData가 변경될 때마다 상태 업데이트 (router.push + refresh 후 서버에서 새로운 데이터가 전달됨)
    // useEffect(() => {
    //     // 새로운 데이터가 도착하면 로딩 상태 해제
    //     if (resFlightData) {
    //         // setFlightData(resFlightData.items);
    //         // setTotalCount(resFlightData.totalCount);
    //         // setSearchDate(resFlightData.searchDate);
    //         // setSearchFrom(resFlightData.searchFrom); 
    //         // setSearchTo(resFlightData.searchTo);
    //         setBulkState({
    //             flightData: resFlightData.items,
    //             totalCount: resFlightData.totalCount,
    //             searchDate: resFlightData.searchDate,
    //             searchFrom: resFlightData.searchFrom,
    //             searchTo: Number(resFlightData.searchTo) >= 2400 ? '2359' : resFlightData.searchTo,
    //         });
    //         setLoadingState(false); // 새로운 데이터가 도착했을 때만 로딩 상태 해제
    //     }
    // }, [resFlightData, setBulkState, setLoadingState]);

    return (
        <>
            <h2 className="text-2xl font-bold mb-4 text-center">도착조회 - {totalCount}건</h2>
            <p className="text-center mb-4">
                {searchDate} {searchFrom} ~ {searchTo}
            </p>

            <FlightRefresh resFlightData={resFlightData} />

            {
                isLoading ? (
                    <div className="text-center text-gray-500">로딩중...</div>
                ) : (
                    <>
                        {flightData && flightData.length > 0 ? (
                            <ul className="flex flex-col gap-4">
                                {flightData.map((flight: FlightArrivalItemType | FlightDepartureItemType) => (
                                    <FlightCardLayout key={flight.fid} codeshare={flight.codeshare}>
                                        <FlightCard flight={flight} />
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

export default FlightCardList;