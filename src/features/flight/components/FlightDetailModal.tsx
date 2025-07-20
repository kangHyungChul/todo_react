import { FlightArrivalItemType } from '../types/flights';

const exitGate = (terminalId: string) => {
    return (
        <>
            {/* 
                terminalId에 따라 출구명을 효율적으로 매핑하기 위해 객체를 사용합니다.
                중복 조건 및 논리 오류를 방지하고, 유지보수성을 높입니다.
            */}
            {
                ({
                    'P01': '1터미널',
                    'P02': '1터미널', // 탑승동
                    'P03': '2터미널',
                    'C01': '화물터미널 남측',
                    'C02': '화물터미널 북측', // C02는 남측/북측 중 하나만 표시 (명확한 기준 필요시 추가 설명 필요)
                    'C03': '화물터미널(3단계)'
                } as Record<string, string>)[terminalId] || ''
            }
        </>
    );
};

const FlightDetailModal = ({ flight }: { flight: FlightArrivalItemType }) => {
    // console.log(flight);
    return (
        <div className="flex flex-col gap-2">
            <p>{flight.airline}({flight.flightId} / {flight.aircraftRegNo})</p>
            <p>
                {flight.airport}({flight.airportCode}) - 인천(ICN) 
            </p>
            <p>
                {flight.remark} /
                출구번호 : {exitGate(flight.terminalId)} - {flight.exitNumber}
            </p>
        </div>
    );
};

export default FlightDetailModal;