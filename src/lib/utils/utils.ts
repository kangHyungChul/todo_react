import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};

export const parseSearchParams = (searchParams: object) => {
    const searchParamsString = Object.entries(searchParams)
        .filter(([, value]) => value !== undefined && value !== '')
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)) // key를 알파벳 순으로 정렬
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
        .join('&');

    return searchParamsString;
};