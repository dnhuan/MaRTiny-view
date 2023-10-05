import React from "react";
import { useQuery } from "react-query";
import { useAtom } from "jotai";
import { idAtom } from "./atom";
import { getIds } from "./api";
import ShadeDataViewer from "./ShadeDataViewer";
import MeteorologicalDataViewer from "./MeteorologicalDataViewer";

function App() {
	const [id, setId] = useAtom(idAtom);

	const {
		data: ids,
		isLoading,
		isError,
	} = useQuery(["getIds"], getIds, {
		retry: false,
		onCompleted: () => {
			setId(ids[0]);
		},
	});

	if (isLoading) {
		return (
			<div className="flex flex-col m-6 p-6">Loading device list...</div>
		);
	}

	if (isError) {
		return (
			<div className="flex flex-col m-6 p-6">
				Error loading device list
			</div>
		);
	}

	return (
		<div className="flex flex-col m-6 p-6">
			<select
				className="mx-auto my-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-1 py-1 inline-flex items-center"
				onChange={(e) => {
					setId(e.target.value);
				}}
				value={id}
			>
				{ids.map((id) => (
					<option key={id} value={id}>
						{id}
					</option>
				))}
			</select>
			<ShadeDataViewer id={id} />
			<MeteorologicalDataViewer id={id} />
		</div>
	);
}

export default App;
