'use client';

import { FlightArrivalItemType } from '../../types/flights';
import useModalStore from '@/store/ModalStore';
// import { useModalContext } from '@/contexts/ModalContext';
import FlightDetailModal from './FlightDetailModal';
import FlightLogo from '../FlightLogo';
import FlightExitGate from '../FlightExitGate';
import FlightRemark from '../FlightRemark';
import FlightTrackModal from '../FlightTrackModal';
import Button from '@/components/common/Button';
import FlightDetailViewButton from '../FlightDetailViewButton';
// import FlightIcon from '@/components/icon/flight';
import PinIcon from '@/components/icon/pin';
import { funcDateTimeToType } from '@/lib/utils/dateTime';
import { memo } from 'react';

const FlightCard = ({ flight }: { flight: FlightArrivalItemType }) => {

    // const { openModalContext } = useModalContext();
    const openModal = useModalStore((state) => state.openModal);
    const scheduleDatetime = funcDateTimeToType(flight.scheduleDatetime, 'HHMM');
    const estimatedDatetime = funcDateTimeToType(flight.estimatedDatetime, 'HHMM');
    // const isCodeshare = flight.codeshare === 'Slave';
    // const { openModal } = useModalStore();
    return (
        <>
            {/* 
                상위 div: flex로 좌우 정렬, 내부에 2개의 주요 영역(좌측: 아이콘+항공편정보, 우측: 상태+뱃지)
                class -> className으로 변경 필요, 코드 가독성 향상을 위해 들여쓰기 및 줄바꿈 정렬
            */}
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
            {/* 
                주요 정보(출발지, 도착지, 시간 등) 정렬 및 가독성 향상을 위해 코드 정렬
            */}
            <div className="pt-6">
                <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
                    {/* 출발지 정보 */}
                    <div className="space-y-3">
                        <div className="flex gap-2 items-center text-sm font-semibold text-gray-700">
                            <PinIcon width={24} height={24} className="text-blue-600" />
                            출발지
                        </div>
                        <div className="space-y-2">
                            <div className="text-lg font-bold text-gray-900">{`${flight.airport}(${flight.airportCode})`}</div>
                            {/* <div className="text-sm text-gray-600">일본</div> */}
                        </div>
                    </div>
                    {/* 도착지 정보 */}
                    <div className="space-y-3">
                        <div className="flex gap-2 items-center text-sm font-semibold text-gray-700">
                            <PinIcon width={24} height={24} className="text-emerald-600" />
                            도착지
                        </div>
                        <div className="space-y-2">
                            <div className="text-lg font-bold text-gray-900">인천(ICN)</div>
                            <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                                <FlightExitGate terminalId={flight.terminalId} /> {`• 입국장출구 ${flight.exitNumber}`}
                            </div>
                        </div>
                    </div>
                    {/* 도착 시간 및 날짜 */}
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
                {/* 상세보기 버튼 */}
                <div className="flex gap-2 justify-end items-center pt-4 border-t border-gray-100">
                    {/* <Button variant="primary" outline={true} onClick={() => openModal(<FlightDetailModal flight={flight} />)}>상세보기</Button> */}
                    {
                        (flight.remark === null || flight.remark === '지연') && (
                            <Button variant="primary" outline={true} disabled={flight.aircraftRegNo === ''} onClick={() => openModal(<FlightTrackModal flightId={flight.flightId} flightReg={flight.aircraftRegNo} />, '2xl')}>현재위치</Button>
                        )
                    }
                    <FlightDetailViewButton path={`/flight/detail/${flight.fid}`} />
                </div>
            </div>
        </>
    );
};

export default memo(FlightCard);