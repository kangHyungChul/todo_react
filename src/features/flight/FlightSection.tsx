// 'use client';
import { fetchFlights } from './services/flightApi';
import { FlightArrivalType } from './types/flights';
// import Button from '@/components/common/Button';
import FlightCardList from './components/FlightCardList'
// import { useSearchParams } from 'next/navigation';
import { nowDate, nowTime, nowTimeAdd } from '@/lib/utils/dateTime';

// 서버 액션으로 정의 - 클라이언트 컴포넌트에서 호출 가능
const getFlights = async () => {
    'use server';
    
    const getNowDate = nowDate();
    const getNowTime = nowTime();
    const getSearchEndTime = nowTimeAdd(30); // 30분 더하기

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
    
    const res = await fetchFlights('arrival', responseBody);
    // console.log({ dateInfo: { resNowDate: getNowDate, resNowTime: getNowTime, resSearchEndTime: getSearchEndTime }, ...res });
    return { dateInfo: { resNowDate: getNowDate, resNowTime: getNowTime, resSearchEndTime: getSearchEndTime }, ...res };
};

const FlightSection = async () => {
    // const searchParams = useSearchParams();
    // const page = searchParams.get('page') || '1';
    
    // 초기 데이터 로드
    const res = await getFlights();

    
    return (
        <div className="max-w-[600px] mx-auto my-6">
            <FlightCardList dateInfo={res.dateInfo} flight={res.items} getFlights={getFlights}/>
        </div>
    );
};

export default FlightSection;
