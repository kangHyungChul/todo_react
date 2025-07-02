'use client';

import { FlightArrivalItemType, FlightArrivalResponseType } from '../types/flights';
import { useState, useReducer } from 'react';
import FlightCard from './FlightCard';
import Button from '@/components/common/Button';

const dateReducer = (state: FlightArrivalResponseType, action: DateAction) => {
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

const FlightCardList = ({ flightData }: { flightData: FlightArrivalResponseType }) => {
    
    const [useDateReducer, dispatchDateReducer] = useReducer(dateReducer, flightData);
    const [flightData, useFlightData] = useState<FlightArrivalItemType[]>(flightData.items);
    const [totalCount, useTotalCount] = useState(flightData.totalCount);
    const [isLoading, setIsLoading] = useState(false);


    // 새로고침 함수
    const handleRefresh = async () => {
        setIsLoading(true);
        try {
            const result = await fetch('http://localhost:3000/api/flight', {
                method: 'POST',
                body: JSON.stringify(flightData),
            });

            const data = await result.json();

            dispatchDateReducer({ type: 'SET_SEARCH_DATE', payload: data.dateInfo.resNowDate });
            dispatchDateReducer({ type: 'SET_SEARCH_FROM', payload: data.dateInfo.resNowTime });
            dispatchDateReducer({ type: 'SET_SEARCH_TO', payload: data.dateInfo.resSearchEndTime });
            useFlightData(data.items);
            useTotalCount(data.totalCount);
        } catch (error) {
            console.error('비행기 데이터 새로고침 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <>
            <h2 className="text-2xl font-bold mb-4 text-center">도착조회 - {totalCount}건</h2>
            <p className="text-center mb-4">
                {/* {useDateReducer.dateInfo.resNowDate} {useDateReducer.dateInfo.resNowTime} ~ {useDateReducer.dateInfo.resSearchEndTime} */}
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