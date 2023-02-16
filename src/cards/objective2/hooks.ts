import { useLocalStorage } from "usehooks-ts";

export function useLatitude(): {
  latitude: number;
  setLatitude: (value: number) => void;
} {
  const [latitude, setLatitude] = useLocalStorage("objective2-latitude", 0);
  return { latitude, setLatitude };
}

export function useReturnPointLatitude(): {
  returnPointLatitude: number;
  setReturnPointLatitude: (value: number) => void;
} {
  const [returnPointLatitude, setReturnPointLatitude] = useLocalStorage(
    "return-point-latitude",
    0
  );
  return { returnPointLatitude, setReturnPointLatitude };
}

export function useLongitude(): {
  longitude: number;
  setLongitude: (value: number) => void;
} {
  const [longitude, setLongitude] = useLocalStorage("objective2-longitude", 0);
  return { longitude, setLongitude };
}

export function useReturnPointLongitude(): {
  returnPointLongitude: number;
  setReturnPointLongitude: (value: number) => void;
} {
  const [returnPointLongitude, setReturnPointLongitude] = useLocalStorage(
    "return-point-longitude",
    0
  );
  return { returnPointLongitude, setReturnPointLongitude };
}
export function useAngle(): {
  angle: number;
  setAngle: (value: number) => void;
} {
  const [angle, setAngle] = useLocalStorage("objective2-angle", 90);
  return { angle, setAngle };
}

export function useElevation(): {
  elevation: number;
  setElevation: (value: number) => void;
} {
  const [elevation, setElevation] = useLocalStorage("objective2-elevation", 0);
  return { elevation, setElevation };
}

export function useSpeed(): {
  speed: number;
  setSpeed: (value: number) => void;
} {
  const [speed, setSpeed] = useLocalStorage("objective2-speed", 2);
  return { speed, setSpeed };
}

export function useDistance(): {
  distance: number;
  setDistance: (value: number) => void;
} {
  const [distance, setDistance] = useLocalStorage("objective2-distance", 30);
  return { distance, setDistance };
}

export function useAzimuth(): {
  azimuth: number;
  setAzimuth: (value: number) => void;
} {
  const [azimuth, setAzimuth] = useLocalStorage("objective2-azimuth", 0);
  return { azimuth, setAzimuth };
}

export function useLength(): {
  length: number;
  setLength: (value: number) => void;
} {
  const [length, setLength] = useLocalStorage("objective2-length", 100);
  return { length, setLength };
}
