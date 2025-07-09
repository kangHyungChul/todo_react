import { FlightArrivalItemType } from '../types/flights';

const exitGate = (terminalId: string) => {
    return (
        <>
            {terminalId === 'P01' || terminalId === 'P02' && '1터미널' /* 탑승동 */ } 
            {terminalId === 'P03' && '2터미널'}
            {terminalId === 'C01' || terminalId === 'C02' && '화물터미널 남측'}
            {terminalId === 'C02' && '화물터미널 북측'}
            {terminalId === 'C03' && '화물터미널(3단계)'}
        </>
    )
}

const FlightDetailModal = ({ flight }: { flight: FlightArrivalItemType }) => {
    // console.log(flight);
    return (
        <>
            <p>{flight.airline}({flight.aircraftRegNo})</p>
            <p>
                {flight.airport}({flight.airportCode}) - 인천(ICN) 
            </p>
            <p>
                {flight.remark} /
                출구번호 : {exitGate(flight.terminalId)} - {flight.exitNumber}
            </p>
        </>
    );
};

export default FlightDetailModal;