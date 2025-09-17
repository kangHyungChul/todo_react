'use client';

import { FlightArrivalItemType, FlightDepartureItemType } from '../../types/flights';
import FlightExitGate from '../FlightExitGate';

// import useModalStore from '@/store/ModalStore';
// import { useModalContext } from '@/contexts/ModalContext';
// import FlightDetailModal from './FlightDetailModal';
// import FlightTrackModal from '../FlightTrackModal';
// import Button from '@/components/common/Button';
// import Link from 'next/link';
// import { funcDateTimeToType } from '@/lib/utils/dateTime';

const FlightInfor = ({ flightData }: { flightData: FlightArrivalItemType | FlightDepartureItemType }) => {

    // const { openModalContext } = useModalContext();
    // const openModal = useModalStore((state) => state.openModal);
    // const scheduleDatetime = funcDateTimeToType(flightData.scheduleDatetime, 'HHMM');
    // const estimatedDatetime = funcDateTimeToType(flightData.estimatedDatetime, 'HHMM');
    // const isCodeshare = flightData.codeshare === 'Slave';
    // const { openModal } = useModalStore();
    // console.log(flightData);
    return (
        <>
            {/* data: */}
            {/* {flightData.fid}
            {flightData.flightId}
            {flightData.aircraftRegNo}
            {flightData.aircraftSubtype}
            {flightData.airline}
            {flightData.airport}
            {flightData.airportCode}
            {flightData.codeshare} */}
            <div className="min-h-screen bg-white p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <h1 className="text-3xl font-bold text-gray-900">항공기 정보</h1>
                        </div>
                    </div>

                    <div className="mb-6 bg-white rounded-lg border border-gray-200 shadow-lg">
                        <div className="bg-slate-600 text-white rounded-t-lg p-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    {flightData.airline}
                                </h2>
                                <span className="bg-white text-slate-600 font-semibold px-3 py-1 rounded-full text-sm">
                                    {flightData.aircraftRegNo}
                                </span>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* 항공기 정보 */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <p className="text-sm text-gray-500">항공편번호</p>
                                            <p className="font-semibold text-lg">{flightData.flightId}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">#</span>
                                        <div>
                                            <p className="text-sm text-gray-500">항공기 등록번호</p>
                                            <p className="font-semibold text-lg font-mono">{flightData.aircraftRegNo}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* 운항 상태 */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        {/* <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div> */}
                                        <div>
                                            <p className="text-sm text-gray-500">운항 상태</p>
                                            <p className="font-semibold text-lg">{flightData.remark}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 출발/도착 정보 */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {/* 출발지 */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-lg">
                            <div className="bg-emerald-50 p-4 rounded-t-lg">
                                <h3 className="text-lg font-semibold flex items-center gap-2 text-emerald-700">
                                    출발지
                                </h3>
                            </div>
                            <div className="p-6">
                                <p className="text-xl font-bold text-gray-900 mb-2">{flightData.airport}</p>
                            </div>
                        </div>

                        {/* 도착지 */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-lg">
                            <div className="bg-amber-50 p-4 rounded-t-lg">
                                <h3 className="text-lg font-semibold flex items-center gap-2 text-amber-700">
                                    도착지
                                </h3>
                            </div>
                            <div className="p-6">
                                <p className="text-xl font-bold text-gray-900 mb-2">인천</p>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <span className="text-sm">{flightData.scheduleDatetime}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 추가 정보 */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-lg">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold">추가 정보</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid md:grid-cols-3 gap-4 text-center">
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <p className="text-sm text-gray-500 mb-1">터미널</p>
                                    <p className="font-semibold text-slate-700"><FlightExitGate terminalId={flightData.terminalId} /></p>
                                </div>
                                <div className="p-4 bg-indigo-50 rounded-lg">
                                    <p className="text-sm text-gray-500 mb-1">수하물수취대</p>
                                    <p className="font-semibold text-indigo-700">
                                        {'carousel' in flightData ? flightData.carousel : '-'}
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500 mb-1">게이트번호</p>
                                    <p className="font-semibold text-gray-700">{flightData.gateNumber}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FlightInfor;