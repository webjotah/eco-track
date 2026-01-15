export type VehicleType = 'car' | 'bus' | 'motorbike' | 'train';

export const carbonEmissionFactors: Record<VehicleType, number> = {
  car: 0.192, // kg/km
  bus: 0.105,
  motorbike: 0.103,
  train: 0.041,
};

export function calculateCarbonEmission(
  vehicleType: VehicleType,
  distanceInMeters: number
): number {
  const factor = carbonEmissionFactors[vehicleType];
  const distanceInKm = distanceInMeters / 1000;
  return factor * distanceInKm;
}
