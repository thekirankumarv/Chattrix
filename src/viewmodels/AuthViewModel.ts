import { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { UserModel } from "../model/UserModel";
import Toast from "react-native-toast-message";
import { registerForPushNotifications, setupNotificationListeners } from "../services/NotificationService";

GoogleSignin.configure({
  webClientId: "385114327987-tidispbk6pljkvpt7gfdnadgb0avhff4.apps.googleusercontent.com",
  offlineAccess: true,
});
  
const useAuthViewModel = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (authenticatedUser) => {
      setUser(authenticatedUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isEmptyOrWhitespace = (text: string): boolean => {
    return text === null || text === undefined || text.trim() === "";
  };

  // Register with Email & Password
  const signUpWithEmail = async (
    email: string,
    password: string,
    confirmPassword: string,
    username: string
  ): Promise<FirebaseAuthTypes.User | null> => {
    // Prevent multiple submissions
    if (isSubmitting) return null;
    
    try {
      setIsSubmitting(true);
      
      // Check for empty fields first (including whitespace-only inputs)
      if (
        isEmptyOrWhitespace(email) || 
        isEmptyOrWhitespace(password) || 
        isEmptyOrWhitespace(confirmPassword) || 
        isEmptyOrWhitespace(username)
      ) {
        Toast.show({
          type: "error",
          text1: "Missing Fields",
          text2: "All fields are mandatory.",
        });
        return null;
      }

      // Trim all inputs after empty check
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      const trimmedConfirmPassword = confirmPassword.trim();
      const trimmedUsername = username.trim();

      // Validate email format
      if (!isValidEmail(trimmedEmail)) {
        Toast.show({
          type: "error",
          text1: "Invalid Email",
          text2: "Please enter a valid email address.",
        });
        return null;
      }

      // Validate password length
      if (trimmedPassword.length < 6) {
        Toast.show({
          type: "error",
          text1: "Weak Password",
          text2: "Use at least 6 characters.",
        });
        return null;
      }

      // Validate password match
      if (trimmedPassword !== trimmedConfirmPassword) {
        Toast.show({
          type: "error",
          text1: "Password Mismatch",
          text2: "Passwords do not match.",
        });
        return null;
      }

      // All validations passed, create the user
      const userCredential = await auth().createUserWithEmailAndPassword(trimmedEmail, trimmedPassword);
      const firebaseUser = userCredential.user;

      const newUser: UserModel = {
        uid: firebaseUser.uid,
        username: trimmedUsername,
        email: trimmedEmail,
        profileImage: "",
        createdAt: firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
      };

      await firestore().collection("users").doc(firebaseUser.uid).set(newUser);

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Account created successfully!",
      });

      return firebaseUser;
    } catch (error: any) {
      let errorMessage = "Something went wrong. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered. Please log in.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Your password is too weak. Use at least 6 characters.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format. Please enter a valid email.";
      }

      Toast.show({
        type: "error",
        text1: "Sign-Up Failed",
        text2: errorMessage,
      });

      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sign In with Email & Password
  const signInWithEmail = async (email: string, password: string): Promise<FirebaseAuthTypes.User | null> => {

  if (isSubmitting) return null;
  
  try {
    setIsSubmitting(true);
    
    // Check for empty fields first (including whitespace-only inputs)
    if (isEmptyOrWhitespace(email) || isEmptyOrWhitespace(password)) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Email and password are required.",
      });
      return null;
    }

    // Trim inputs after empty check
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Validate email format
    if (!isValidEmail(trimmedEmail)) {
      Toast.show({
        type: "error",
        text1: "Invalid Email",
        text2: "Please enter a valid email address.",
      });
      return null;
    }

    const userCredential = await auth().signInWithEmailAndPassword(trimmedEmail, trimmedPassword);
    
    // Fetch username from Firestore
    const username = await fetchUsernameFromFirestore(userCredential.user.uid);

     // Push notifications after successful login
     await registerForPushNotifications(username);
     setupNotificationListeners();
    
    return userCredential.user;
  } catch (error: any) {
    let errorMessage = "Invalid email or password.";
    
    if (error.code === "auth/user-not-found") {
      errorMessage = "No account found with this email.";
    } else if (error.code === "auth/wrong-password") {
      errorMessage = "Incorrect password. Please try again.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email format.";
    } else if (error.code === "auth/too-many-requests") {
      errorMessage = "Too many failed attempts. Try again later.";
    }
    
    Toast.show({
      type: "error",
      text1: "Sign-In Failed",
      text2: errorMessage,
    });
    return null;
  } finally {
    setIsSubmitting(false);
  }
};

// Function to fetch username from Firestore
const fetchUsernameFromFirestore = async (userId: string): Promise<string> => {

  const userDoc = await firestore().collection('users').doc(userId).get();
  return userDoc.data()?.username || 'User';
};

// Google Sign-In
const signInWithGoogle = async (): Promise<FirebaseAuthTypes.User | null> => {

  if (isSubmitting) return null;
  
  try {
    setIsSubmitting(true);
    
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const googleUser = await GoogleSignin.signIn();
    const { idToken } = await GoogleSignin.getTokens();
    if (!idToken) throw new Error("Google Sign-In failed: No ID Token received.");

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const userCredential = await auth().signInWithCredential(googleCredential);
    const firebaseUser = userCredential.user;

    const userDoc = await firestore().collection("users").doc(firebaseUser.uid).get();
    if (!userDoc.exists) {
      const newUser: UserModel = {
        uid: firebaseUser.uid,
        username: firebaseUser.displayName || "User",
        email: firebaseUser.email || "",
        profileImage: firebaseUser.photoURL || "",
        createdAt: firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
      };
      await firestore().collection("users").doc(firebaseUser.uid).set(newUser);
    }

    return firebaseUser;
  } catch (error: any) {
    let errorMessage = "Something went wrong. Please try again.";
    
    if (error.code === "auth/account-exists-with-different-credential") {
      errorMessage = "An account already exists with the same email address.";
    }
    
    Toast.show({
      type: "error",
      text1: "Google Sign-In Failed",
      text2: errorMessage,
    });
    return null;
  } finally {
    setIsSubmitting(false);
  }
};

//Sign Out
const signOut = async () => {
  try {
    await auth().signOut();
    Toast.show({
      type: "success",
      text1: "Success",
      text2: "You have been signed out.",
    });
  } catch (error) {
    Toast.show({
      type: "error",
      text1: "Sign-Out Failed",
      text2: "Something went wrong. Please try again.",
    });
  }
};

  return {
    user,
    loading,
    isSubmitting,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
  };
};

export default useAuthViewModel;