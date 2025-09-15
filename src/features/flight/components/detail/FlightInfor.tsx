'use client';

import { FlightArrivalItemType, FlightDepartureItemType } from '../../types/flights';
// import useModalStore from '@/store/ModalStore';
// import { useModalContext } from '@/contexts/ModalContext';
// import FlightDetailModal from './FlightDetailModal';
// import FlightTrackModal from '../FlightTrackModal';
// import Button from '@/components/common/Button';
// import Link from 'next/link';
// import { funcDateTimeToType } from '@/lib/utils/dateTime';

const FlightInfor = ({ flightData }: { flightData: FlightArrivalItemType | FlightDepartureItemType }) => {

    console.log(flightData);

    // const { openModalContext } = useModalContext();
    // const openModal = useModalStore((state) => state.openModal);
    // const scheduleDatetime = funcDateTimeToType(flightData.scheduleDatetime, 'HHMM');
    // const estimatedDatetime = funcDateTimeToType(flightData.estimatedDatetime, 'HHMM');
    // const isCodeshare = flightData.codeshare === 'Slave';
    // const { openModal } = useModalStore();
    return (
        <>
            data:
            {flightData.fid}
            {flightData.flightId}
            {flightData.aircraftRegNo}
            {flightData.aircraftSubtype}
            {flightData.airline}
            {flightData.airport}
            {flightData.airportCode}
            {flightData.codeshare}
        </>
    );
};

export default FlightInfor;