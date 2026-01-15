export interface Coordinate {
  latitude: number;
  longitude: number;
}

export function haversineDistance(start: Coordinate, end: Coordinate): number {
  const R = 6371e3; // Raio da Terra em [METROS]
  const dLat = (end.latitude - start.latitude) * (Math.PI / 180);
  const dLon = (end.longitude - start.longitude) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(start.latitude * (Math.PI / 180)) *
      Math.cos(end.latitude * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Retorno em [METROS]
}
