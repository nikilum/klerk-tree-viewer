import axios from 'axios';

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class HttpClientSingleton {
	private static instance: HttpClientSingleton = new HttpClientSingleton();
	private axiosInstance: AxiosInstance = axios.create({
		baseURL: import.meta.env.VITE_API_URL,
	});

	constructor() {
		return HttpClientSingleton.instance;
	}

	public static get<ResponseDataType>(
		uri: string,
		config: AxiosRequestConfig = {},
	): Promise<AxiosResponse<ResponseDataType, any>> {
		return new HttpClientSingleton().axiosInstance.get(uri, config);
	}
}

export { HttpClientSingleton };
