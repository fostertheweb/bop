async function search(query) {
	try {
		return await fetch(`/search?query=${query}&type=track&market=US`);
	} catch (err) {
		console.error(err);
	}
}

export function useSearch() {
	return { search };
}
