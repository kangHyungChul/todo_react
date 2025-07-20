// import { FlightArrivalItemType } from '../types/flights';
import GoogleMapReact from 'google-map-react';

interface MarkerProps {
    lat: number;
    lng: number;
    text: string;
}

const Marker = ({ text }: MarkerProps) => <div className="text-primary rounded-md text-center whitespace-nowrap">{text}</div>;

const FlightTrackModal = ({ flightId }: { flightId: string }) => {
    // console.log(flight);
    const defaultProps = {
        center: { lat: 37.5665, lng: 126.9780 },
        zoom: 15,
    };

    return (
        <div className="flex flex-col gap-2">
            위치추적모달 - {flightId}
            <div className="aspect-square w-full">
                <GoogleMapReact
                    bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string }}
                    defaultCenter={defaultProps.center}
                    defaultZoom={defaultProps.zoom}
                >
                    <Marker
                        lat={defaultProps.center.lat}
                        lng={defaultProps.center.lng}
                        text="My Marker"
                    />
                </GoogleMapReact>
            </div>
        </div>
    );
};

export default FlightTrackModal;