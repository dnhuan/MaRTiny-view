import React, { useState, useEffect } from "react";
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
	const { data, isLoading, isError, isRefetching } = useQuery(
		["latestLog", id],
		getLatestLog,
		{
			refetchInterval: 5000, // refetch every 5 seconds
		}
	);

	const [showRefetching, setShowRefetching] = useState(false);

	useEffect(() => {
		if (isRefetching) {
			setShowRefetching(true);
			setTimeout(() => {
				setShowRefetching(false);
			}, 1000);
		}
	}, [isRefetching]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error fetching data</div>;
	}

	return (
		<div className="my-6">
			<div className="h-8">
				{showRefetching && (
					<div>
						Refreshing... <i className="fa fa-spinner fa-spin"></i>
					</div>
				)}
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
