import { useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";

export const useOTPVerificationViewModel = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [confirmation, setConfirmation] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "OTPVerificationScreen">>();

  /** Helper function to send OTP */
  const sendOTP = async (phoneNumber: string) => {
    try {
      const confirmationResult = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirmation(confirmationResult);
      alert("OTP Sent Successfully!");
    } catch (error) {
      console.error("Send OTP Error:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };

  /** Verify the Entered OTP */
  const verifyOTP = async () => {
    if (otp.length !== 6 || !confirmation) {
      alert("Invalid OTP. Please enter a 6-digit OTP.");
      return;
    }
  
    setIsLoading(true);
    try {
      await confirmation.confirm(otp);
      setIsVerified(true);
      setShowSuccessPopup(true);
  
      // Navigate to HomeScreen after 2 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigation.reset({
          index: 0,
          routes: [{ name: "BottomTabs" as keyof RootStackParamList }],
        });
      }, 2000);
    } catch (error) {
      console.error("OTP Verification Error:", error);
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  /** Resend OTP to Phone Number */
  const resendOTP = async (phoneNumber: string) => {
    try {
      const confirmationResult = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirmation(confirmationResult);
      alert("OTP Resent Successfully!");
    } catch (error) {
      console.error("Resend OTP Error:", error);
      alert("Failed to resend OTP. Please try again.");
    }
  };

  return {
    otp,
    setOtp,
    verifyOTP,
    resendOTP,
    sendOTP,
    isLoading,
    isVerified,
    showSuccessPopup,
    showErrorPopup,
    setShowSuccessPopup,
    setShowErrorPopup,
  };
};