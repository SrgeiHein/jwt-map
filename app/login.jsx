// app/login.js
import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    // Simple validation
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://192.168.1.38:8080/login", {
        username,
        password,
      });

      if (response.status === 200) {
        const { access_token, refresh_token } = response.data;

        // Store tokens securely
        await AsyncStorage.setItem("access_token", access_token);
        await AsyncStorage.setItem("refresh_token", refresh_token);

        // Navigate to Home
        router.replace("/home");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Invalid username or password.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.innerContainer}>
        {/* Optional Logo */}
        {/* <Image source={require('./path_to_logo.png')} style={styles.logo} /> */}
        <Text style={styles.title}>Welcome to JWT Maps App</Text>
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="Username"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            if (error) setError("");
          }}
          autoCapitalize="none"
          editable={!loading}
        />
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (error) setError("");
          }}
          secureTextEntry
          editable={!loading}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4A90E2", // Updated background color for visual appeal
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  innerContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 5,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    alignSelf: "center",
    fontWeight: "bold",
    color: "#4A90E2",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
