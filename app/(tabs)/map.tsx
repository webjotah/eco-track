import React, { useEffect, useState, useRef } from 'react';
import MapView, { Marker, LatLng, Polyline } from 'react-native-maps';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy,
} from 'expo-location';
import Ionicons from '@expo/vector-icons/Ionicons';
import { haversineDistance } from '@/utils/haversine';
import { calculateCarbonEmission } from '@/utils/carbonConversion';
import VehicleSelector from '@/components/vehicle-selector';

export default function MapScreen() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [recording, setRecording] = useState<boolean>(false);
  const [totalMeters, setTotalMeters] = useState<number>(0);
  const [path, setPath] = useState<LatLng[] | []>([]);
  const mapRef = useRef<MapView>(null);
  const recordingRef = useRef(recording);

  async function requestLocationPermission() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const currentPostition = await getCurrentPositionAsync({});
      setLocation(currentPostition);
    }
  }

  function calculateTotalDistance(path: LatLng[]): number {
    let total = 0;
    for (let i = 1; i < path.length; i++) {
      total += Math.abs(haversineDistance(path[i - 1], path[i]));
    }
    return total;
  }

  useEffect(() => {
    recordingRef.current = recording;
  }, [recording]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (response) => {
        setLocation(response);
        mapRef.current?.animateCamera({
          center: response.coords,
          zoom: 18,
        });
        if (recordingRef.current) {
          setPath((prev) => [
            ...prev,
            {
              latitude: response.coords.latitude,
              longitude: response.coords.longitude,
            },
          ]);
        }
      }
    );
  }, []);

  return (
    <View style={styles.container}>
      {location && (
        <>
          <VehicleSelector />
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
            />
            <Polyline
              coordinates={path}
              strokeWidth={10}
              strokeColor="#60f17f"
            />
          </MapView>

          <TouchableOpacity
            style={styles.startTrackingButton}
            onPress={() => {
              if (!recording) {
                setPath([]);
                setTotalMeters(0);
                setRecording(true);
              } else {
                const distance = calculateTotalDistance(path);
                const carbonEmission = calculateCarbonEmission('car', distance);
                setTotalMeters(distance);
                alert(
                  `Distância total percorrida: ${distance.toFixed(2)} metros
                  Carbono emitido: ${carbonEmission.toFixed(2)}kg de CO2`
                );
                setRecording(false);
              }
            }}
          >
            {!recording ? (
              <Ionicons name="play-circle" size={54} color="black" />
            ) : (
              <Ionicons name="pause-circle" size={54} color="black" />
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  startTrackingButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: '-52%' }],
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
});
