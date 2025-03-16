import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    StatusBar,
    TouchableOpacity
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import EyeIcon from "../assets/icons/ic_eye_open.svg";
import EyeOffIcon from "../assets/icons/ic_eye_close.svg";
import useAuthViewModel from "../viewmodels/AuthViewModel";
import Toast from "react-native-toast-message";
import PhoneIcon from "../assets/icons/ic_phone.svg";
import GoogleIcon from "../assets/icons/ic_google.svg";
import FacebookIcon from "../assets/icons/ic_facebook.svg";
import SocialLoginButton from "../components/SocialLoginButton"; 

type NavigationProp = StackNavigationProp<RootStackParamList, "SignInScreen">;

const SignInScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { signInWithEmail, signInWithGoogle } = useAuthViewModel();

    const handleEmailSignIn = async () => {
        // Trim inputs
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        // Check for empty fields
        if (!trimmedEmail || !trimmedPassword) {
            Toast.show({
                type: "error",
                text1: "Missing Fields",
                text2: "Email and password are required.",
            });
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            Toast.show({
                type: "error",
                text1: "Invalid Email",
                text2: "Please enter a valid email address.",
            });
            return;
        }

        // Attempt to sign in
        try {
            const user = await signInWithEmail(trimmedEmail, trimmedPassword);
            if (user) {
                Toast.show({
                    type: "success",
                    text1: "Success",
                    text2: "Signed in successfully!",
                });
                navigation.reset({
                    index: 0,
                    routes: [{ name: "BottomTabs" }],
                });
            }
        } catch (error) {
            console.error("Sign-in failed:", error);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const user = await signInWithGoogle();
            if (user) {
                Toast.show({
                    type: "success",
                    text1: "Success",
                    text2: "Google sign-in successful!",
                });
                navigation.reset({
                    index: 0,
                    routes: [{ name: "BottomTabs" }],
                });
            }
        } catch (error) {
            console.error("Google Sign-in failed:", error);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#f0f0f0" barStyle="dark-content" />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    <View style={styles.innerContainer}>
                        <View style={styles.wrapper}>
                            <Text style={styles.title}>Login to Your Account</Text>
                            <View style={styles.formWrapper}>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Email Address"
                                        value={email}
                                        onChangeText={(text) => setEmail(text.trim())}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        placeholder="Password"
                                        value={password}
                                        onChangeText={(text) => setPassword(text.trim())}
                                        secureTextEntry={!showPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                        {showPassword ? <EyeOffIcon width={20} height={20} /> : <EyeIcon width={20} height={20} />}
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={styles.signUpButton} onPress={handleEmailSignIn}>
                                    <Text style={styles.signUpButtonText}>Login</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.loginTxt}>
                                Don't have an account?{" "}
                                <Text style={styles.loginTxtSpan} onPress={() => navigation.navigate('SignUpScreen')}>
                                    Sign Up
                                </Text>
                            </Text>
                            <View style={styles.separator} />

                            <View style={styles.socialLoginWrapper}>
                                {/* Reusable SocialLoginButton for Google */}
                                <SocialLoginButton
                                    icon={<GoogleIcon width={24} height={24} />}
                                    text="Continue with Google"
                                    onPress={handleGoogleSignIn}
                                />

                                {/* Reusable SocialLoginButton for Facebook */}
                                <SocialLoginButton
                                    icon={<FacebookIcon width={24} height={24} />}
                                    text="Continue with Facebook"
                                    onPress={() => {}} // Add your Facebook sign-in logic here
                                />

                                {/* Reusable SocialLoginButton for Phone */}
                                <SocialLoginButton
                                    icon={<PhoneIcon width={23} height={23} />}
                                    text="Continue with Phone Number"
                                    onPress={() => navigation.navigate("OTPVerificationScreen", { phoneNumber: "<USER_PHONE_NUMBER>" })}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
            <Toast />
        </View>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f0f0",
    },
    scrollContainer: {
        flexGrow: 1,
        paddingTop: 20,
        paddingBottom: 30,
        paddingHorizontal: 20,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrapper: {
        width: '100%',
        maxWidth: 450,
        paddingBottom: 30,
        paddingHorizontal: 25,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop: 15,
        marginBottom: 15,
    },
    title: {
        fontSize: 22,
        color: "#333",
        fontWeight: '700',
        letterSpacing: 2.4,
        marginBottom: 25
    },
    formWrapper: {
        width: '100%',
        marginBottom: 20
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: 'gray',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 10,
        height: 50,
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: 'black',
        height: 50,
        paddingVertical: 10,
    },
    passwordInput: {
        flex: 1,
        fontSize: 14,
        color: 'black',
        height: 50,
        paddingVertical: 10,
    },
    eyeIcon: {
        padding: 8,
    },
    signUpButton: {
        backgroundColor: 'blue',
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        height: 50,
    },
    signUpButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white'
    },
    loginTxt: {
        marginTop: 30,
        fontSize: 14,
        color: 'black',
        lineHeight: 24
    },
    loginTxtSpan: {
        color: 'blue',
        fontWeight: '600',
        marginLeft: 5
    },
    separator: {
        height: 1,
        width: '75%',
        backgroundColor: 'gray',
        marginVertical: 20
    },
    socialLoginWrapper: {
        width: '100%',
        alignSelf: 'stretch'
    },
});