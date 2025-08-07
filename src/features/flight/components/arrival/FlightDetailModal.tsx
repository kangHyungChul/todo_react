import { FlightArrivalItemType } from '@/features/flight/types/flights';
import FlightExitGate from '../FlightExitGate';

const FlightDetailModal = ({ flight }: { flight: FlightArrivalItemType }) => {
    // console.log(flight);
    return (
        <div className="flex flex-col gap-2">
            <p>{`${flight.airline}(${flight.flightId} / ${flight.aircraftRegNo})`}</p>
            <p>
                {`${flight.airport}(${flight.airportCode}) - 인천(ICN)`}
            </p>
            <p>
                {`${flight.remark} / 출구번호 :`}
                <FlightExitGate terminalId={flight.terminalId} />
                {`- ${flight.exitNumber}`}
            </p>
        </div>
    );
};

export default FlightDetailModal;