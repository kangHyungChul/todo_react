'use client';

// import { fetchArrivalFlights } from '../services/flightApi';
import { 
    FlightArrivalResponseType, 
    FlightDepartureResponseType 
} from '../types/flights';
// import FlightCard from './FlightCard';
import Button from '@/components/common/Button';
// import { useRouter } from 'next/navigation';
import { useFlightSearch } from '../hook/useFlightArrival';
// import { useFlightStore } from '../store/FlightStore';

// 클라이언트 컴포넌트 - 상태 관리와 이벤트 핸들링 담당
const FlightRefresh = ({ resFlightData, isFetching, isLoading }: { resFlightData: FlightArrivalResponseType | FlightDepartureResponseType, isFetching: boolean, isLoading: boolean }) => {
    
    // 라우터 인스턴스 생성
    // const router = useRouter();

    // useFlightArrivalSearch Hook 사용 - 올바른 Hook 사용법
    const { FlightSearch } = useFlightSearch();
    // const { isLoading } = useFlightStore();
    const searchDate = resFlightData.searchDate;
    const searchFrom = resFlightData.searchFrom;
    const searchTo = resFlightData.searchTo;
    const numOfRows = resFlightData.numOfRows.toString();
    const pageNo = resFlightData.pageNo.toString();
    const flightId = resFlightData.flightId ? resFlightData.flightId : '';

    // const { 
    //     flightData, totalCount, pageNo, numOfRows, searchDate, searchFrom, searchTo, 
    //     setFlightData, setTotalCount, setPageNo, setNumOfRows, setSearchDate, setSearchFrom, setSearchTo 
    // } = useFlightArrival();

    // const [isLoading, setIsLoading] = useState(false);

    // resFlightData가 변경될 때마다 상태 업데이트 (router.push + refresh 후 서버에서 새로운 데이터가 전달됨)

    // 새로고침 함수 - router.push와 router.refresh만 사용
    const handleRefresh = () => {

        // FlightArrivalSearch 함수를 올바르게 호출
        FlightSearch({
            searchDate: searchDate,
            searchFrom: searchFrom,
            searchTo: searchTo,
            flightId: flightId ?? '',
            numOfRows: numOfRows,
            pageNo: pageNo,
        });
        // setIsLoading(true);
        // try {

        //     // 현재 시간 기준으로 새로운 데이터 요청
        //     const refreshSearchDate = funcNowDate();
        //     const refreshSearchFrom = funcNowTime();
        //     const refreshSearchTo = funcNowTimeAdd(60);
        //     const refreshPageNo = '1';

        //     // URL 업데이트 후 서버 컴포넌트 재실행
        //     // router.push는 비동기적으로 작동하므로 로딩 상태를 유지
        //     router.push(`/flight?searchDate=${refreshSearchDate}&searchFrom=${refreshSearchFrom}&searchTo=${refreshSearchTo}&pageNo=${refreshPageNo}`);
        //     // router.refresh();
            
        //     // 로딩 상태는 useEffect에서 새로운 데이터가 도착할 때 해제됨
        //     // 여기서 setIsLoading(false)를 제거하여 로딩 상태 유지

        // } catch (error) {
        //     console.error('비행기 데이터 새로고침 실패:', error);
        //     setIsLoading(false); // 에러 발생 시에만 로딩 상태 해제
        // }
    };

    return (
        <Button variant="primary" className="mb-4" onClick={handleRefresh} disabled={isLoading || isFetching}>
            {isLoading || isFetching ? '조회중...' : '새로고침'}
        </Button>
    );
};

export default FlightRefresh;