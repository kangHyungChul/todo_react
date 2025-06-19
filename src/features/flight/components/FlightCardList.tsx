'use client';

import { FlightArrivalItemType } from '../types/flights';
import { useState, useReducer } from 'react';
import FlightCard from './FlightCard';
import Button from '@/components/common/Button';

// 서버 액션 타입 정의
type DateInfo = {
    resNowDate: string;
    resNowTime: string;
    resSearchEndTime: string;
}

type GetFlightsFunction = () => Promise<{
    items: FlightArrivalItemType[];
    numOfRows: number;
    pageNo: number;
    totalCount: number;
    dateInfo: DateInfo;
}>;

type DateAction =
    | { type: 'SET_SEARCH_DATE'; payload: string } // 검색 날짜 설정
    | { type: 'SET_SEARCH_FROM'; payload: string } // 검색 시작 시간 설정
    | { type: 'SET_SEARCH_TO'; payload: string } // 검색 종료 시간 설정

type flightAction =
    | { type: 'SET_FLIGHT'; payload: FlightArrivalItemType[] } // 비행기 데이터 설정

const dateReducer = (state: DateInfo, action: DateAction) => {
    switch (action.type) {
        case 'SET_SEARCH_DATE':
            return { ...state, resNowDate: action.payload };
        case 'SET_SEARCH_FROM':
            return { ...state, resNowTime: action.payload };
        case 'SET_SEARCH_TO':
            return { ...state, resSearchEndTime: action.payload };
        default:
            return state;
    }
}

const FlightCardList = ({ dateInfo, flight, getFlights }: { dateInfo: DateInfo, flight: FlightArrivalItemType[], getFlights: GetFlightsFunction }) => {

    // console.log(dateInfo);
    // console.log(flight);
    
    // console.log(dateInfo);
    // console.log(flight);

    // // 클라이언트 상태로 비행기 데이터 관리
    // const [dateInfo, dispatchDateInfo] = useReducer(dateReducer, dateInfo);
    // const [flightData, dispatchFlight] = useReducer(flightReducer, flight);
    // const [totalCount, dispatchTotalCount] = useReducer(totalCountReducer, flight.length);
    // const [nowSearchDate, dispatchSearchDate] = useReducer(searchDateReducer, dateInfo.resNowDate);
    // const [nowSearchFrom, dispatchSearchFrom] = useReducer(searchFromReducer, dateInfo.resNowTime);
    // const [nowSearchTo, dispatchSearchTo] = useReducer(searchToReducer, dateInfo.resSearchEndTime);
    
    const [useDateReducer, dispatchDateReducer] = useReducer(dateReducer, dateInfo);
    const [flightData, useFlightData] = useState<FlightArrivalItemType[]>(flight);
    const [totalCount, useTotalCount] = useState(flight.length);
    const [isLoading, setIsLoading] = useState(false);


    // 새로고침 함수
    const handleRefresh = async () => {
        setIsLoading(true);
        try {
            const result = await getFlights();
            dispatchDateReducer({ type: 'SET_SEARCH_DATE', payload: result.dateInfo.resNowDate });
            dispatchDateReducer({ type: 'SET_SEARCH_FROM', payload: result.dateInfo.resNowTime });
            dispatchDateReducer({ type: 'SET_SEARCH_TO', payload: result.dateInfo.resSearchEndTime });
            useFlightData(result.items);
            useTotalCount(result.totalCount);
        } catch (error) {
            console.error('비행기 데이터 새로고침 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // console.log(dateInfo, flight);

    // 초기 데이터 설정
    // useEffect(() => {
    //     setFlightData(flight);
    //     setTotalCount(flight.length);
    //     setSearchDate(dateInfo.resNowDate);
    //     setSearchFrom(dateInfo.resNowTime);
    //     setSearchTo(dateInfo.resSearchEndTime);
    // }, [flight]);

    return (
        <>
            <h2 className="text-2xl font-bold mb-4 text-center">도착조회 - {totalCount}건</h2>
            <p className="text-center mb-4">
                {useDateReducer.resNowDate} {useDateReducer.resNowTime} ~ {useDateReducer.resSearchEndTime}
            </p>
            <Button style="primary" className="mb-4"onClick={handleRefresh} disabled={isLoading}>
                {isLoading ? '새로고침 중...' : '새로고침'}
            </Button>
            <ul className="flex flex-col gap-4">
                {flightData.map((flight: FlightArrivalItemType) => (
                    <FlightCard key={flight.fid} flight={flight} />
                ))}
            </ul>
        </>
    );
};

export default FlightCardList;