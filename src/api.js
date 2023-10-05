export function getLatestLog({ queryKey }) {
	const [, id] = queryKey;
	// fetch /getLatest to get the latest log
	return fetch(
		"https://martinyserver.duckdns.org/getLatest" +
			(id === "All" ? "" : `?id=${id}`)
	).then((res) => res.json());
}

export async function getLatestImageData({ queryKey }) {
	const [, id] = queryKey;
	const response = await fetch(
		"https://martinyserver.duckdns.org/lastModifiedImage" +
			(id === "All" ? "" : `?id=${id}`)
	);
	if (!response.ok) {
		throw new Error("Failed to fetch latest image");
	}
	const blob = await response.blob();
	const imageURL = URL.createObjectURL(blob);
	return imageURL;
}

export function getIds() {
	return fetch("https://martinyserver.duckdns.org/getIds").then((res) =>
		res.json()
	);
}
