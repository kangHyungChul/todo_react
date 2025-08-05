'use client';

import { 
    FlightArrivalItemType, FlightArrivalSearchParamsType, FlightArrivalResponseType, 
    FlightDepartureItemType, FlightDepartureResponseType, FlightDepartureSearchParamsType
} from '../types/flights';
// import { funcNowTime, funcNowTimeAdd } from "@/lib/utils/dateTime";
// import { funcNowDate, funcNowTime, funcNowTimeAdd, funcTimeToHHMMReverse } from "@/lib/utils/dateTime";
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useFlightStore } from '../store/FlightStore';

const useFlightState = (resFlightData: FlightArrivalResponseType | FlightDepartureResponseType) => {
    // 상태값들을 하나의 객체(state)로 묶어서 관리
    // 각 필드의 초기값은 최초 렌더링 시 서버에서 받은 데이터로 설정 <- 그렇지 않으면 초기값이 없어 빈상태로 노출됨

    // 초기 상태값을 상수로 선언
    const initialState = {
        flightData: resFlightData.items as FlightArrivalItemType[] | FlightDepartureItemType[], // 비행기 데이터 배열
        totalCount: resFlightData.totalCount, // 전체 건수
        pageNo: resFlightData.pageNo, // 페이지 번호
        numOfRows: resFlightData.numOfRows, // 한 페이지당 행 수
        searchDate: resFlightData.searchDate, // 검색 날짜 (오늘)
        searchFrom: resFlightData.searchFrom, // 검색 시작 시간 (현재 시간)
        searchTo: Number(resFlightData.searchTo) >= 2400 ? '2359' : resFlightData.searchTo, // 검색 종료 시간 (현재 시간 + 60분)
        flightId: resFlightData.flightId,
    };

    // console.log('initialState:', initialState);

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

    // partial타입이란?
    // 객체의 일부 속성만 업데이트하고 싶을 때 사용, 전부 옵셔널로 설정
    // 옵셔널 타입은 값이 없어도 되는 속성을 표시하는 데 사용 / ? 표시
    // setBulkState 함수에서 prev(이전 상태)와 newState(새로 전달된 상태)를 콘솔에 출력하여 상태 변경 추적
    const setBulkState = useCallback((newState: Partial<typeof initialState>) => {
        setState((prev) => {
            // console.log('setBulkState 호출 - prev:', prev); // 이전 상태 출력
            // console.log('setBulkState 호출 - newState:', newState); // 새로 전달된 상태 출력
            return { ...prev, ...newState };
        });
    }, []);

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

// useFlightArrivalSearch hook (검색관련련)
const useFlightSearch = () => {
    const router = useRouter();
    // const [isLoading, setIsLoading] = useState(false);
    const { setLoadingState } = useFlightStore();
    
    // setIsLoading을 useCallback으로 메모이제이션
    // const setLoadingState = useCallback((loading: boolean) => {
    //     setIsLoading(loading);
    // }, []);
    
    const FlightSearch = (arrivalSearchParams: FlightArrivalSearchParamsType | FlightDepartureSearchParamsType) => {
        setLoadingState(true);
        // console.log(arrivalSearchParams);
        const searchDate = arrivalSearchParams.searchDate;
        const searchFrom = arrivalSearchParams.searchFrom;
        const searchTo = arrivalSearchParams.searchTo;
        const pageNo = arrivalSearchParams.pageNo;
        const flightId = arrivalSearchParams.flightId === '' ? '' : `&flightId=${arrivalSearchParams.flightId}`;
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
        router.push(`?searchDate=${searchDate}&searchFrom=${searchFrom}&searchTo=${searchTo}&pageNo=${pageNo}&numOfRows=${numOfRows}${flightId}`);
        // // router.refresh();
        
        // // 로딩 상태는 useEffect에서 새로운 데이터가 도착할 때 해제됨
        // // 여기서 setIsLoading(false)를 제거하여 로딩 상태 유지
    };

    return { FlightSearch };
};

export { useFlightState, useFlightSearch };