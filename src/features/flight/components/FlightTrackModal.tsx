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
    const [isLoaded, setIsLoaded] = useState(false);
    const [flightTrack, setFlightTrack] = useState<LatLngLiteral>({ lat: 0, lng: 0 });

    // Google Maps API 로드 설정
    const { isLoaded: mapsLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    });

    const getFlightTrack = useCallback(async () => {
        try {
            const resFlightTrack = await fetchFlightTrack();
            console.log('서버에서 가져온 비행기 추적 데이터:', resFlightTrack);
            // setFlightTrack(resFlightTrack);
            // 비행 추적 데이터를 가져온 후 지도 로드 상태를 true로 설정
            setIsLoaded(mapsLoaded);
            setFlightTrack({ lat: resFlightTrack.path[0][1], lng: resFlightTrack.path[0][2] });
        } catch (error) {
            console.error('서버에서 비행기 추적 데이터 가져오기 실패:', error);
        }
    }, [mapsLoaded]);

    useEffect(() => {
        getFlightTrack();
    }, [getFlightTrack]);

    // onLoad 함수 단순화
    const onLoad = useCallback(() => {
        console.log('mount');
    }, []);

    const onUnmount = useCallback(() => {
        console.log('unmount');
    }, []);

    const handleMarkerClick = () => {
        alert(`Flight ID: ${flightId} 위치`);
    };

    if (loadError) {
        return <div>지도를 불러오는데 실패했습니다.</div>;
    }

    return (
        <div className="flex flex-col gap-2">
            항공기 위치 - {flightId}
            <div className="aspect-square w-full">
                {isLoaded ? (
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={flightTrack}
                        zoom={15}
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
                                    path: 'M -1,0 1,0 0,1',  // 최소한의 투명한 path
                                    scale: 0,  // path를 보이지 않게 설정
                                    // labelOrigin: new window.google.maps.Point(0, 0),
                                },
                                label: {
                                    text: '✈️',
                                    fontSize: '30px',
                                    className: 'p-0.1 bg-white border-1 border-black rounded-sm',
                                }
                            }}
                        />
                        {/* ))} */}
                    </GoogleMap>
                ) : (
                    <div className="flex h-full w-full items-center justify-center">지도를 불러오는 중입니다...</div>
                )}
            </div>
        </div>
    );
};

export default FlightTrackModal;