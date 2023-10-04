import React, { useState } from "react";
import { useQuery } from "react-query";
import DataViewer from "./DataViewer";

function getIds() {
  return fetch("https://martinyserver.duckdns.org/getIds").then((res) =>
    res.json()
  );
}

function App() {
  const [id, setId] = useState("All");

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
    return <div className="flex flex-col m-6 p-6">Loading device list...</div>;
  }

  if (isError) {
    return (
      <div className="flex flex-col m-6 p-6">Error loading device list</div>
    );
  }

  return (
    <div className="flex flex-col m-6 p-6">
      <select
        className="mx-auto my-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
        onChange={(e) => {
          setId(e.target.value);
        }}
        value={id}
      >
        <option key="All" value="All">
          All
        </option>
        {ids.map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>
      <DataViewer id={id} />
    </div>
  );
}

export default App;
