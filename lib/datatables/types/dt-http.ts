export interface DTHttp {
	url: string;
	method: 'post' | 'get';
	headers?: { [key: string]: string };
	data?: { [key: string]: string | number | boolean | object } | null;
}
