'use client';

import { FlightArrivalItemType, FlightArrivalResponseType } from '../types/flights';
import useModalStore from '@/store/ModalStore';
import FlightDetailModal from './FlightDetailModal';

const FlightCard = ({ flight }: { flight: FlightArrivalResponseType }) => {
    const { openModal } = useModalStore();
    
    return (
        <>
            {flight.items.map((flight: FlightArrivalItemType) => (
                <li key={flight.fid} className="p-4 border border-gray-200 rounded-lg">
                    <button className="w-full text-center cursor-pointer" onClick={() => openModal(<FlightDetailModal flight={flight} />)}>
                        {flight.flightId}
                    </button>
                </li>
            ))}
        </>
    );
};

export default FlightCard;