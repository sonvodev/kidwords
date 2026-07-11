import axios from "@/utils/plugins/axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

export class ServiceBase {
	protected async getAsync<TResult, TParam = unknown>(
		path: string,
		params?: TParam,
		config?: AxiosRequestConfig,
	): Promise<TResult> {
		return axios
			.get<TResult>(path, { ...config, params })
			.then((response) => response.data || (response as any))
			.catch((err) => Promise.reject(err));
	}

	protected async getAsyncWithPagination<TResult, TParam = unknown>(
		path: string,
		params?: TParam,
		config?: AxiosRequestConfig,
	): Promise<AxiosResponse<TResult>> {
		return axios.get<TResult>(path, { ...config, params });
	}

	protected async postAsync<TResult, TBody = unknown>(
		path: string,
		body?: TBody,
		config?: AxiosRequestConfig,
	): Promise<TResult> {
		return axios
			.post<TResult>(path, body, config)
			.then((response) => response.data)
			.catch((err) => Promise.reject(err));
	}

	protected async putAsync<TResult, TBody = unknown>(
		path: string,
		body?: TBody,
		config?: AxiosRequestConfig,
	): Promise<TResult> {
		return axios
			.put<TResult>(path, body, config)
			.then((response) => response.data || (response as any))
			.catch((err) => Promise.reject(err));
	}

	protected async deleteAsync<TResult, TBody = unknown>(
		path: string,
		body?: TBody,
		config?: AxiosRequestConfig,
	): Promise<TResult> {
		return axios
			.delete<TResult>(path, { ...config, data: body })
			.then((response) => response.data || (response as any))
			.catch((err) => Promise.reject(err));
	}

	protected async patchAsync<TResult, TBody = unknown>(
		path: string,
		body?: TBody,
		config?: AxiosRequestConfig,
	): Promise<TResult> {
		return axios
			.patch<TResult>(path, body, config)
			.then((response) => response.data || (response as any))
			.catch((err) => Promise.reject(err));
	}
}
