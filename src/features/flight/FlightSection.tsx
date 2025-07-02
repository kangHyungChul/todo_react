'use client';
import { fetchArrivalFlights } from './services/flightApi';
import { FlightArrivalType, FlightArrivalResponseType } from './types/flights';
// import Button from '@/components/common/Button';
import FlightCardList from './components/FlightCardList'
// import { useSearchParams } from 'next/navigation';
import { nowDate, nowTime, nowTimeAdd } from '@/lib/utils/dateTime';
import { useState, useEffect } from 'react';

// 서버 액션으로 정의 - 클라이언트 컴포넌트에서 호출 가능
// const getFlights = async () => {
//     'use server';
    
//     const getNowDate = nowDate();
//     const getNowTime = nowTime();
//     const getSearchEndTime = nowTimeAdd(30); // 30분 더하기

//     const responseBody: FlightArrivalType = {
//         pageNo: '1',
//         numOfRows: '20',
//         searchdtCode: 'E',
//         searchDate: getNowDate,
//         searchFrom: getNowTime,
//         searchTo: getSearchEndTime,
//         flightId: '',
//         passengerOrCargo: '',
//         airportCode: '',
//     };
    
//     const res = await fetchFlights('arrival', responseBody);
//     // console.log({ dateInfo: { resNowDate: getNowDate, resNowTime: getNowTime, resSearchEndTime: getSearchEndTime }, ...res });
//     return { dateInfo: { resNowDate: getNowDate, resNowTime: getNowTime, resSearchEndTime: getSearchEndTime }, ...res };
// };

const FlightSection = () => {

    const [flightData, setFlightData] = useState<FlightArrivalResponseType>();

    const fetchFlightData = async () => {
        const getNowDate = nowDate();
        const getNowTime = nowTime();
        const getSearchEndTime = nowTimeAdd(30);

        const responseBody: FlightArrivalType = {
            pageNo: '1',
            numOfRows: '20',
            searchdtCode: 'E',
            searchDate: getNowDate,
            searchFrom: getNowTime,
            searchTo: getSearchEndTime,
            flightId: '',
            passengerOrCargo: '',
            airportCode: '',
        };

        const res = await fetchArrivalFlights(responseBody);
        console.log(res);
        // setFlightData(res);
    }
    
    fetchFlightData();

    // console.log(res());

    // useEffect(() => {
    //     const data = res();
    //     console.log(data);
    //     // setFlightData(data);
    // }, [res]);

    return (
        <div className="max-w-[600px] mx-auto my-6">
            {/* <FlightCardList flightData={flightData} /> */}
        </div>
    );
};

export default FlightSection;
