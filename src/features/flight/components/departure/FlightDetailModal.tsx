import { FlightDepartureItemType } from '@/features/flight/types/flights';
import FlightExitGate from '../FlightExitGate';

const FlightDetailModal = ({ flight }: { flight: FlightDepartureItemType }) => {
    // console.log(flight);
    return (
        <div className="flex flex-col gap-2">
            <p>{flight.airline}({flight.flightId} / {flight.aircraftRegNo})</p>
            <p>
                {flight.airport}({flight.airportCode}) - 인천(ICN) 
            </p>
            <p>
                {flight.remark} /
                <FlightExitGate terminalId={flight.terminalId} /> {flight.chkinRange} 카운터
            </p>
            <p>
                게이트번호: {flight.gateNumber}
            </p>
        </div>
    );
};

export default FlightDetailModal;