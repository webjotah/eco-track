import React, { useEffect, useState, useRef } from 'react';
import MapView, { Marker, LatLng, Polyline } from 'react-native-maps';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy,
} from 'expo-location';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function MapScreen() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [recording, setRecording] = useState<boolean>(false);
  const [path, setPath] = useState<LatLng[] | []>([]);
  const mapRef = useRef<MapView>(null);

  async function requestLocationPermission() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const currentPostition = await getCurrentPositionAsync({});
      setLocation(currentPostition);
    }
  }

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.High,
        timeInterval: 1000,
        distanceInterval: 10,
      },
      (response) => {
        setLocation(response);
        mapRef.current?.animateCamera({
          center: response.coords,
          zoom: 18,
        });
        if (recording) {
          //arrumar bug path gravando mesmo com o recording false

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
  }, [recording]);

  return (
    <View style={styles.container}>
      {location && (
        <>
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
            <Polyline coordinates={path} strokeWidth={10} strokeColor="black" />
          </MapView>

          <TouchableOpacity
            style={styles.startTrackingButton}
            onPress={() => {
              if (!recording) {
                setPath([]);
                setRecording(true);
              } else {
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
