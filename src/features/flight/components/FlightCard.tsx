'use client';

import { FlightArrivalItemType } from '../types/flights';
import useModalStore from '@/store/ModalStore';
// import { useModalContext } from '@/contexts/ModalContext';
import FlightDetailModal from './FlightDetailModal';
import FlightTrackModal from './FlightTrackModal';
import Button from '@/components/common/Button';
import { funcDateTimeToType } from '@/lib/utils/dateTime';
import { memo } from 'react';

const FlightCard = ({ flight }: { flight: FlightArrivalItemType }) => {

    // const { openModalContext } = useModalContext();
    const openModal = useModalStore((state) => state.openModal);
    const scheduleDatetime = funcDateTimeToType(flight.scheduleDatetime, 'HHMM');
    const estimatedDatetime = funcDateTimeToType(flight.estimatedDatetime, 'HHMM');
    const isCodeshare = flight.codeshare === 'Slave';
    // const { openModal } = useModalStore();
    // console.log(flight)
    return (
        <li key={flight.fid} className={`p-4 border border-gray-300 rounded-lg flex flex-col items-center${flight.codeshare === 'Slave' ? ' bg-gray-100 border-t-0 -mt-4' : ''}`}>
            <p>
                {
                    scheduleDatetime === estimatedDatetime ? (
                        <strong>{scheduleDatetime}</strong>
                    ) : (
                        <>  
                            <span className="text-gray-500 line-through">{scheduleDatetime}</span> / <strong>{estimatedDatetime}</strong>
                        </>
                    )   
                }
            </p>
            <p>{flight.airport}({flight.airportCode}) - 인천(ICN)</p>
            <p className="flex items-center gap-1">
                {flight.airline}({flight.flightId})
                {
                    (
                        isCodeshare && (
                            <>
                                <span className="text-xs text-gray-500">&lt;-&gt;</span>{flight.masterFlightId}
                            </>
                        )
                    )
                }
            </p>
            <p>{flight.remark}</p>
            {
                !isCodeshare && (
                    <div className="flex gap-4 mt-2">
                        {/* <Button style="secondary" onClick={() => openModalContext(<FlightDetailModal flight={flight} />)}>useContext</Button> */}
                        <Button style="primary" onClick={() => openModal(<FlightDetailModal flight={flight} />)}>상세보기</Button>
                        {
                            (
                                (flight.remark === null || flight.remark === '지연') && (
                                    <Button style="secondary" onClick={() => openModal(<FlightTrackModal flightId={flight.flightId} flightReg={flight.aircraftRegNo} />, '2xl')}>현재위치</Button>
                                )
                            )
                        }
                    </div>
                )
            }
        </li>
    );
};

export default memo(FlightCard);