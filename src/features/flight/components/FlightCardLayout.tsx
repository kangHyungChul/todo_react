'use client';

import { cn } from '@/lib/utils/utils';

// import { FlightArrivalItemType } from '../types/flights';

const FlightCardLayout = ({ codeshare = 'Master', children }: { codeshare?: string, children: React.ReactNode }) => {

    return (
        <li className={cn('p-4 border border-gray-300 rounded-lg flex flex-col items-center', codeshare === 'Slave' ? ' bg-gray-100 border-t-0 -mt-4' : '')}>
            {children}
        </li>
    );
};

export default FlightCardLayout;