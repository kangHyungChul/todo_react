// Start of Selection
export const UTCDate = () => {
    const date = new Date();
    date.setHours(date.getUTCHours() + 9);
    return date;
}

// 현재 날짜를 YYYYMMDD 형식으로 반환하는 함수
export const funcNowDate = () => {
    const date = UTCDate();
    // 연도, 월, 일을 각각 추출하여 문자열로 변환
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = date.getDate().toString().padStart(2, '0');
    // YYYYMMDD 형식으로 반환
    return `${year}${month}${day}`;
};

// 현재 시간 반환
// 현재 시간을 HHMM 형식으로 24시간제로 반환하는 함수
export const funcNowTime = () => {
    const date = UTCDate();
    // 시간과 분을 각각 추출하여 문자열로 변환
    const hours = date.getHours().toString().padStart(2, '0'); // 24시간제
    const minutes = date.getMinutes().toString().padStart(2, '0');
    // HHMM 형식으로 반환
    return `${hours}${minutes}`;
};

// 시간을 HHMM타입으로 변환
export const funcTimeToHHMM = (time: string) => {
    return time.replace(':', '');
};

export const funcTimeToHHMMReverse = (time: string) => {
    return time.slice(0, 2) + ':' + time.slice(2);
};

// 현재 시간에 더하기기
// 현재 시간을 HHMM 형식으로 24시간제로 반환하는 함수
export const funcNowTimeAdd = (addTime: number) => {
    // 현재 시간에 특정 분을 더해서 HHMM 형식으로 변환
    const date = UTCDate();
    // 현재 시간에 addTime을 더한 총 분 계산
    const totalMinutes = date.getHours() * 60 + date.getMinutes() + addTime;
    // 총 분을 시간과 분으로 변환
    const hours = Math.floor(totalMinutes / 60).toString().padStart(2, '0'); // 24시간제
    const minutes = (totalMinutes % 60).toString().padStart(2, '0');
    return `${hours}${minutes}`;
};

// 현재 날짜와 시간 반환
export const funcNowDateTime = () => {
    return `${funcNowDate()}${funcNowTime()}`;
};