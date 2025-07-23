'use client';

// import { fetchArrivalFlights } from '../services/flightApi';
import { FlightArrivalItemType, FlightArrivalResponseType } from '../types/flights';
import { useEffect } from 'react';
import { funcNowDate, funcNowTime, funcNowTimeAdd } from '@/lib/utils/dateTime';
import FlightCard from './FlightCard';
import Button from '@/components/common/Button';
// import { useRouter } from 'next/navigation';
import { useFlightArrival, useFlightArrivalSearch } from '../hook/useFlightArrival';
import { useFlightStore } from '../store/FlightStore';

// 클라이언트 컴포넌트 - 상태 관리와 이벤트 핸들링 담당
const FlightCardList = ({ resFlightData }: { resFlightData: FlightArrivalResponseType }) => {
    
    // 라우터 인스턴스 생성
    // const router = useRouter();

    // useFlightArrivalSearch Hook 사용 - 올바른 Hook 사용법
    const { FlightArrivalSearch } = useFlightArrivalSearch();
    const { isLoading, setLoadingState } = useFlightStore();

    // const { 
    //     flightData, totalCount, pageNo, numOfRows, searchDate, searchFrom, searchTo, 
    //     setFlightData, setTotalCount, setPageNo, setNumOfRows, setSearchDate, setSearchFrom, setSearchTo 
    // } = useFlightArrival();
    const { 
        flightData, totalCount, searchDate, searchFrom, searchTo, 
        setBulkState
    } = useFlightArrival(resFlightData);

    // const [isLoading, setIsLoading] = useState(false);

    // resFlightData가 변경될 때마다 상태 업데이트 (router.push + refresh 후 서버에서 새로운 데이터가 전달됨)
    useEffect(() => {
        // 새로운 데이터가 도착하면 로딩 상태 해제
        if (resFlightData) {
            // setFlightData(resFlightData.items);
            // setTotalCount(resFlightData.totalCount);
            // setSearchDate(resFlightData.searchDate);
            // setSearchFrom(resFlightData.searchFrom); 
            // setSearchTo(resFlightData.searchTo);
            setBulkState({
                flightData: resFlightData.items,
                totalCount: resFlightData.totalCount,
                searchDate: resFlightData.searchDate,
                searchFrom: resFlightData.searchFrom,
                searchTo: resFlightData.searchTo,
            });
            setLoadingState(false); // 새로운 데이터가 도착했을 때만 로딩 상태 해제
        }
    }, [resFlightData, setBulkState, setLoadingState]);
    

    // 새로고침 함수 - router.push와 router.refresh만 사용
    const handleRefresh = async () => {

        // FlightArrivalSearch 함수를 올바르게 호출
        FlightArrivalSearch({
            searchDate: funcNowDate(),
            searchFrom: funcNowTime(),
            searchTo: funcNowTimeAdd(60),
            numOfRows: '30',
            pageNo: '1',
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
        <>
            <h2 className="text-2xl font-bold mb-4 text-center">도착조회 - {totalCount}건</h2>
            <p className="text-center mb-4">
                {searchDate} {searchFrom} ~ {searchTo}
            </p>
            <Button style="primary" className="mb-4" onClick={handleRefresh} disabled={isLoading}>
                {isLoading ? '조회중...' : '이후 한시간 조회'}
            </Button>

            {
                isLoading ? (
                    <div className="text-center text-gray-500">로딩중...</div>
                ) : (
                    <>
                        {flightData && flightData.length > 0 ? (
                            <ul className="flex flex-col gap-4">
                                {flightData.map((flight: FlightArrivalItemType) => (
                                    <FlightCard key={flight.fid} flight={flight} />
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center text-gray-500">비행기 정보가 없습니다.</div>
                        )}
                    </>
                )
            }
        </>
    );
};

export default FlightCardList;