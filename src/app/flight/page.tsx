import type { Metadata } from 'next';
import FlightSection from '@/features/flight/FlightSection';
export const metadata: Metadata = {
    title: 'Flight',
    description: 'Flight',
};

const Flight = () => {

    return (
        <>
            <FlightSection />
        </>
    );
};

export default Flight;