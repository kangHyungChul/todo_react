'use client';

// import { FlightArrivalItemType } from '../types/flights';

import { useCallback, useState, useEffect } from 'react';
import { fetchFlightTrack } from '../services/flightApi';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'

const FlightTrackModal = ({ flightId }: { flightId: string }) => {

    const [flightTrack, setFlightTrack] = useState([]);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    });

    const center = [
        { lat: -31.56391, lng: 147.154312 }
    ];

    const [map, setMap] = useState(null);

    // onLoad 함수 단순화
    const onLoad = useCallback((map: any) => {
        setMap(map)
    }, [])

    const onUnmount = useCallback((map: any) => {
        setMap(null)
    }, [])

    const handleMarkerClick = () => {
        alert(`Flight ID: ${flightId} 위치`);
    };

    const getFlightTrack = async () => {
        try {
            const resFlightTrack = await fetchFlightTrack();
            console.log('서버에서 가져온 비행기 추적 데이터:', resFlightTrack);
            // setFlightTrack(resFlightTrack);
        } catch (error) {
            console.error('서버에서 비행기 추적 데이터 가져오기 실패:', error);
        }
    };

    useEffect(() => {
        getFlightTrack();
    }, []);

    return (
        <div className="flex flex-col gap-2">
            항공기 위치 - {flightId}
            <div className="aspect-square w-full">
                {isLoaded && (
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={center[0]}
                        zoom={15}
                        onLoad={onLoad}
                        onUnmount={onUnmount}
                    >
                        {/* Child components, such as markers, info windows, etc. */}
                        {center.map((item: any, index: number) => (
                            <Marker
                                key={index}
                                position={item}
                                onClick={handleMarkerClick}
                                title={`Flight ${flightId}`}
                                // 마커가 지도 위에서 더 잘 보이도록 z-index 설정
                                options={{
                                    zIndex: 1000,
                                    icon: {
                                        path: window.google.maps.SymbolPath.CIRCLE,
                                        scale: 10,
                                        // 라벨의 위치를 마커 위에 설정
                                        labelOrigin: new window.google.maps.Point(0, 3),
                                    },
                                    label: {
                                        text: `Flight ${flightId}`,
                                        color: 'white',
                                        className: 'bg-primary p-1 rounded-sm'
                                    }
                                }}
                            />
                        ))}
                    </GoogleMap>
                )}
            </div>
        </div>
    );
};

export default FlightTrackModal;