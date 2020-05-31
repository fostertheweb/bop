export function useFetch(baseUrl, options) {
	async function get(path) {
		const url = baseUrl + path;
		const response = await fetch(url, options);
		return await response.json();
	}

	async function post(path, body) {
		const url = baseUrl + path;
		const response = await fetch(url, {
			...options,
			method: "POST",
			body: JSON.stringify(body),
		});
		return await response.json();
	}

	async function put(path, body) {
		const url = baseUrl + path;
		const response = await fetch(url, {
			...options,
			method: "PUT",
			body: JSON.stringify(body),
		});
		return await response.json();
	}

	async function patch(path, body) {
		const url = baseUrl + path;
		const response = await fetch(url, {
			...options,
			method: "PATCH",
			body: JSON.stringify(body),
		});
		return await response.json();
	}

	async function _delete(path) {
		const url = baseUrl + path;
		const response = await fetch(url, { ...options, method: "DELETE" });
		return await response.json();
	}

	return { get, post, put, patch, delete: _delete };
}
