import { fetchArrivalFlights } from './services/flightArrivalApi';
import { fetchDepartureFlights } from './services/flightDepartureApi';
import { 
    FlightArrivalType, FlightArrivalResponseType, FlightArrivalSearchParamsType, 
    FlightDepartureResponseType, FlightDepartureType, FlightDepartureSearchParamsType, 
    FlightType
} from './types/flights';
// import Button from '@/components/common/Button';
import { funcNowDate, funcNowTime, funcNowTimeAdd } from '@/lib/utils/dateTime';
import FlightCardList from './components/FlightCardList';
import FlightSearchForm from './components/FlightSearchForm';
import FlightTab from './components/FlightTab';

// 서버 컴포넌트 - 서버 사이드에서 데이터를 가져와서 클라이언트 컴포넌트에 전달
const FlightSection = async({ parsedParams, type } : { parsedParams : FlightArrivalSearchParamsType | FlightDepartureSearchParamsType, type: FlightType }) => {

    // const [resFlightData, setResFlightData] = useState<FlightArrivalResponseType>();

    const setSearchTo = Number(funcNowTimeAdd(60)) >= 2400 ? '2359' : funcNowTimeAdd(60);

    // 서버 사이드에서 비행기 데이터 가져오기
    const getSearchDate = parsedParams.searchDate ?? funcNowDate();
    const getSearchFrom = parsedParams.searchFrom ?? funcNowTime();
    const getSearchTo = parsedParams.searchTo ?? setSearchTo;
    const getPageNo = parsedParams.pageNo ?? '1';
    const getNumOfRows = parsedParams.numOfRows ?? '20';
    const getFlightId = parsedParams.flightId ?? '';

    const responseBody: FlightArrivalType | FlightDepartureType = {
        pageNo: getPageNo,
        numOfRows: getNumOfRows,
        searchdtCode: 'E',
        searchDate: getSearchDate,
        searchFrom: getSearchFrom,
        searchTo: getSearchTo,
        flightId: getFlightId,
        passengerOrCargo: '',
        airportCode: '',
    };

    // 서버에서 데이터 가져오기 - 에러 핸들링 추가
    let resFlightData: FlightArrivalResponseType | FlightDepartureResponseType | null = null;
    
    try {
        if(type === 'arrival') {
            resFlightData = await fetchArrivalFlights(responseBody);
        } else {
            resFlightData = await fetchDepartureFlights(responseBody);
        }
        console.log('서버에서 가져온 비행기 데이터:', resFlightData);
    } catch (error) {
        console.error('서버에서 비행기 데이터 가져오기 실패:', error);
        // 에러 발생 시 기본 데이터 구조 제공
        resFlightData = {
            numOfRows: 0,
            pageNo: 1,
            totalCount: 0,
            searchDate: getSearchDate ?? '',
            searchFrom: getSearchFrom ?? '',
            searchTo: getSearchTo ?? '',
            flightId: getFlightId ?? '',
            items: []
        };
    }

    return (
        <div className="max-w-[600px] mx-auto my-6">
            <FlightTab />
            {resFlightData && <FlightSearchForm resFlightData={resFlightData} />}
            {/* 클라이언트 컴포넌트에 서버에서 가져온 데이터 전달 */}
            {resFlightData && <FlightCardList resFlightData={resFlightData} type={type} />}
        </div>
    );
};

export default FlightSection;
