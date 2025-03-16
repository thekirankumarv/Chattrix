import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import EmailIcon from "../assets/icons/ic_email.svg";
import PhoneIcon from "../assets/icons/ic_phone.svg";
import GoogleIcon from "../assets/icons/ic_google.svg";
import FacebookIcon from "../assets/icons/ic_facebook.svg";
import { StackNavigationProp } from "@react-navigation/stack";
import useAuthViewModel from "../viewmodels/AuthViewModel";
import Toast from "react-native-toast-message";
import SocialLoginButton from "../components/SocialLoginButton"; 
import { useEffect } from "react";
import auth  from "@react-native-firebase/auth";

type NavigationProp = StackNavigationProp<RootStackParamList, "WelcomeScreen">;

const WelcomeScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { signInWithGoogle } = useAuthViewModel();

    useEffect(()=>{
        const user = auth().currentUser;
        if(user){
        navigation.replace("BottomTabs");
        }
    },[])

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
        <ImageBackground
            source={require('../assets/images/bg_social_media.png')}
            style={{ flex: 1 }} resizeMode="cover">
            <View style={styles.container}>
                <LinearGradient
                    colors={["transparent", "rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 1)"]}
                    style={styles.background}>
                    <View style={styles.wrapper}>
                        <Text style={styles.title}>CHATTRIX</Text>
                        <Text style={styles.description}>Chat with your friends and family</Text>
                        <View style={styles.socialLoginWrapper}>

                        <SocialLoginButton
                                icon={<EmailIcon width={24} height={24} />}
                                text="Continue with Email"
                                onPress={() => navigation.navigate('SignUpScreen')}
                            />

                            <SocialLoginButton
                                icon={<GoogleIcon width={24} height={24} />}
                                text="Continue with Google"
                                onPress={handleGoogleSignIn}
                            />

                            <SocialLoginButton
                                icon={<FacebookIcon width={24} height={24} />}
                                text="Continue with Facebook"
                                onPress={() => {}} 
                            />

                            <SocialLoginButton
                                icon={<PhoneIcon width={23} height={23} />}
                                text="Continue with Phone Number"
                                onPress={() => navigation.navigate("OTPVerificationScreen", { phoneNumber: "<USER_PHONE_NUMBER>" })}
                            />

                        </View>
                        <Text style={styles.loginTxt}>
                            Already have an account?{" "}
                            <Text style={styles.loginTxtSpan} onPress={() => navigation.navigate('SignInScreen')}>
                                SignIn
                            </Text>
                        </Text>
                    </View>
                </LinearGradient>
            </View>
        </ImageBackground>
    );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end'
    },
    wrapper: {
        paddingBottom: 50,
        paddingHorizontal: 20,
        alignItems: 'center'
    },
    title: {
        fontSize: 22,
        color: "#333",
        fontWeight: '800',
        letterSpacing: 2.4,
        marginBottom: 5
    },
    description: {
        fontSize: 14,
        color: 'gray',
        letterSpacing: 1.2,
        lineHeight: 30,
        marginBottom: 20
    },
    socialLoginWrapper: {
        alignSelf: 'stretch'
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
    }
});