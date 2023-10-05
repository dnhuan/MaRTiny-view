import React from "react";
import { useQuery } from "react-query";
import { getLatestImageData } from "./api";

function ShadeDataViewer({ id }) {
	const { data: latestImageURL, dataUpdatedAt: imageUpdatedAt } = useQuery(
		["latestImageData", id],
		getLatestImageData,
		{
			refetchInterval: 5000, // refetch every 5 seconds
		}
	);

	return (
		<div className="my-6">
			Image last updated at:{" "}
			{new Date(imageUpdatedAt).toLocaleTimeString()}
			{latestImageURL && <img src={latestImageURL} alt="Latest Image" />}
		</div>
	);
}

export default ShadeDataViewer;
