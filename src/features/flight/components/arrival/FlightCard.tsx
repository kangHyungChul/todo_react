'use client';

import { FlightArrivalItemType } from '../../types/flights';
import useModalStore from '@/store/ModalStore';
// import { useModalContext } from '@/contexts/ModalContext';
import FlightDetailModal from './FlightDetailModal';
import FlightTrackModal from '../FlightTrackModal';
import Button from '@/components/common/Button';
import FlightDetailViewButton from '../FlightDetailViewButton';
import FlightIcon from '@/components/icon/flight';
import PinIcon from '@/components/icon/pin';
import { funcDateTimeToType } from '@/lib/utils/dateTime';
import { memo } from 'react';

const FlightCard = ({ flight }: { flight: FlightArrivalItemType }) => {

    // const { openModalContext } = useModalContext();
    const openModal = useModalStore((state) => state.openModal);
    const scheduleDatetime = funcDateTimeToType(flight.scheduleDatetime, 'HHMM');
    const estimatedDatetime = funcDateTimeToType(flight.estimatedDatetime, 'HHMM');
    const isCodeshare = flight.codeshare === 'Slave';
    // const { openModal } = useModalStore();
    return (
        <>
            {/* 
                상위 div: flex로 좌우 정렬, 내부에 2개의 주요 영역(좌측: 아이콘+항공편정보, 우측: 상태+뱃지)
                class -> className으로 변경 필요, 코드 가독성 향상을 위해 들여쓰기 및 줄바꿈 정렬
            */}
            <div className="flex items-center justify-between">
                {/* 좌측: 아이콘 + 항공편명/항공사 */}
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-sm">
                        <FlightIcon width={20} height={20} className="text-white rotate-180" />
                    </div>
                    <div>
                        <h3 className="tracking-tight text-xl font-bold text-gray-900">KE124</h3>
                        <p className="text-sm text-gray-600 font-medium">대한항공</p>
                    </div>
                </div>
                {/* 우측: 상태 아이콘 + 뱃지 */}
                <div className="flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-circle-check-big w-4 h-4 text-emerald-600"
                    >
                        <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                        <path d="m9 11 3 3L22 4"></path>
                    </svg>
                    <div
                        className="inline-flex items-center rounded-full border transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 font-medium text-xs px-2.5 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200"
                        data-v0-t="badge"
                    >
                        정시
                    </div>
                </div>
            </div>
            {/* 
                주요 정보(출발지, 도착지, 시간 등) 정렬 및 가독성 향상을 위해 코드 정렬
                class → className 으로 변경 필요 (JSX 규칙)
            */}
            <div className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 출발지 정보 */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <PinIcon width={24} height={24} className="text-blue-600" />
                            출발지
                        </div>
                        <div className="space-y-2">
                            <div className="font-bold text-lg text-gray-900">도쿄(NRT)</div>
                            <div className="text-sm text-gray-600">일본</div>
                        </div>
                    </div>
                    {/* 도착지 정보 */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <PinIcon width={24} height={24} className="text-emerald-600" />
                            도착지
                        </div>
                        <div className="space-y-2">
                            <div className="font-bold text-lg text-gray-900">인천(ICN)</div>
                            <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                                게이트 A8 • 제1터미널
                            </div>
                        </div>
                    </div>
                    {/* 도착 시간 및 날짜 */}
                    <div className="space-y-3 text-right">
                        <div className="space-y-2">
                            <div className="font-bold text-2xl text-gray-900">13:15</div>
                            <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md inline-block">
                                2024-01-15
                            </div>
                        </div>
                    </div>
                </div>
                {/* 상세보기 버튼 */}
                <div className="flex items-center justify-end pt-4 border-t border-gray-100">
                    <a href="/flight/arrival/5">
                        <button
                            className="ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground border h-9 rounded-md px-3 bg-white border-emerald-200 text-emerald-700 font-medium"
                        >
                            상세보기
                        </button>
                    </a>
                </div>
            </div>
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
            <p>{`${flight.airport}(${flight.airportCode}) - 인천(ICN)`}</p>
            <p className="flex items-center gap-1">
                {`${flight.airline}(${flight.flightId})`}
                {
                    (
                        isCodeshare && (
                            <>
                                <span className="text-xs text-gray-500">&lt;-&gt;</span>{`${flight.masterFlightId}`}
                            </>
                        )
                    )
                }
            </p>
            <p>{flight.remark}</p>
            {
                !isCodeshare && (
                    <div className="mt-2 flex gap-2">
                        {/* <Button style="secondary" onClick={() => openModalContext(<FlightDetailModal flight={flight} />)}>useContext</Button> */}
                        <Button variant="primary" onClick={() => openModal(<FlightDetailModal flight={flight} />)}>상세보기</Button>
                        {
                            (flight.remark === null || flight.remark === '지연') && (
                                <Button variant="secondary" disabled={flight.aircraftRegNo === ''} onClick={() => openModal(<FlightTrackModal flightId={flight.flightId} flightReg={flight.aircraftRegNo} />, '2xl')}>현재위치</Button>
                            )
                        }
                        <FlightDetailViewButton path={`/flight/detail/${flight.fid}`} />
                    </div>
                )
            }
        </>
    );
};

export default memo(FlightCard);