const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

export function useLogin() {
	return async function (query) {
		const response = await fetch(`${API_BASE_URL}/login`, {
			method: "POST",
			body: JSON.stringify(query),
			headers: {
				"Content-Type": "application/json",
			},
		});
		return await response.json();
	};
}
