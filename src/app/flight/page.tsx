import type { Metadata } from 'next';
import FlightSection from '@/features/flight/FlightSection';
export const metadata: Metadata = {
    title: 'Flight',
    description: 'Flight',
};

const Flight = async({ searchParams } : { searchParams: Promise<{ searchDate?: string, searchFrom?: string, searchTo?: string, pageNo?: string, numOfRows?: string }> }) => {

    const parsedParams = await searchParams;

    return (
        <>
            <FlightSection parsedParams={parsedParams} />
        </>
    );
};

export default Flight;