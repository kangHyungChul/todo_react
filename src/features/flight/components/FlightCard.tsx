'use client';

import { FlightArrivalItemType } from '../types/flights';
import useModalStore from '@/store/ModalStore';
import { useModalContext } from '@/contexts/ModalContext';
import FlightDetailModal from './FlightDetailModal';
import Button from '@/components/common/Button';

const FlightCard = ({ flight }: { flight: FlightArrivalItemType }) => {

    const { openModalContext } = useModalContext();
    const openModal = useModalStore((state) => state.openModal);
    // const { openModal } = useModalStore();

    return (
        <li key={flight.fid} className="p-4 border border-gray-300 rounded-lg flex flex-col items-center">
            <p>{flight.estimatedDatetime} / {flight.airline}({flight.flightId}) - {flight.remark}</p>
            <div className="flex gap-4 mt-2">
                <Button style="secondary" onClick={() => openModalContext(<FlightDetailModal flight={flight} />)}>useContext</Button>
                <Button style="primary" onClick={() => openModal(<FlightDetailModal flight={flight} />)}>Zustand</Button>
            </div>
        </li>
    );
};

export default FlightCard;