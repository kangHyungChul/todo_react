'use client';

import { FlightArrivalItemType } from "../types/flights";
// import { funcNowTime, funcNowTimeAdd } from "@/lib/utils/dateTime";
import { funcNowDate, funcNowTime, funcNowTimeAdd, funcTimeToHHMMReverse } from "@/lib/utils/dateTime";
import { useState } from "react";

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
    const setFlightData = (flightData: FlightArrivalItemType[]) => setState((prev) => ({ ...prev, flightData }));
    const setTotalCount = (totalCount: number) => setState((prev) => ({ ...prev, totalCount }));
    const setPageNo = (pageNo: number) => setState((prev) => ({ ...prev, pageNo }));
    const setNumOfRows = (numOfRows: number) => setState((prev) => ({ ...prev, numOfRows }));
    const setSearchDate = (searchDate: string) => setState((prev) => ({ ...prev, searchDate }));
    const setSearchFrom = (searchFrom: string) => setState((prev) => ({ ...prev, searchFrom }));
    const setSearchTo = (searchTo: string) => setState((prev) => ({ ...prev, searchTo }));

    // 반환값에 state의 각 필드와 set 함수들을 모두 포함시켜 사용 가능하도록 함
    return {
        ...state,
        setFlightData,
        setTotalCount,
        setPageNo,
        setNumOfRows,
        setSearchDate,
        setSearchFrom,
        setSearchTo,
    };
};

export default useFlightArrival;
