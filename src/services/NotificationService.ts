import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { navigationRef } from '../navigation/navigationRef'; 
import { CommonActions } from '@react-navigation/native';

export async function registerForPushNotifications(username: string) {
    try {
        if (!Device.isDevice) {
            Alert.alert('Error', 'Push notifications only work on a physical device.');
            return;
        }

        // Request notification permissions 
        const { status: expoStatus } = await Notifications.requestPermissionsAsync();
        if (expoStatus !== 'granted') {
            Alert.alert('Permission Denied', 'Push notifications require permission.');
            return;
        }

        console.log('Expo Notification Permission Granted');

        // Request permission for Firebase Cloud Messaging
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
            Alert.alert('Permission Denied', 'FCM requires permission.');
            return;
        }

        console.log('FCM Permission Granted');

        // Get FCM Token from Firebase
        const token = await messaging().getToken();
        console.log('FCM Token:', token);

        // Store FCM token in Firestore for authenticated user
        const user = auth().currentUser;
        if (user) {
            await firestore().collection("users").doc(user.uid).update({ fcmToken: token });
            console.log("FCM Token saved to Firestore");
        }

        // Send a welcome notification
        await sendWelcomeNotification(username);

        return token;
    } catch (error) {
        console.error('Error getting FCM token:', error);
    }
}

// Handle received notifications
export function setupNotificationListeners() {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });

    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
        console.log('Foreground Notification:', remoteMessage);

        if (remoteMessage.notification) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: remoteMessage.notification.title || 'New Message',
                    body: remoteMessage.notification.body || '',
                    data: { navigateTo: 'ProfileScreen', ...(remoteMessage.data || {}) },
                },
                trigger: null,
            });
        }
    });

    
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Notification clicked:', response);
        
        // Navigate to BottomTabs first
        if (navigationRef.isReady()) {
            navigationRef.navigate('BottomTabs');
            
            setTimeout(() => {
                // Navigate to ProfileScreen
                navigationRef.current?.dispatch(
                    CommonActions.navigate({
                        name: 'ProfileScreen',
                    })
                );
            }, 100);
        }
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('Background Notification:', remoteMessage);
    });

    return () => {
        unsubscribeForeground(); 
        subscription.remove(); 
    };
}

// Function to send a welcome notification
export async function sendWelcomeNotification(username: string) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Chattrix Message 😊",
            body: `Hi ${username}! Welcome back to Chattrix.`,
            data: { navigateTo: 'ProfileScreen' }, 
        },
        trigger: null, 
    });
}
