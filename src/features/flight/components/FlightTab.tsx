'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const FlightTab = () => {
    const pathname = usePathname();

    const tabList = [
        {
            href: '/flight/arrival',
            label: '도착조회',
        },
        {
            href: '/flight/departure',
            label: '출발조회',
        },
    ];

    const setTabStyle = (isActive: boolean) => {
        return isActive ? 'bg-primary-100 text-primary-700 hover:bg-primary-200 border border-primary-200' : 'bg-white hover:bg-gray-100 border border-gray-200';
    };
    console.log('pathname:', pathname);

    return (
        <ul className="flex gap-4 text-center">
            {tabList.map((tab) => (
                <li className="flex-1" key={tab.href}>
                    <Link href={tab.href} className={`block p-2 rounded-md ${setTabStyle(pathname === tab.href)}`}>{tab.label}</Link>
                </li>
            ))}
        </ul>
    );
};

export default FlightTab;