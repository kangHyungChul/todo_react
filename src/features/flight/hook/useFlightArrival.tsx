'use client';

import { FlightArrivalItemType, FlightArrivalSearchParamsType } from "../types/flights";
// import { funcNowTime, funcNowTimeAdd } from "@/lib/utils/dateTime";
import { funcNowDate, funcNowTime, funcNowTimeAdd, funcTimeToHHMMReverse } from "@/lib/utils/dateTime";
import { useState } from "react";
import { useRouter } from "next/navigation";

const useFlightArrival = () => {
    // 상태값들을 하나의 객체(state)로 묶어서 관리하여 코드의 중복을 줄이고, setState도 하나로 통합하여 효율적으로 리팩토링합니다.
    // 각 필드의 초기값을 별도의 상수로 분리하여 가독성을 높입니다.

    // 초기 상태값을 상수로 선언
    const initialState = {
        flightData: [] as FlightArrivalItemType[], // 비행기 데이터 배열
        totalCount: 0, // 전체 건수
        pageNo: 1, // 페이지 번호
        numOfRows: 30, // 한 페이지당 행 수
        searchDate: funcNowDate(), // 검색 날짜 (오늘)
        searchFrom: funcTimeToHHMMReverse(funcNowTime()), // 검색 시작 시간 (현재 시간)
        searchTo: funcTimeToHHMMReverse(funcNowTimeAdd(60)), // 검색 종료 시간 (현재 시간 + 60분)
    };

    // useState를 객체 형태로 사용하여 모든 상태를 한 번에 관리
    const [state, setState] = useState(initialState);

    // 각 상태별 set 함수들을 별도로 제공
    // const setFlightData = (flightData: FlightArrivalItemType[]) => setState((prev) => ({ ...prev, flightData }));
    // const setTotalCount = (totalCount: number) => setState((prev) => ({ ...prev, totalCount }));
    // const setPageNo = (pageNo: number) => setState((prev) => ({ ...prev, pageNo }));
    // const setNumOfRows = (numOfRows: number) => setState((prev) => ({ ...prev, numOfRows }));
    // const setSearchDate = (searchDate: string) => setState((prev) => ({ ...prev, searchDate }));
    // const setSearchFrom = (searchFrom: string) => setState((prev) => ({ ...prev, searchFrom }));
    // const setSearchTo = (searchTo: string) => setState((prev) => ({ ...prev, searchTo }));

    const setBulkState = (newState: Partial<typeof initialState>) => setState((prev) => ({ ...prev, ...newState }));

    // 반환값에 state의 각 필드와 set 함수들을 모두 포함시켜 사용 가능하도록 함
    return {
        ...state,
        // setFlightData,
        // setTotalCount,
        // setPageNo,
        // setNumOfRows,
        // setSearchDate,
        // setSearchFrom,
        // setSearchTo,
        setBulkState,
    };
};

// useFlightArrivalSearch를 올바른 React Hook으로 수정
const useFlightArrivalSearch = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    
    const FlightArrivalSearch = async (arrivalSearchParams: FlightArrivalSearchParamsType) => {
        setIsLoading(true);
        try {
            console.log(arrivalSearchParams);
            const searchDate = arrivalSearchParams.searchDate;
            const searchFrom = arrivalSearchParams.searchFrom;
            const searchTo = arrivalSearchParams.searchTo;
            const pageNo = arrivalSearchParams.pageNo;
            const numOfRows = arrivalSearchParams.numOfRows;

            // const searchFromHHMM = funcTimeToHHMM(arrivalSearchParams.searchFrom);  
            // const searchToHHMM = funcTimeToHHMM(arrivalSearchParams.searchTo);

            // // 현재 시간 기준으로 새로운 데이터 요청
            // // const refreshSearchDate = funcNowDate();
            // const refreshSearchFrom = searchFromHHMM;
            // const refreshSearchTo = searchToHHMM;
            // const refreshPageNo = '1';

            // // URL 업데이트 후 서버 컴포넌트 재실행
            // // router.push는 비동기적으로 작동하므로 로딩 상태를 유지
            router.push(`/flight?searchDate=${searchDate}&searchFrom=${searchFrom}&searchTo=${searchTo}&pageNo=${pageNo}&numOfRows=${numOfRows}`);
            // // router.refresh();
            
            // // 로딩 상태는 useEffect에서 새로운 데이터가 도착할 때 해제됨
            // // 여기서 setIsLoading(false)를 제거하여 로딩 상태 유지

        } catch (error) {
            console.error('비행기 데이터 새로고침 실패:', error);
            setIsLoading(false); // 에러 발생 시에만 로딩 상태 해제
        }
    };

    return { FlightArrivalSearch, isLoading, setIsLoading };
};

export { useFlightArrival, useFlightArrivalSearch };