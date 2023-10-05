import React from "react";
import { useQuery } from "react-query";
import { getLatestLog } from "./api";

function DataRow({ item }) {
	let d = new Date(item.time);
	return (
		// add border using tailwindcss
		<div className="p-6 border">
			<p>Temperature: {item.Temperature}</p>
			<p>Humidity: {item.Humidity}</p>
			<p>UV Intensity: {item.UV_Intensity}</p>
			<p>Dallas1: {item.Dallas1}</p>
			<p>Dallas2: {item.Dallas2}</p>
			<p>Wind Speed: {item.Wind_Speed}</p>
			<p>Time: {d.toString()}</p>
			<p>MAC: {item.mac}</p>
		</div>
	);
}

function MeteorologicalDataViewer({ id }) {
	const { data, isLoading, isError, dataUpdatedAt } = useQuery(
		["latestLog", id],
		getLatestLog,
		{
			refetchInterval: 2000, // refetch every 2 seconds
		}
	);

	if (isLoading) {
		return <div>loading...</div>;
	}

	if (isError) {
		return <div>error fetching martinyserver</div>;
	}

	return (
		<div className="my-6">
			<div>
				Data last updated at:{" "}
				{new Date(dataUpdatedAt).toLocaleTimeString()}
			</div>

			<div>
				{data.map((item) => (
					<DataRow key={item._id} item={item} />
				))}
			</div>
		</div>
	);
}

export default MeteorologicalDataViewer;
