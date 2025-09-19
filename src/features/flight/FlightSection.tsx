import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getServerQueryClient from '@/lib/server-query-client';
import { fetchArrivalFlights, fetchDepartureFlights } from './services/flightApi';
import { 
    FlightArrivalType, FlightArrivalSearchParamsType, 
    FlightDepartureType, FlightDepartureSearchParamsType, 
    FlightType
} from './types/flights';
// import Button from '@/components/common/Button';
import { funcNowDate, funcNowTime, funcNowTimeAdd } from '@/lib/utils/dateTime';

import FlightCardList from './components/FlightCardList';

// 서버 컴포넌트 - 서버 사이드에서 데이터를 가져와서 클라이언트 컴포넌트에 전달
const FlightSection = async({ parsedParams, type } : { parsedParams : FlightArrivalSearchParamsType | FlightDepartureSearchParamsType, type: FlightType }) => {

    // const [resFlightData, setResFlightData] = useState<FlightArrivalResponseType>();

    const setSearchTo = Number(funcNowTimeAdd(60)) >= 2400 ? '2359' : funcNowTimeAdd(60);

    // 서버 사이드에서 비행기 데이터 가져오기
    const getSearchDate = parsedParams.searchDate ?? funcNowDate();
    const getSearchFrom = parsedParams.searchFrom ?? funcNowTime();
    const getSearchTo = parsedParams.searchTo ?? setSearchTo;
    const getPageNo = parsedParams.pageNo ?? '1';
    const getNumOfRows = parsedParams.numOfRows ?? '30';
    const getFlightId = parsedParams.flightId ?? '';

    const queryParams: FlightArrivalType | FlightDepartureType = {
        // pageNo, numOfRows, searchDate, searchFrom, searchTo는 항상 포함
        ...(getFlightId ? { flightId: getFlightId } : {}),
        numOfRows: getNumOfRows,
        pageNo: getPageNo,
        searchDate: getSearchDate,
        searchFrom: getSearchFrom,
        searchTo: getSearchTo,
        // flightId는 값이 있을 때만 포함해야 함
        // 아래와 같이 스프레드 연산자를 사용하여 조건부로 flightId를 추가
    };

    // console.log(queryParams);
    
    // 서버에서 데이터 가져오기 - 에러 핸들링 추가
    // let queryParams: FlightArrivalResponseType | FlightDepartureResponseType | null = null;
    
    // react-query 마이그레이션 적용
    const queryClient = getServerQueryClient();
    
    await queryClient.prefetchQuery({
        queryKey: ['flight', type, queryParams], // queryParams 값이 바뀌면 쿼리키가 달라져서 새로운 데이터를 요청함
        queryFn: () => {
            // type이 'arrival'이면 도착편 API, 아니면 출발편 API를 호출
            if(type === 'arrival') {
                return fetchArrivalFlights(queryParams);
            } else {
                return fetchDepartureFlights(queryParams);
            }
        },
        staleTime: 1000 * 30, // 30초
        gcTime: 1000 * 60, // 1분
    });
    
    // console.log('FlightSection queryParams:', queryParams);

    // console.log(type, parsedParams, queryParams, queryClient);

    // try {
    //     if(type === 'arrival') {
    //         resFlightData = await fetchArrivalFlights(responseBody);
    //     } else {
    //         resFlightData = await fetchDepartureFlights(responseBody);
    //     }
    //     // console.log('서버에서 가져온 비행기 데이터:', resFlightData);
    // } catch (error) {
    //     console.error('서버에서 비행기 데이터 가져오기 실패:', error);
    //     // 에러 발생 시 기본 데이터 구조 제공
    //     resFlightData = {
    //         numOfRows: 0,
    //         pageNo: 1,
    //         totalCount: 0,
    //         searchDate: getSearchDate ?? '',
    //         searchFrom: getSearchFrom ?? '',
    //         searchTo: getSearchTo ?? '',
    //         flightId: getFlightId ?? '',
    //         items: []
    //     };
    // }

    return (
        <div className="mx-auto my-6 max-w-[600px]">
            <HydrationBoundary state={dehydrate(queryClient)}>
                {/* 클라이언트 컴포넌트에 서버에서 가져온 데이터 전달 */}
                <FlightCardList queryParams={queryParams} type={type} />
                {/* {resFlightData && <FlightCardList resFlightData={resFlightData} type={type} />} */}
            </HydrationBoundary>
        </div>
    );
};

export default FlightSection;
