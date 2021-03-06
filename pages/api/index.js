// eslint-disable-next-line import/named
import { makeRequest } from './requestBuilder';

// eslint-disable-next-line import/prefer-default-export
export const API = {
	get: config =>
		makeRequest(
			{
				method: 'get'
			},
			config
		),
	post: config =>
		makeRequest(
			{
				method: 'post'
			},
			config
		),
	patch: config =>
		makeRequest(
			{
				method: 'patch'
			},
			config
		),
	put: config =>
		makeRequest(
			{
				method: 'put'
			},
			config
		),
	delete: config =>
		makeRequest(
			{
				method: 'delete'
			},
			config
		)
};
