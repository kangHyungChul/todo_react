'use client';

// import { FlightArrivalItemType } from '../types/flights';

import { useCallback, useEffect, useState } from 'react';
import { fetchFlightTrack } from '../services/flightApi';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
// import type { Map } from '@react-google-maps/api';

interface LatLngLiteral {
    lat: number,
    lng: number
}

const FlightTrackModal = ({ flightId }: { flightId: string }) => {

    // const [flightTrack, setFlightTrack] = useState([]);
    // const [isLoaded, setIsLoaded] = useState(false);
    const [flightTrack, setFlightTrack] = useState<LatLngLiteral | null>(null);

    // Google Maps API 로드 설정
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    });

    const getFlightTrack = useCallback(async () => {
        try {
            const resFlightTrack = await fetchFlightTrack('06a111');
            // 비행 추적 데이터를 가져온 후 지도 로드 상태를 true로 설정
            setFlightTrack({ lat: resFlightTrack.states[0][6], lng: resFlightTrack.states[0][5] });
        } catch (error) {
            console.error('서버에서 비행기 추적 데이터 가져오기 실패:', error);
        }
    }, []);

    useEffect(() => {
        getFlightTrack();
    }, [getFlightTrack]);

    // useEffect(() => {
    //     setIsLoaded(true);
    // }, [mapsLoaded]);

    // onLoad 함수 단순화
    const onLoad = useCallback(() => {
        console.log('mount');
    }, []);

    const onUnmount = useCallback(() => {
        console.log('unmount');
    }, []);

    const handleMarkerClick = () => {
        console.log('marker click');
        alert(`Flight ID: ${flightId} 위치`);
    };

    return (
        <div className="flex flex-col gap-2">
            항공기 위치 - {flightId}
            <div className="aspect-square w-full">
                {isLoaded && flightTrack ? (
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={flightTrack}
                        zoom={10}
                        onLoad={onLoad}
                        onUnmount={onUnmount}
                    >
                        {/* Child components, such as markers, info windows, etc. */}
                        {/* {center.map((item: LatLngLiteral, index: number) => ( */}
                        <Marker
                            position={flightTrack}
                            onClick={handleMarkerClick}
                            title={`Flight ${flightId}`}
                            // 마커가 지도 위에서 더 잘 보이도록 z-index 설정
                            options={{
                                zIndex: 1000,
                                icon: {
                                    path: 'M 0 0 L 30 0 L 30 30 L 0 30 Z',  // 최소한의 투명한 path
                                    scale: 1,  // path를 보이지 않게 설정
                                    labelOrigin: new window.google.maps.Point(15, 15),
                                    fillOpacity: 0,
                                    strokeWeight: 0,
                                    strokeOpacity: 0,
                                },
                                label: {
                                    text: '✈️',
                                    fontSize: '30px',
                                    className: 'cursor-pointer p-0.1 bg-white border-1 border-black rounded-sm',
                                }
                            }}
                        />
                        {/* ))} */}
                    </GoogleMap>
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        {!isLoaded ? '지도를 불러오는 중입니다...' : '비행기 위치를 불러오는 중입니다...'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlightTrackModal;