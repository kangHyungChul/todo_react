'use client';

// import { FlightArrivalItemType } from '../types/flights';
import { useQuery } from '@tanstack/react-query';
import useModalStore from '@/store/ModalStore';
import { useCallback, useEffect, useMemo } from 'react';
import { fetchFlightTrack } from '../services/flightApi';
import { GoogleMap, useJsApiLoader, OverlayView } from '@react-google-maps/api';
import { toast } from 'sonner';

interface LatLngLiteral {
    lat: number,
    lng: number,
    rotation: number
}

const FlightTrackModal = ({ flightReg, flightId }: { flightReg: string, flightId: string }) => {
    
    // console.log('🔵 [FlightTrackModal] 렌더링 시작, flightReg:', flightReg);

    const closeModal = useModalStore((state) => state.closeModal);

    // const [flightTrack, setFlightTrack] = useState([]);
    // const [isLoaded, setIsLoaded] = useState(false);
    // const [flightTrack, setFlightTrack] = useState<LatLngLiteral | null>(null);

    // Google Maps API 로드 설정
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        // googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        googleMapsApiKey: 'AIzaSyDiXtbbv1lNaJNMmgcyIl6RRb4cirSBSFs',
    });

    const { data: flightTrackData, isFetching, error } = useQuery({
        queryKey: ['flight-tracker', flightReg],
        queryFn: ({ signal }) => {
            // console.log('🟢 [useQuery] queryFn 실행, signal:', signal, 'flightReg:', flightReg);
            return fetchFlightTrack(flightReg, signal);
        },
        staleTime: 1000 * 10, // 10초
        enabled: !!flightReg // flightReg이 있을 때만 쿼리 실행
    });

    // 42번째 줄 위에 추가
    // console.log('🟡 [FlightTrackModal] 상태 체크:', {
    //     isFetching,
    //     hasData: !!flightTrackData,
    //     hasError: !!error,
    //     flightReg
    // });

    const flightTrack = useMemo(() => {
        // flightTrackData나 states가 없거나 빈 배열인 경우 null 반환
        if (!flightTrackData?.states || flightTrackData.states.length === 0) {
            return null;
        }

        const state = flightTrackData.states[0];
        // state가 null이거나 필요한 인덱스가 없는 경우 null 반환
        if (!state || state.length < 11) {
            return null;
        }

        return {
            lat: state[6],
            lng: state[5],
            rotation: Math.round(state[10] - 45)
        } as LatLngLiteral;
    }, [flightTrackData]);

    useEffect(() => {
        // 로딩 중이면 체크하지 않음
        if (isFetching) {
            return;
        }

        // 에러가 발생한 경우 처리
        if (error) {
            toast.error('위치조회가 불가능한 항공기입니다');
            closeModal();
            return;
        }
        
        // 로딩이 완료되었는데 데이터가 없거나 유효하지 않은 경우 처리
        if (!flightTrackData || !flightTrackData.states || flightTrackData.states.length === 0) {
            toast.error('위치조회가 불가능한 항공기입니다');
            closeModal();
        }
    }, [flightTrackData, error, isFetching, closeModal]);

    // const getFlightTrack = useCallback(async() => {
    //     try {
    //         // fetchFlightTrack 호출 시 signal 값 로그 출력
    //         // console.log('fetchFlightTrack 호출 - signal:', controller.signal);

    //         console.log('flightReg:', flightReg);

    //         const resFlightTrack = await fetchFlightTrack(flightReg);
            
    //         console.log('resFlightTrack:', resFlightTrack);

    //         // if(!resFlightTrack || resFlightTrack.path[0][1] === null) {
    //         if(!resFlightTrack || resFlightTrack.states === null) {
    //             alert('위치조회가 불가능한 항공기입니다');
    //             closeModal();
    //             return;
    //         }
    //         // console.log('resFlightTrack:', resFlightTrack.path.length);
    //         // 비행 추적 데이터를 가져온 후 지도 로드 상태를 true로 설정
    //         // setFlightTrack({ lat: resFlightTrack.path[0][1], lng: resFlightTrack.path[0][2], rotation: Math.round(resFlightTrack.path[0][4] - 45) });
    //         setFlightTrack({ lat: resFlightTrack.states[0][6], lng: resFlightTrack.states[0][5], rotation: Math.round(resFlightTrack.states[0][10] - 45) });

    //         // 각도값을 정수로 반올림하고 Tailwind 클래스로 변환
    //         // const degree = Math.round(resFlightTrack.states[0][10]);
    //         // // setFlightDirection(degree);
    //         // console.log('flightDirection:', `rotate-[${degree}deg]`);
    //     } catch (error) {
    //         alert('이미 착륙했거나 위치조회가 불가능한 항공기입니다');
    //         closeModal();
    //         console.error('서버에서 비행기 추적 데이터 가져오기 실패:', error);
    //     }
    // }, [flightReg, closeModal]);

    // useEffect(() => {
    //     getFlightTrack();
    // }, [getFlightTrack]);

    // useEffect(() => {
    //     setIsLoaded(true);
    // }, [mapsLoaded]);

    // onLoad 함수 단순화
    const onLoad = useCallback(() => {
        // console.log('mount');
    }, []);

    const onUnmount = useCallback(() => {
        // console.log('unmount');
    }, []);

    const handleMarkerClick = () => {
        console.log('marker click');
        alert(`Flight ID: ${flightId} 위치`);
    };

    const displayIsLoading = !isFetching && isLoaded;

    return (
        
        <div className={'flex flex-col gap-2'}>
            {`항공기 위치 - ${flightId} / ${flightReg}`}
            <div className="aspect-square w-full">
                {displayIsLoading && flightTrack ? (
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={{ lat: flightTrack.lat, lng: flightTrack.lng }}
                        zoom={12}
                        onLoad={onLoad}
                        onUnmount={onUnmount}
                    >
                        {/* <Marker
                            position={{ lat: flightTrack.lat, lng: flightTrack.lng }}
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
                                    className: `cursor-pointer p-0.1 bg-white border border-black rounded-sm ${flightTrack.rotation}`,
                                }
                            }}
                        /> */}
                        <OverlayView
                            position={{ lat: flightTrack.lat, lng: flightTrack.lng }}
                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        >
                            <div onClick={handleMarkerClick} className={'text-[30px] cursor-pointer border-0'} style={{ transform: `rotate(${flightTrack.rotation}deg)` }}>✈️</div>
                        </OverlayView>
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