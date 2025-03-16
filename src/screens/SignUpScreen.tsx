import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  TextInput, 
  TouchableWithoutFeedback, 
  Keyboard,
  ScrollView,
  StatusBar
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import EyeIcon from "../assets/icons/ic_eye_open.svg";
import EyeOffIcon from "../assets/icons/ic_eye_close.svg";
import useAuthViewModel from "../viewmodels/AuthViewModel";
import Toast from "react-native-toast-message";

type NavigationProp = StackNavigationProp<RootStackParamList, "SignUpScreen">;

const SignUpScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { signUpWithEmail } = useAuthViewModel();

    const handleSignUp = async () => {
        // Trim all inputs
        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        const trimmedConfirmPassword = confirmPassword.trim();

        // Check for empty fields
        if (!trimmedUsername || !trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
            Toast.show({
                type: "error",
                text1: "Missing Fields",
                text2: "All fields are mandatory.",
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

        // Validate password length
        if (trimmedPassword.length < 6) {
            Toast.show({
                type: "error",
                text1: "Weak Password",
                text2: "Use at least 6 characters.",
            });
            return;
        }

        // Validate password match
        if (trimmedPassword !== trimmedConfirmPassword) {
            Toast.show({
                type: "error",
                text1: "Password Mismatch",
                text2: "Passwords do not match.",
            });
            return;
        }

        // Attempt to create account
        try {
            const user = await signUpWithEmail(trimmedEmail, trimmedPassword, trimmedConfirmPassword, trimmedUsername);
            if (user) {
                Toast.show({
                    type: "success",
                    text1: "Success",
                    text2: "Account created successfully!",
                });
                navigation.replace("SignInScreen"); 
            }
        } catch (error) {
            console.error("Sign-up failed:", error);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#f0f0f0" barStyle="dark-content" />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.innerContainer}>
                        <View style={styles.wrapper}>
                            <Text style={styles.title}>Create an Account</Text>
                            <View style={styles.formWrapper}>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Username"
                                        value={username}
                                        onChangeText={(text) => setUsername(text.trim())} 
                                        autoCapitalize="none"
                                    />
                                </View>
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
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChangeText={(text) => setConfirmPassword(text.trim())} 
                                        secureTextEntry={!showConfirmPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                                        {showConfirmPassword ? <EyeOffIcon width={20} height={20} /> : <EyeIcon width={20} height={20} />}
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
                                    <Text style={styles.signUpButtonText}>Create an Account</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.loginTxt}>
                                Already have an account? {" "}
                                <Text style={styles.loginTxtSpan} onPress={() => navigation.navigate('SignInScreen')}>
                                    Sign In
                                </Text>
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
            <Toast />
        </View>
    );
};

export default SignUpScreen;

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
});