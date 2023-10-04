import { useQuery } from "react-query";

function getLatestLog() {
  // fetch /getLatest to get the latest log
  return fetch("https://martinyserver.duckdns.org/getLatest").then((res) =>
    res.json()
  );
}

async function getLatestImage() {
  const response = await fetch(
    "https://martinyserver.duckdns.org/lastModifiedImage"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch latest image");
  }
  const blob = await response.blob();
  const imageURL = URL.createObjectURL(blob);
  return imageURL;
}

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

function App() {
  const { data, isLoading, isError, dataUpdatedAt } = useQuery(
    "latestLog",
    getLatestLog,
    {
      refetchInterval: 2000, // refetch every 2 seconds
    }
  );

  const { data: latestImageURL, dataUpdatedAt: imageUpdatedAt } = useQuery(
    "latestImage",
    getLatestImage,
    {
      refetchInterval: 5000, // refetch every 2 seconds
    }
  );

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (isError) {
    return <div>error fetching martinyserver</div>;
  }

  return (
    <div className="m-6 p-6">
      <div>
        Data last updated at: {new Date(dataUpdatedAt).toLocaleTimeString()}
      </div>
      <div>
        Image last updated at: {new Date(imageUpdatedAt).toLocaleTimeString()}
      </div>
      {latestImageURL && <img src={latestImageURL} alt="Latest Image" />}
      <div>
        {data.map((item) => (
          <DataRow key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default App;
