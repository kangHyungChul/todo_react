// 로컬스토리지 기능 묶음 (제네릭타입)
// <T>: 제네릭데이터 (다양한 타입의 데이터를 저장할 수 있음)

// 저장
// key: 저장할 데이터의 키
// data: 저장할 데이터(타입무관)
export const saveToStorage = <T>(key: string, data: T): void => {
    // JSON.stringify: 객체를 문자열로 변환 (localStorage는 문자열만 저장가능)
    localStorage.setItem(key, JSON.stringify(data));
};

// 불러오기
// key: 불러올 데이터의 키
export const loadFromStorage = <T>(key: string): T | null => {
    // localStorage.getItem: 키에 해당하는 데이터를 문자열로 불러옴
    const raw = localStorage.getItem(key);
    // JSON.parse: 문자열을 객체로 변환 (T타입으로 형변환)
    return raw ? (JSON.parse(raw) as T) : null;
};