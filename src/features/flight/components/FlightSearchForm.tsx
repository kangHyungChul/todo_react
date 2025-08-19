'use client';

import Button from '@/components/common/Button';
import Select from '@/components/common/Select';
import { funcNowDate, funcNowTime, funcNowTimeAdd, funcTimeToHHMM, funcTimeToHHMMReverse } from '@/lib/utils/dateTime';
import { useEffect, useRef, useState } from 'react';
// import { useRouter } from 'next/navigation';
import { 
    FlightArrivalType, 
    FlightDepartureType 
} from '../types/flights';
// import { useFlightSearch } from '../hook/useFlightArrival';
// import { useFlightStore } from '../store/FlightStore';

const FlightSearchForm = ({ 
    queryParams, 
    displayIsLoading, 
    updateParams 
}: { 
    queryParams: FlightArrivalType | FlightDepartureType, 
    displayIsLoading: boolean, 
    updateParams: (newParams: FlightArrivalType | FlightDepartureType) => void 
}) => {
    // const router = useRouter();
    // const { FlightSearch } = useFlightSearch();
    // const { isLoading } = useFlightStore();

    // 서버에서 받은 데이터를 기반으로 초기값 설정
    const getSearchFrom = queryParams?.searchFrom ? funcTimeToHHMMReverse(queryParams.searchFrom) : funcTimeToHHMMReverse(funcNowTime());
    const getSearchTo = queryParams?.searchTo ? funcTimeToHHMMReverse(queryParams.searchTo) : funcTimeToHHMMReverse(funcNowTimeAdd(30));
    const getSearchNumOfRows = queryParams?.numOfRows ? queryParams.numOfRows.toString() : '30';
    const getFlightId = queryParams?.flightId ? queryParams.flightId : '';

    const [searchFrom, setSearchFrom] = useState(getSearchFrom);
    const [searchTo, setSearchTo] = useState(getSearchTo);
    const [searchNumOfRows, setSearchNumOfRows] = useState('30');
    const searchFlightNoRef = useRef<HTMLInputElement>(null);

    // 서버 데이터가 변경될 때마다 폼 값 업데이트
    useEffect(() => {
        setSearchFrom(getSearchFrom);
        setSearchTo(getSearchTo);
        setSearchNumOfRows(getSearchNumOfRows);
        searchFlightNoRef.current!.value = getFlightId ? getFlightId : '';
        // url에 flightId 파라미터가 없을 경우 searchFlightNoRef의 값을 비움
        // if (searchFlightNoRef.current) {
        //     if (getFlightId) {
        //         searchFlightNoRef.current.value = getFlightId; // flightId가 있으면 값 설정
        //     } else {
        //         searchFlightNoRef.current.value = ''; // flightId가 없으면 값 비움
        //     }
        // }
    }, [getSearchFrom, getSearchTo, getSearchNumOfRows, getFlightId]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const newParams = {
            searchDate: funcNowDate(),
            searchFrom: funcTimeToHHMM(searchFrom),
            searchTo: funcTimeToHHMM(searchTo),
            flightId: searchFlightNoRef.current?.value !== '' ? searchFlightNoRef.current?.value : '',
            numOfRows: searchNumOfRows,
            pageNo: '1',
        };
        updateParams(newParams);
        // 검색 실행
        // FlightSearch({
        //     searchDate: funcNowDate(),
        //     searchFrom: funcTimeToHHMM(searchFrom),
        //     searchTo: funcTimeToHHMM(searchTo),
        //     flightId: searchFlightNoRef.current?.value !== '' ? searchFlightNoRef.current?.value : '',
        //     numOfRows: searchNumOfRows,
        //     pageNo: '1',
        // });

    };

    return (
        <div className="max-w-[600px] mx-auto my-6">
            <form onSubmit={handleSubmit}>
                {/* <div>
                    <label htmlFor="searchDate">날짜</label>
                    <input type="date" id="searchDate" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
                </div> */}
                <div className="flex items-center gap-3">
                    <label htmlFor="searchFrom">조회범위(시작시간)</label>
                    <input type="time" id="searchFrom" value={searchFrom} onChange={(e) => setSearchFrom(e.target.value)} max={searchTo} disabled={displayIsLoading}/>
                </div>
                <div className="flex items-center gap-3 mt-1">
                    <label htmlFor="searchTo">조회범위(종료시간)</label>
                    <input type="time" id="searchTo" value={searchTo} onChange={(e) => setSearchTo(e.target.value)} min={searchFrom} disabled={displayIsLoading}/>
                </div>
                <div className="flex items-center gap-3 mt-1">
                    <label htmlFor="searchFlightNo">편명</label>
                    <input type="text" id="searchFlightNo" defaultValue={getFlightId} ref={searchFlightNoRef} disabled={displayIsLoading}/>
                </div>
                <div className="flex items-center gap-3 mt-1">
                    <label htmlFor="searchNumOfRows">표시수</label>
                    <Select
                        id="searchNumOfRows"
                        value={searchNumOfRows}
                        onChange={(e) => setSearchNumOfRows(e.target.value)}
                        disabled={displayIsLoading}
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </Select>
                </div>
                <div className="mt-4">
                    <Button type="submit" sizes="large" variant="primary" className="w-full" disabled={displayIsLoading}>검색</Button>
                </div>
            </form>
        </div>
    );
};

export default FlightSearchForm;