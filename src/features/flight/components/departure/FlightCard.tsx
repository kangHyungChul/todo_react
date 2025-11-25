'use client';

import { FlightDepartureItemType, FlightType } from '@/features/flight/types/flights';
// import useModalStore from '@/store/ModalStore';
// import { useModalContext } from '@/contexts/ModalContext';
// import FlightDetailModal from './FlightDetailModal';
import FlightTrackModal from '../FlightTrackModal';
import FlightLogo from '../FlightLogo';
import FlightRemark from '../FlightRemark';
import PinIcon from '@/components/icon/pin';
import Button from '@/components/common/Button';
import { funcDateTimeToType } from '@/lib/utils/dateTime';
import { memo } from 'react';
import FlightExitGate from '../FlightExitGate';
import FlightDetailViewButton from '../FlightDetailViewButton';
import useModalStore from '@/store/ModalStore';

const FlightCard = ({ flight, type }: { flight: FlightDepartureItemType, type: FlightType }) => {

    // const { openModalContext } = useModalContext();
    // const openModal = useModalStore((state) => state.openModal);
    const openModalWithComponent = useModalStore((state) => state.openModalWithComponent);
    const scheduleDatetime = funcDateTimeToType(flight.scheduleDatetime, 'HHMM');
    const estimatedDatetime = funcDateTimeToType(flight.estimatedDatetime, 'HHMM');
    console.log('type:', type);

    // const isCodeshare = flight.codeshare === 'Slave';
    // const { openModal } = useModalStore();
    return (
        <>
            <div className="flex justify-between items-center">
                {/* 좌측: 아이콘 + 항공편명/항공사 */}
                <div className="flex gap-4 items-center">
                    <FlightLogo flightId={flight.flightId} />
                    {/* <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-sm">
                        <FlightIcon width={20} height={20} className="text-white rotate-180" />
                    </div> */}
                    <div>
                        <h3 className="text-xl font-bold tracking-tight text-gray-900">{flight.flightId}</h3>
                        <p className="text-sm font-medium text-gray-600">{flight.airline}</p>
                    </div>
                </div>
                {/* 우측: 상태 아이콘 + 뱃지 */}
                <FlightRemark remark={flight.remark} />
            </div>

            <div className="pt-6">
                <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
                    {/* 출발지 정보 */}
                    <div className="space-y-3">
                        <div className="flex gap-2 items-center text-sm font-semibold text-gray-700">
                            <PinIcon width={24} height={24} className="text-emerald-600" />
                            출발지
                        </div>
                        <div className="space-y-2">
                            <div className="text-lg font-bold text-gray-900">인천(ICN)</div>
                            <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                                <FlightExitGate terminalId={flight.terminalId} />{` ${flight.chkinRange} 카운터`} • {`게이트 ${flight.gateNumber}`}
                            </div>
                        </div>
                    </div>
                    {/* 도착지 정보 */}
                    <div className="space-y-3">
                        <div className="flex gap-2 items-center text-sm font-semibold text-gray-700">
                            <PinIcon width={24} height={24} className="text-blue-600" />
                            도착지
                        </div>
                        <div className="space-y-2">
                            <div className="text-lg font-bold text-gray-900">{`${flight.airport}(${flight.airportCode})`}</div>
                            {/* <div className="text-sm text-gray-600">일본</div> */}
                        </div>
                    </div>
                    {/* 출발 시간 및 날짜 */}
                    <div className="space-y-3 text-right">
                        <div className="space-y-2">
                            <div>
                                {
                                    scheduleDatetime === estimatedDatetime ? (
                                        <strong className="text-2xl font-bold text-gray-900">{scheduleDatetime}</strong>
                                    ) : (
                                        <>
                                            <p className="text-gray-500 line-through">{scheduleDatetime}</p>
                                            <strong className="text-2xl font-bold text-gray-900">{estimatedDatetime}</strong>
                                        </>
                                    )
                                }
                            </div>
                            {/* <div className="inline-block px-2 py-1 text-xs text-gray-500 bg-gray-50 rounded-md">
                                2024-01-15
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* 상세보기 버튼 */}
            <div className="flex gap-2 justify-end items-center pt-4 border-t border-gray-100">
                {/* <Button variant="primary" outline={true} onClick={() => openModal(<FlightDetailModal flight={flight} />)}>상세보기</Button> */}
                {
                    
                    (flight.remark === null || flight.remark === '출발') && (
                        <Button 
                            variant="primary" 
                            outline={true} 
                            disabled={flight.aircraftRegNo === ''} 
                            onClick={() => openModalWithComponent(
                                FlightTrackModal, 
                                { flightId: flight.flightId, flightReg: flight.aircraftRegNo },
                                '2xl'
                            )}
                        >
                            현재위치
                        </Button>
                    )
                }
                <FlightDetailViewButton path={`/flight/${type}/detail/${flight.fid}`} />
            </div>
        </>
    );
};

export default memo(FlightCard);