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
    console.log(flight)
    return (
        <li key={flight.fid} className="p-4 border border-gray-300 rounded-lg flex flex-col items-center">
            <p>
                {
                    (() => {
                        if (flight.scheduleDatetime === flight.estimatedDatetime) {
                            return flight.scheduleDatetime;
                        } else {
                            return (
                                <>
                                    <span className="text-gray-500 line-through">{flight.estimatedDatetime}</span> / <strong>{flight.scheduleDatetime}</strong>
                                </>
                            );
                        }
                    })()
                }
            </p>
            <p>{flight.airport}({flight.airportCode}) - ICN(인천)</p>
            <p> / {flight.airline}({flight.aircraftRegNo}) - {flight.remark}</p>
            <div className="flex gap-4 mt-2">
                <Button style="secondary" onClick={() => openModalContext(<FlightDetailModal flight={flight} />)}>useContext</Button>
                <Button style="primary" onClick={() => openModal(<FlightDetailModal flight={flight} />)}>Zustand</Button>
            </div>
        </li>
    );
};

export default FlightCard;