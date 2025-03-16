import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDCKa-QNWIGGOZmYokOi_BpLi9epqmbi7M",
  authDomain: "chattrix-application.firebaseapp.com",
  projectId: "chattrix-application",
  storageBucket: "chattrix-application.appspot.com",
  messagingSenderId: "385114327987",
  appId: "1:385114327987:android:ea771a2c81e4820c1f19c6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const db = getFirestore(app);  // Firestore Database
const auth = getAuth(app);      // Firebase Authentication
const storage = getStorage(app); // Firebase Storage

// Export Firebase Services
export { app, db, auth, storage };
