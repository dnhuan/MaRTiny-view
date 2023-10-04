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
    staleTime: 1000 * 60 * 60, // 1 hour
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
        className="mx-auto"
        onChange={(e) => {
          setId(e.target.value);
        }}
        value={ids[0]}
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
