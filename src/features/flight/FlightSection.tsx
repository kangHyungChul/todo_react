import { fetchArrivalFlights, fetchFlightTrack } from './services/flightApi';
import { FlightArrivalType, FlightArrivalResponseType, FlightArrivalSearchParamsType } from './types/flights';
// import Button from '@/components/common/Button';
import FlightCardList from './components/FlightCardList'
import FlightSearchForm from './components/FlightSearchForm'
import { funcNowDate, funcNowTime, funcNowTimeAdd } from '@/lib/utils/dateTime';

// 서버 컴포넌트 - 서버 사이드에서 데이터를 가져와서 클라이언트 컴포넌트에 전달
const FlightSection = async({ parsedParams } : { parsedParams : FlightArrivalSearchParamsType }) => {

    // const [resFlightData, setResFlightData] = useState<FlightArrivalResponseType>();

    // 서버 사이드에서 비행기 데이터 가져오기
    const getSearchDate = parsedParams.searchDate ?? funcNowDate();
    const getSearchFrom = parsedParams.searchFrom ?? funcNowTime();
    const getSearchTo = parsedParams.searchTo ?? funcNowTimeAdd(30);
    const getPageNo = parsedParams.pageNo ?? '1';
    const getNumOfRows = parsedParams.numOfRows ?? '20';

    const responseBody: FlightArrivalType = {
        pageNo: getPageNo,
        numOfRows: getNumOfRows,
        searchdtCode: 'E',
        searchDate: getSearchDate,
        searchFrom: getSearchFrom,
        searchTo: getSearchTo,
        flightId: '',
        passengerOrCargo: '',
        airportCode: '',
    };

    // 서버에서 데이터 가져오기 - 에러 핸들링 추가
    let resFlightData: FlightArrivalResponseType | null = null;
    
    try {
        resFlightData = await fetchArrivalFlights(responseBody);
        // const resFlightTrack = await fetchFlightTrack();
        console.log('서버에서 가져온 비행기 데이터:', resFlightData);
        // console.log('서버에서 가져온 비행기 추적 데이터:', resFlightTrack);
    } catch (error) {
        console.error('서버에서 비행기 데이터 가져오기 실패:', error, process.env.NODE_ENV, process.env.VERCEL_URL, process.env.BASE_URL);
        // 에러 발생 시 기본 데이터 구조 제공
        resFlightData = {
            numOfRows: 0,
            pageNo: 1,
            totalCount: 0,
            searchDate: getSearchDate ?? '',
            searchFrom: getSearchFrom ?? '',
            searchTo: getSearchTo ?? '',
            items: []
        };
    }


    return (
        <div className="max-w-[600px] mx-auto my-6">
            {resFlightData && <FlightSearchForm resFlightData={resFlightData} />}
            {/* 클라이언트 컴포넌트에 서버에서 가져온 데이터 전달 */}
            {resFlightData && <FlightCardList resFlightData={resFlightData} />}
        </div>
    );
};

export default FlightSection;
