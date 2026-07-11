import axios, { type CreateAxiosDefaults } from "axios";

/**
 * Shared axios instance. Currently unused at runtime — the app persists to
 * localStorage — but wired up so `ServiceBase` requests work the moment
 * `REACT_APP_API_BASE_URL` is set and services switch off localStorage.
 */
const config = <CreateAxiosDefaults>{
	timeout: +process.env.REACT_APP_API_TIMEOUT || 5 * 60 * 1000,
	baseURL: process.env.REACT_APP_API_BASE_URL,
};

const axiosInstance = axios.create(config);

export default axiosInstance;
