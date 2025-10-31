'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { fetchFlightInfor } from '../services/flightApi';

const FlightLogo = ({ flightId }: { flightId: string }) => {
    // IATA 항공사 코드 추출    
    const flightCode = flightId.slice(0, 2);
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const data = await fetchFlightInfor(flightCode);
    //         console.log('data11:', data.items[0].airlineImage);
    //     };
    //     fetchData();
    // }, [flightCode]);
    const { data, isLoading } = useQuery({
        queryKey: ['flightInfor', flightCode],
        queryFn: () => fetchFlightInfor(flightCode),
        enabled: !!flightCode, // flightCode가 있을 때만 실행
        // initialData: null,
        staleTime: (1000 * 60) * 60, // 60분
        gcTime: (1000 * 60) * 60, // 60분
    });

    // 그리고 렌더 부분도 수정
    if (isLoading) {
        return <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>;
    }

    if (!data || !data.items || data.items.length === 0) {
        return <div className="flex justify-center items-center w-20 h-8 text-sm bg-gray-200 rounded">{flightCode}</div>;
    }

    const airlineImage = data.items[0].airlineImage;
    return (
        <div className="py-1 w-20">
            <Image src={airlineImage} alt={flightCode} width={100} height={44} className="w-full h-auto" loading="lazy" />
        </div>
    );
};

export default FlightLogo;