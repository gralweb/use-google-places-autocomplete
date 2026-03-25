import { useEffect, useState, useMemo } from "react";

interface UseGoogleMapsScriptOptions {
  apiKey: string;
  libraries?: string[];
}

interface UseGoogleMapsScriptReturn {
  isLoaded: boolean;
  loadError: Error | null;
}

const SCRIPT_ID = "google-maps-script";

let isLoading = false;
let isLoadedGlobal = false;
const loadCallbacks: Array<() => void> = [];
const errorCallbacks: Array<(error: Error) => void> = [];

const loadGoogleMapsScript = (apiKey: string, libraries: string[]) => {
  if (isLoadedGlobal || window.google?.maps) {
    isLoadedGlobal = true;
    return Promise.resolve();
  }

  if (isLoading) {
    return new Promise<void>((resolve, reject) => {
      loadCallbacks.push(resolve);
      errorCallbacks.push(reject);
    });
  }

  const existingScript = document.getElementById(SCRIPT_ID);
  if (existingScript) {
    if (window.google?.maps) {
      isLoadedGlobal = true;
      return Promise.resolve();
    }
    existingScript.remove();
  }

  isLoading = true;

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries.join(",")}&loading=async`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      isLoading = false;
      isLoadedGlobal = true;
      resolve();
      loadCallbacks.forEach((cb) => cb());
      loadCallbacks.length = 0;
      errorCallbacks.length = 0;
    };

    script.onerror = () => {
      isLoading = false;
      const error = new Error("Failed to load Google Maps script");
      reject(error);
      errorCallbacks.forEach((cb) => cb(error));
      loadCallbacks.length = 0;
      errorCallbacks.length = 0;
    };

    document.head.appendChild(script);
  });
};

export const useGoogleMapsScript = ({
  apiKey,
  libraries = ["places"],
}: UseGoogleMapsScriptOptions): UseGoogleMapsScriptReturn => {
  const [isLoaded, setIsLoaded] = useState(
    isLoadedGlobal || !!window.google?.maps,
  );
  const [loadError, setLoadError] = useState<Error | null>(null);

  const librariesString = useMemo(
    () => libraries.join(","),
    [libraries.join(",")],
  );

  useEffect(() => {
    if (!apiKey) {
      setLoadError(new Error("Google Maps API key is required"));
      return;
    }

    if (isLoadedGlobal || window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    loadGoogleMapsScript(apiKey, libraries)
      .then(() => {
        setIsLoaded(true);
      })
      .catch((error) => {
        setLoadError(error);
      });
  }, [apiKey, librariesString]);

  return { isLoaded, loadError };
};
