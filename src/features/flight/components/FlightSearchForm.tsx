'use client';

import Button from '@/components/common/Button';
import { funcNowDate, funcNowTime, funcNowTimeAdd, funcTimeToHHMM, funcTimeToHHMMReverse } from '@/lib/utils/dateTime';
import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
import { FlightArrivalResponseType } from '../types/flights';
import { useFlightArrivalSearch } from '../hook/useFlightArrival';

const FlightSearchForm = ({ resFlightData }: { resFlightData: FlightArrivalResponseType }) => {
    // const router = useRouter();
    const { FlightArrivalSearch } = useFlightArrivalSearch();

    // 서버에서 받은 데이터를 기반으로 초기값 설정
    const getSearchFrom = resFlightData?.searchFrom ? funcTimeToHHMMReverse(resFlightData.searchFrom) : funcTimeToHHMMReverse(funcNowTime());
    const getSearchTo = resFlightData?.searchTo ? funcTimeToHHMMReverse(resFlightData.searchTo) : funcTimeToHHMMReverse(funcNowTimeAdd(30));
    const getSearchNumOfRows = resFlightData?.numOfRows ? resFlightData.numOfRows.toString() : '30';

    const [searchFrom, setSearchFrom] = useState(getSearchFrom);
    const [searchTo, setSearchTo] = useState(getSearchTo);
    const [searchNumOfRows, setSearchNumOfRows] = useState('30');

    // 서버 데이터가 변경될 때마다 폼 값 업데이트
    useEffect(() => {
        setSearchFrom(getSearchFrom);
        setSearchTo(getSearchTo);
        setSearchNumOfRows(getSearchNumOfRows);
    }, [getSearchFrom, getSearchTo, getSearchNumOfRows]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // 검색 실행
        FlightArrivalSearch({
            searchDate: funcNowDate(),
            searchFrom: funcTimeToHHMM(searchFrom),
            searchTo: funcTimeToHHMM(searchTo),
            numOfRows: searchNumOfRows,
            pageNo: '1',
        });
        // try {
        //     const searchFromHHMM = funcTimeToHHMM(searchFrom);  
        //     const searchToHHMM = funcTimeToHHMM(searchTo);

        //     // 현재 시간 기준으로 새로운 데이터 요청
        //     // const refreshSearchDate = funcNowDate();
        //     const refreshSearchFrom = searchFromHHMM;
        //     const refreshSearchTo = searchToHHMM;
        //     const refreshPageNo = '1';

        //     // URL 업데이트 후 서버 컴포넌트 재실행
        //     // router.push는 비동기적으로 작동하므로 로딩 상태를 유지
        //     router.push(`/flight?searchFrom=${refreshSearchFrom}&searchTo=${refreshSearchTo}&pageNo=${refreshPageNo}`);
        //     // router.refresh();
            
        //     // 로딩 상태는 useEffect에서 새로운 데이터가 도착할 때 해제됨
        //     // 여기서 setIsLoading(false)를 제거하여 로딩 상태 유지

        // } catch (error) {
        //     console.error('비행기 데이터 새로고침 실패:', error);
        //     // setIsLoading(false); // 에러 발생 시에만 로딩 상태 해제
        // }
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
                    <input type="time" id="searchFrom" value={searchFrom} onChange={(e) => setSearchFrom(e.target.value)} max={searchTo} />
                </div>
                <div className="flex items-center gap-3 mt-1">
                    <label htmlFor="searchTo">조회범위(종료시간)</label>
                    <input type="time" id="searchTo" value={searchTo} onChange={(e) => setSearchTo(e.target.value)} min={searchFrom} />
                </div>
                <div className="flex items-center gap-3 mt-1">
                    <label htmlFor="searchNumOfRows">표시수</label>
                    <select id="searchNumOfRows" value={searchNumOfRows} onChange={(e) => setSearchNumOfRows(e.target.value)}>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
                <div className="mt-4">
                    <Button type="submit" size="large" style="primary" className="w-full">검색</Button>
                </div>
            </form>
        </div>
    );
};

export default FlightSearchForm;