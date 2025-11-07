// src/lib/api/httpClient.ts
import axios, { AxiosInstance } from 'axios';
import { Logger } from './error/logger';
import { NormalizerOptions, toAppError } from './error-normalizer';
import { ERROR_CODES } from '@/constants/errorCodes';
import { ERROR_MESSAGES } from '@/constants/errorMessages';

export const createHttpClient = (options?: NormalizerOptions): AxiosInstance => {
    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        headers: { 'Content-Type': 'application/json' }
    });

    instance.interceptors.response.use(
        (response) => response,
        async (error) => { 
            const appError = toAppError(error, options);
            await Logger.error(appError);
            throw appError;
        }
    );

    return instance;
};

// 도메인별 기본 인스턴스를 함께 제공
export const httpClient = createHttpClient(); // 기본: SYSTEM

// 항공편 서비스 인스턴스
export const flightHttpClient = createHttpClient({
    fallbackDomain: 'FLIGHT',
    fallbackCode: ERROR_CODES.FLIGHT.DEFAULT_ERROR,
    fallbackMessage: ERROR_MESSAGES[ERROR_CODES.FLIGHT.DEFAULT_ERROR],
    fallbackStatus: 500
});

// 인증 서비스 인스턴스
export const authHttpClient = createHttpClient({
    fallbackDomain: 'AUTH',
    fallbackCode: ERROR_CODES.AUTH.DEFAULT_ERROR,
    fallbackMessage: ERROR_MESSAGES[ERROR_CODES.AUTH.DEFAULT_ERROR],
    fallbackStatus: 500
});