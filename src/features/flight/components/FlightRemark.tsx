const FlightRemark = ({ remark }: { remark: string }) => {

    const colorMap = {
        '도착': {badge: 'bg-primary-100 text-primary-800 border-primary-200', text: 'text-primary-800'},
        '결항': {badge: 'bg-red-100 text-red-800 border-red-200', text: 'text-red-800'},
        '지연': {badge: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'text-yellow-800'},
        '회항': {badge: 'bg-purple-100 text-purple-800 border-purple-200', text: 'text-purple-800'},
        '착륙': {badge: 'bg-green-100 text-green-800 border-green-200', text: 'text-green-800'}
    };
    const remarkColor = colorMap[remark as keyof typeof colorMap] || {badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', text: 'text-emerald-800'};
    return (
        <>
            {remark && (
                <div className="flex gap-2 items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`w-4 h-4 ${remarkColor.text}`}
                    >
                        <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                        <path d="m9 11 3 3L22 4"></path>
                    </svg>
                    <div
                        className={`inline-flex items-center rounded-full border transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 font-medium text-xs px-2.5 py-1 ${remarkColor.badge}`}
                        data-v0-t="badge"
                    >
                        {/* remark에 따라 색상 변경 */}
                        {remark}
                    </div>
                </div>
            )}
        </>
    );
};

export default FlightRemark;