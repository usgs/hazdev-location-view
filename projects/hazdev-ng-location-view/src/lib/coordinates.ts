export interface Coordinates {
  confidence: number;
  latitude: number;
  longitude: number;
  method: string; // geocode, geolocate, pin, lat/lng
  name: string; // geolocate
  zoom: number; // based on confidence
}
