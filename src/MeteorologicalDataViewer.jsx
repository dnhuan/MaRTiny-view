import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { getLatestLog } from "./api";

function DataRow({ item, temperatureType }) {
	let d = new Date(item.time);
	let temp = item.Temperature;
	let globeTemp = item.Dallas1;
	let tempLabel = "Air Temperature";
	let globeTempLabel = "Globe Temperature";
	if (temperatureType === "Fahrenheit") {
		temp = (item.Temperature * 9) / 5 + 32; // convert temperature to Fahrenheit
		globeTemp = (item.Dallas1 * 9) / 5 + 32; // convert Globe Temperature to Fahrenheit
		tempLabel = "Air Temperature";
		globeTempLabel = "Globe Temperature";
	}
	return (
		// add border using tailwindcss
		<div className="p-6 border">
			<p>
				{tempLabel}: {temp.toFixed(2)}{" "}
				{temperatureType === "Fahrenheit" ? "°F" : "°C"}
			</p>
			<p>
				{globeTempLabel}: {globeTemp.toFixed(2)}{" "}
				{temperatureType === "Fahrenheit" ? "°F" : "°C"}
			</p>
			<p>Humidity: {item.Humidity}%</p>
			<p>UV Intensity: {item.UV_Intensity}</p>
			<p>Wind Speed: {item.Wind_Speed} m/s</p>
			<p>Time: {d.toLocaleString("en-US", { timeZoneName: "short" })}</p>
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
	const [temperatureType, setTemperatureType] = useState("Celsius"); // default temperature type is Celsius

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

	const handleToggle = () => {
		setTemperatureType(
			temperatureType === "Celsius" ? "Fahrenheit" : "Celsius"
		); // toggle temperature type between Celsius and Fahrenheit
	};

	return (
		<div className="my-6">
			<div className="h-8">
				{showRefetching && (
					<div>
						Refreshing... <i className="fa fa-spinner fa-spin"></i>
					</div>
				)}
			</div>

			<div className="flex justify-end mb-4">
				<label className="mr-2">Celsius</label>
				<div
					className="mr-2 select-none cursor-pointer"
					onClick={handleToggle}
				>
					{temperatureType === "Fahrenheit" ? (
						<i className="fas fa-toggle-on"></i>
					) : (
						<i className="fas fa-toggle-off"></i>
					)}
				</div>
				<label>Fahrenheit</label>
			</div>

			<div>
				{data.map((item) => (
					<DataRow
						key={item._id}
						item={item}
						temperatureType={temperatureType}
					/>
				))}
			</div>
		</div>
	);
}

export default MeteorologicalDataViewer;
