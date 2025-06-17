import { FlightArrivalItemType } from '../types/flights';

const FlightDetailModal = ({ flight }: { flight: FlightArrivalItemType }) => {
    console.log(flight);
    return (
        <>
            <p>{flight.airport}({flight.airportCode}) - 인천(ICN)</p>
            <p>{flight.airline}({flight.aircraftRegNo})</p>
            <p>{flight.remark}</p>
        </>
    );
};

export default FlightDetailModal;