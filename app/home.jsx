// app/home.js
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import axios from "axios";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const initialRegion = {
    latitude: 37.78957,
    longitude: -122.41255,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  useEffect(() => {
    const initialize = async () => {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Permission to access location was denied."
        );
        setLoading(false);
        return;
      }

      // Fetch locations
      await fetchLocations();
    };

    initialize();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const response = await axios.get("http://192.168.1.38:8080/locations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLocations(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Token might have expired
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Retry fetching locations with new token
          await fetchLocations();
        } else {
          Alert.alert("Session Expired", "Please log in again.");
          router.replace("/login");
        }
      } else {
        Alert.alert("Error", "Failed to fetch locations.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh access token
  const refreshAccessToken = async () => {
    const refreshToken = await AsyncStorage.getItem("refresh_token");
    try {
      const response = await axios.post("http://192.168.1.38:8080/refresh", {
        refresh_token: refreshToken,
      });

      if (response.status === 200) {
        const { access_token, refresh_token } = response.data;
        await AsyncStorage.setItem("access_token", access_token);
        await AsyncStorage.setItem("refresh_token", refresh_token);
        return access_token;
      }
    } catch (error) {
      // Handle token refresh failure
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("refresh_token");
      return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        provider={PROVIDER_GOOGLE}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={location.formattedAddress}
            description={`Place ID: ${location.placeID}`}
            onCalloutPress={() => {
              // Handle marker tap
              Alert.alert(
                "Location Details",
                `Address: ${location.formattedAddress}`
              );
            }}
          />
        ))}
      </MapView>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 50,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
