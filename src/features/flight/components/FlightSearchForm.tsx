'use client';

import Button from '@/components/common/Button';
import { funcNowDate, funcNowTime, funcNowTimeAdd, funcTimeToHHMM, funcTimeToHHMMReverse } from '@/lib/utils/dateTime';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const FlightSearchForm = () => {
    const router = useRouter();

    const getSearchFrom = funcTimeToHHMMReverse(funcNowTime());
    const getSearchTo = funcTimeToHHMMReverse(funcNowTimeAdd(30));

    const [searchFrom, setSearchFrom] = useState(getSearchFrom);
    const [searchTo, setSearchTo] = useState(getSearchTo);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            const searchFromHHMM = funcTimeToHHMM(searchFrom);  
            const searchToHHMM = funcTimeToHHMM(searchTo);
            console.log(searchFromHHMM, searchToHHMM);

            // 현재 시간 기준으로 새로운 데이터 요청
            const refreshSearchDate = funcNowDate();
            const refreshSearchFrom = searchFromHHMM;
            const refreshSearchTo = searchToHHMM;
            const refreshPageNo = '1';
            const refreshNumOfRows = '40';

            // URL 업데이트 후 서버 컴포넌트 재실행
            // router.push는 비동기적으로 작동하므로 로딩 상태를 유지
            router.push(`/flight?searchDate=${refreshSearchDate}&searchFrom=${refreshSearchFrom}&searchTo=${refreshSearchTo}&pageNo=${refreshPageNo}&numOfRows=${refreshNumOfRows}`);
            // router.refresh();
            
            // 로딩 상태는 useEffect에서 새로운 데이터가 도착할 때 해제됨
            // 여기서 setIsLoading(false)를 제거하여 로딩 상태 유지

        } catch (error) {
            console.error('비행기 데이터 새로고침 실패:', error);
            // setIsLoading(false); // 에러 발생 시에만 로딩 상태 해제
        }
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
                <div className="mt-4">
                    <Button type="submit" size="large" style="primary" className="w-full">검색</Button>
                </div>
            </form>
        </div>
    );
};

export default FlightSearchForm;