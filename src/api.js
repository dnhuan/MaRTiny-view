export function getLatestLog({ queryKey }) {
	const [, id] = queryKey;
	// fetch /getLatest to get the latest log
	return fetch(
		"https://martiny.sensableheatscapes.com/getLatest" +
			(id === "All" || !id ? "" : `?id=${id}`)
	).then((res) => res.json());
}

export function getLatestImageData({ queryKey }) {
	const [, id] = queryKey;
	// fetch /getLatest to get the latest log
	return fetch(
		"https://martiny.sensableheatscapes.com/getLatestImageData" +
			(id === "All" || !id ? "" : `?id=${id}`)
	).then((res) => res.json());
}

export function getIds() {
	return fetch("https://martiny.sensableheatscapes.com/getIds").then((res) =>
		res.json()
	);
}
