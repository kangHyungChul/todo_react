'use client';

import { FlightArrivalItemType } from '../types/flights';
import { useState, useEffect } from 'react';
import FlightCard from './FlightCard';
import Button from '@/components/common/Button';

// 서버 액션 타입 정의
type GetFlightsFunction = () => Promise<{
    items: FlightArrivalItemType[];
    numOfRows: number;
    pageNo: number;
    totalCount: number;
}>;

const FlightCardList = ({ searchDate, searchFrom, searchTo, flight, getFlights }: { searchDate: string, searchFrom: string, searchTo: string, flight: FlightArrivalItemType[], getFlights: GetFlightsFunction }) => {
    // 클라이언트 상태로 비행기 데이터 관리
    const [totalCount, setTotalCount] = useState(flight.length);
    const [nowSearchDate, setSearchDate] = useState(searchDate);
    const [nowSearchFrom, setSearchFrom] = useState(searchFrom);
    const [nowSearchTo, setSearchTo] = useState(searchTo);
    const [flightData, setFlightData] = useState<FlightArrivalItemType[]>(flight);
    const [isLoading, setIsLoading] = useState(false);

    // 새로고침 함수
    const handleRefresh = async () => {
        setIsLoading(true);
        try {
            const result = await getFlights();
            setFlightData(result.items);
        } catch (error) {
            console.error('비행기 데이터 새로고침 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 초기 데이터 설정
    useEffect(() => {
        setFlightData(flight);
        setTotalCount(flight.length);
        setSearchDate(searchDate);
        setSearchFrom(searchFrom);
        setSearchTo(searchTo);
    }, [flight]);

    return (
        <>
            <h2 className="text-2xl font-bold mb-4 text-center">도착조회 - {totalCount}건</h2>
            <p className="text-center mb-4">
                {nowSearchDate} {nowSearchFrom} ~ {nowSearchTo}
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