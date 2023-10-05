export function getLatestLog({ queryKey }) {
	const [, id] = queryKey;
	// fetch /getLatest to get the latest log
	return fetch(
		"https://martinyserver.duckdns.org/getLatest" +
			(id === "All" || !id ? "" : `?id=${id}`)
	).then((res) => res.json());
}

export function getLatestImageData({ queryKey }) {
	const [, id] = queryKey;
	// fetch /getLatest to get the latest log
	return fetch(
		"https://martinyserver.duckdns.org/getLatestImageData" +
			(id === "All" || !id ? "" : `?id=${id}`)
	).then((res) => res.json());
}

export function getIds() {
	return fetch("https://martinyserver.duckdns.org/getIds").then((res) =>
		res.json()
	);
}
