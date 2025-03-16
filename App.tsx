import React, { useEffect, useState, useRef } from "react";
import { AppState, StatusBar, View, ActivityIndicator, Alert, BackHandler } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as LocalAuthentication from "expo-local-authentication";
import * as Notifications from 'expo-notifications';
import AppNavigator from "./src/navigation/AppNavigator";
import useAuthViewModel from "./src/viewmodels/AuthViewModel";
import { navigationRef } from "./src/navigation/navigationRef";
import { CommonActions } from "@react-navigation/native";

const App = () => {
  const { user, loading } = useAuthViewModel(); 
  const [biometricVerified, setBiometricVerified] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const appState = useRef(AppState.currentState);
  const isAuthenticating = useRef(false);

  useEffect(() => {
    handleInitialNotification(); 
    if (!user && !biometricVerified) {
      authenticateUser(); 
    }

    const appStateListener = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active" && !user && !biometricVerified) {
        authenticateUser(); 
      }
      appState.current = nextAppState;
    });

    return () => appStateListener.remove();
  }, [user, biometricVerified]); 

  // Handle app launch from a notification
  const handleInitialNotification = async () => {
    const response = await Notifications.getLastNotificationResponseAsync();
    if (response && response.notification.request.content.data?.navigateTo) {
      const navigateTo = response.notification.request.content.data.navigateTo;
      
      // Delay navigation until the app is fully loaded
      setTimeout(() => {
        if (navigationRef.isReady()) {
          navigationRef.current?.dispatch(
            CommonActions.navigate({ name: navigateTo })
          );
        }
      }, 500);
    }
  };

  const authenticateUser = async () => {
    if (isAuthenticating.current) return;
    isAuthenticating.current = true;

    try {
      const hasBiometricHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasBiometricHardware || !isEnrolled) {
        setBiometricVerified(true); 
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to continue",
        cancelLabel: "Cancel",
        fallbackLabel: "Use PIN",
        disableDeviceFallback: false, 
      });

      if (result.success) {
        setBiometricVerified(true);
        setFailedAttempts(0); 
      } else {
        handleFailedAttempt();
      }
    } catch (error) {
      handleFailedAttempt();
    } finally {
      isAuthenticating.current = false;
    }
  };

  const handleFailedAttempt = () => {
    setFailedAttempts((prev) => prev + 1);

    if (failedAttempts >= 2) {
      Alert.alert(
        "Authentication Required",
        "You need to authenticate to access the app.",
        [
          { text: "Try Again", onPress: authenticateUser },
          {
            text: "Exit",
            onPress: () => BackHandler.exitApp(),
            style: "destructive",
          },
        ]
      );
    } else {
      setTimeout(authenticateUser, 1000);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6bf71f" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar backgroundColor={"white"} barStyle="dark-content" />
        {biometricVerified || user ? <AppNavigator /> : <View style={{ flex: 1, backgroundColor: "white" }} />}
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;