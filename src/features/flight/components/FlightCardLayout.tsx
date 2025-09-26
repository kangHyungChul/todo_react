'use client';

import { memo } from 'react';

// import { FlightArrivalItemType } from '../types/flights';

const FlightCardLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <li className={'w-full p-6 shadow-sm bg-white/80 rounded-b-md'}>
            {children}
        </li>
    );
};

export default memo(FlightCardLayout);