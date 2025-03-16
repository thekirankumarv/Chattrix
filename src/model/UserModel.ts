//src/model/UserModel.ts
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export interface UserModel {
  uid: string;
  username: string; 
  email: string;
  profileImage: string; 
  profileImageKey?: string; 
  createdAt: FirebaseFirestoreTypes.FieldValue | FirebaseFirestoreTypes.Timestamp;
  lastMessageRead?: boolean;
} 