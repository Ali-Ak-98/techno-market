import axios from 'axios';
import React from 'react';

const getAPI = () => ({
	base: `${process.env.BASE_URL}`,
	api: `${process.env.API_URL}`
});

const buildRequest = (request, configData) => {
	const { method } = request;
	const { url, body, apiVersion, responseType } = configData;
	const api = getAPI();
	const contentType = body instanceof FormData ? 'multipart/form-data' : 'application/json';
	const headers = {
		'content-type': contentType,
	};
	const apiUrl = api[apiVersion];
	console.log(process.env)

	return {
		baseURL: apiUrl,
		data: body,
		headers,
		method,
		url,
		responseType
	};
};

export const defaultResponse = {
	status: 500,
	data: {
		error: 'Server error'
	}
};

export const formatError = responseError => {
	const response = responseError.response || defaultResponse;
	const errors = response.data.message;
	return {
		code: response.status,
		message: errors
	};
};

export const makeRequest = async (request, configData) => {
	const requestConfig = buildRequest(request, configData);
	const axiosInstance = axios.create(requestConfig);
	axiosInstance.defaults.withCredentials = true;

	let retryCounter = 0;

	// Do staff before request send
	axiosInstance.interceptors.request.use(
		req => {
			return req;
		},
		error => {
			return Promise.reject(error);
		}
	);

	// Do staff after request send
	axiosInstance.interceptors.response.use(
		response => {
			return Promise.resolve(response);
		},
		error => {
			const formattedError = formatError(error);

			if (formattedError.code < 500) {
			} else {
				// eslint-disable-next-line no-lonely-if
				if (error.config && (typeof error.config.retryCount === 'undefined' || error.config.retryCount < 2)) {
					retryCounter += 1;
					return axiosInstance.request({
						...error.config,
						retryCount: retryCounter
					});
				}
			}
			return Promise.reject(formattedError);
		}
	);

	// call request due to methode and return response as a Promise
	return new Promise((resolve, reject) => {
		switch (request.method) {
			case 'post':
				axiosInstance
					.post(configData.url, requestConfig.data)
					.then(res => {
						resolve(res);
					})
					.catch(error => {
						reject(error);
					});
				break;
			case 'patch':
				axiosInstance
					.patch(configData.url, requestConfig.data)
					.then(res => {
						resolve(res);
					})
					.catch(error => {
						reject(error);
					});
				break;
			case 'put':
				axiosInstance
					.put(configData.url, requestConfig.data)
					.then(res => {
						resolve(res);
					})
					.catch(error => {
						reject(error);
					});
				break;
			case 'delete':
				axiosInstance
					.delete(configData.url, requestConfig.data)
					.then(res => {
						resolve(res);
					})
					.catch(error => {
						reject(error);
					});
				break;
			default:
				axiosInstance
					.get(configData.url, requestConfig.data)
					.then(res => {
						resolve(res);
					})
					.catch(error => {
						reject(error);
					});
				break;
		}
	});
};
