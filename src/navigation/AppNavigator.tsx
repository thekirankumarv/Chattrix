import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import WelcomeScreen from "../screens/WelcomeScreen";
import SignUpScreen from "../screens/SignUpScreen";
import SignInScreen from "../screens/SignInScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import OTPVerificationScreen from "../screens/OtpVerificationScreen";
import ChatScreen from "../screens/ChatScreen";
import { UserModel } from "../model/UserModel";
import * as Linking from 'expo-linking';
import { navigationRef } from './navigationRef'; 

export type RootStackParamList = {
  WelcomeScreen: undefined;
  SignUpScreen: undefined;
  SignInScreen: undefined;
  BottomTabs: undefined;
  OTPVerificationScreen: { phoneNumber: string };
  ChatScreen: { user: UserModel };
};

const prefix = Linking.createURL('/');

const linking = {
  prefixes: [prefix],
  config: {
    screens: {
      WelcomeScreen: 'welcome',
      SignUpScreen: 'signup',
      SignInScreen: 'signin',
      BottomTabs: 'home',
      OTPVerificationScreen: 'verify',
      ChatScreen: 'chat/:userId',
    },
  },
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <Stack.Navigator initialRouteName="WelcomeScreen" id={undefined}>
        <Stack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignInScreen"
          component={SignInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BottomTabs"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="OTPVerificationScreen"
          component={OTPVerificationScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
