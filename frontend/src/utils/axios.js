import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://contact-book-wk41.vercel.app/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});
