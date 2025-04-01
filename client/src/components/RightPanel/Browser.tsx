import { useEffect, useState } from "react";

const Browser = () => {
  const [liveViewUrl, setLiveViewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/get-live-url")
      .then((response) => response.json())
      .then((data) => {
        setLiveViewUrl(data.live_url);
      })
      .catch((error) => {
        console.error("Error fetching live view URL:", error);
      });
  }, []);

  return (
    <>
      {liveViewUrl ? (
        <iframe
          src={liveViewUrl}
          className="size-full"
        ></iframe>
      ) : (
        <p>Loading live view...</p>
      )}
    </>
  );
};

export default Browser;
