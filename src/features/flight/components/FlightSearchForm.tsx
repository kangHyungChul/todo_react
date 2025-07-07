'use client';

import Button from '@/components/common/Button';
import { funcTimeToHHMM } from '@/lib/utils/dateTime';
import { useState } from 'react';

const FlightSearchForm = () => {
    const [searchFrom, setSearchFrom] = useState('');
    const [searchTo, setSearchTo] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const searchFromHHMM = funcTimeToHHMM(searchFrom);  
        const searchToHHMM = funcTimeToHHMM(searchTo);
        console.log(searchFromHHMM, searchToHHMM);
    };

    return (
        <div className="max-w-[600px] mx-auto my-6">
            <form onSubmit={handleSubmit}>
                {/* <div>
                    <label htmlFor="searchDate">날짜</label>
                    <input type="date" id="searchDate" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
                </div> */}
                <div>
                    <label htmlFor="searchFrom">출발시간</label>
                    <input type="time" id="searchFrom" value={searchFrom} onChange={(e) => setSearchFrom(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="searchTo">도착시간</label>
                    <input type="time" id="searchTo" value={searchTo} onChange={(e) => setSearchTo(e.target.value)} />
                </div>
                <div className="mt-4">
                    <Button type="submit" size="large" style="primary" className="w-full">검색</Button>
                </div>
            </form>
        </div>
    );
};

export default FlightSearchForm;