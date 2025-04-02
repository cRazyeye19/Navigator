import { useEffect, useState } from "react";

const Browser = () => {
  const [liveViewUrl, setLiveViewUrl] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    fetch(`${apiUrl}/get-live-url`)
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
        <iframe src={liveViewUrl} className="size-full"></iframe>
      ) : (
        <div className="size-full flex flex-col p-4 bg-gray-50 dark:bg-dark-bg-secondary animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-dark-bg-primary rounded mb-4 w-full"></div>
          <div className="flex-1 bg-gray-200 dark:bg-dark-bg-primary rounded"></div>
          <div className="mt-4 flex items-center space-x-2">
            <div className="h-6 bg-gray-200 dark:bg-dark-bg-primary rounded w-1/4"></div>
            <div className="h-6 bg-gray-200 dark:bg-dark-bg-primary rounded w-1/2"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default Browser;
