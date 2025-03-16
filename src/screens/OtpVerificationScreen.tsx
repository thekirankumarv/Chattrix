import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ToastAndroid,
} from "react-native";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator"; 

const OTPVerificationScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const inputRefs = useRef([]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (isResendDisabled) {
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isResendDisabled]);

  const handleOTPChange = (text, index) => {
    const newOtp = otp.split("");
    newOtp[index] = text;
    setOtp(newOtp.join(""));

    if (text && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleBackspace = (text, index) => {
    if (!text && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSendOTP = () => {
    if (phoneNumber !== "9876543210") {
      ToastAndroid.show("Invalid phone number!", ToastAndroid.SHORT);
      return;
    }
    ToastAndroid.show("OTP sent successfully!", ToastAndroid.SHORT);
    setShowOtpScreen(true);
  };

  const handleOTPVerification = () => {
    if (otp === "654321") {
      setShowSuccessPopup(true);
    } else {
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 2000);
    }
  };

  const handleAnimationFinish = () => {
    setShowSuccessPopup(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "BottomTabs" }], 
    });
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/lottie/otp_verification.json")}
        autoPlay
        loop
        style={styles.lottie}
      />
      {!showOtpScreen ? (
        <>
          <Text style={styles.title}>Enter Phone Number</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            maxLength={10}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="9876543210"
          />
          <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>Enter OTP</Text>
          <View style={styles.otpContainer}>
            {[...Array(6)].map((_, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={otp[index] || ""}
                onChangeText={(text) => handleOTPChange(text, index)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Backspace") {
                    handleBackspace(otp[index], index);
                  }
                }}
              />
            ))}
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={handleOTPVerification}
          >
            <Text style={styles.buttonText}>Submit OTP</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsResendDisabled(true)}
            style={[styles.resendButton, isResendDisabled && { opacity: 0.5 }]}
          >
            <Text style={styles.resendText}>
              {isResendDisabled ? `Resend in ${resendTimer}s` : "Resend OTP"}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* Success Popup */}
      <Modal visible={showSuccessPopup} transparent animationType="fade">
        <View style={styles.popupContainer}>
          <View style={styles.popup}>
            <LottieView
              source={require("../assets/lottie/otp_verified.json")}
              autoPlay
              loop={false}
              style={styles.popupLottie}
              onAnimationFinish={handleAnimationFinish}
            />
            <Text style={styles.popupText}>OTP Verified Successfully!</Text>
          </View>
        </View>
      </Modal>

      {/* Failure Popup */}
      <Modal visible={showErrorPopup} transparent animationType="fade">
        <View style={styles.popupContainer}>
          <View style={styles.popup}>
            <LottieView
              source={require("../assets/lottie/otp_failed.json")}
              autoPlay
              loop={false}
              style={styles.popupLottie}
            />
            <Text style={styles.popupText}>Incorrect OTP! Try Again.</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default OTPVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  lottie: { width: 180, height: 180 },
  title: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  input: {
    borderWidth: 1,
    width: "80%",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4df9b1",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  otpInput: {
    borderWidth: 1,
    width: 40,
    height: 40,
    textAlign: "center",
    fontSize: 20,
    margin: 5,
    borderRadius: 5,
  },
  resendButton: { marginTop: 10 },
  resendText: { color: "#4df9b1" },
  popupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popup: {
    width: 250,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  popupLottie: { width: 100, height: 100 },
  popupText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
});