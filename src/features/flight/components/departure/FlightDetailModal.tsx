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
                <FlightExitGate terminalId={flight.terminalId} /> {flight.chkinRange} 카운터
            </p>
            <p>
                탑승게이트: {flight.gateNumber} / {flight.remark}
            </p>
        </div>
    );
};

export default FlightDetailModal;