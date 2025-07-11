'use client';

import Button from '@/components/common/Button';
import { funcNowTime, funcNowTimeAdd, funcTimeToHHMM, funcTimeToHHMMReverse } from '@/lib/utils/dateTime';
import { useState } from 'react';

const FlightSearchForm = () => {

    const getSearchFrom = funcTimeToHHMMReverse(funcNowTime());
    const getSearchTo = funcTimeToHHMMReverse(funcNowTimeAdd(30));

    const [searchFrom, setSearchFrom] = useState(getSearchFrom);
    const [searchTo, setSearchTo] = useState(getSearchTo);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const searchFromHHMM = funcTimeToHHMM(searchFrom);  
        const searchToHHMM = funcTimeToHHMM(searchTo);
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