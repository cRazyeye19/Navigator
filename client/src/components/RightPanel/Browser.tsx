import { useEffect, useState } from "react";
import {
  DEFAULT_API_URL,
  GET_LIVE_URL_ENDPOINT,
  FETCH_LIVE_URL_ERROR_MESSAGE,
  LIVE_URL_PROPERTY,
} from "../../constants/api";

const Browser = () => {
  const [liveViewUrl, setLiveViewUrl] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
    fetch(`${apiUrl}${GET_LIVE_URL_ENDPOINT}`)
      .then((response) => response.json())
      .then((data) => {
        setLiveViewUrl(data[LIVE_URL_PROPERTY]);
      })
      .catch((error) => {
        console.error(FETCH_LIVE_URL_ERROR_MESSAGE, error);
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
