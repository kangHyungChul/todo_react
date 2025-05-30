const fetchFlights = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
};

const FlightSection = async() => {

    await fetchFlights();

    return (
        <div className="mb-1 text-center text-2xl">
            <h2>항공편 목록</h2>
            {/* <ul>
                {flights?.map((flight, index) => (
                    <li key={index}>{flight}</li>
                ))}
            </ul> */}
        </div>
    );
};

export default FlightSection;
