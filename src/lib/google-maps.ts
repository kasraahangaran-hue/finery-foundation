/// <reference types="@types/google.maps" />
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

export const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ??
  "AIzaSyBsi97LkyVUSMz1si8g9aQ4ebQu2ZeTwsA";

let initialized = false;

function ensureInit() {
  if (initialized) return;
  setOptions({ key: GOOGLE_MAPS_API_KEY, v: "weekly" });
  initialized = true;
}

export async function loadMaps() {
  ensureInit();
  const [maps, places, geocoding, marker] = await Promise.all([
    importLibrary("maps"),
    importLibrary("places"),
    importLibrary("geocoding"),
    importLibrary("marker"),
  ]);
  return { maps, places, geocoding, marker };
}

export const DUBAI_CENTER = { lat: 25.2048, lng: 55.2708 };

export const DUBAI_BOUNDS = {
  north: 25.35,
  south: 24.85,
  east: 55.55,
  west: 54.9,
};

export const FAR_PIN_THRESHOLD_METERS = 500;

export function distanceMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}