import { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { UserModel } from "../model/UserModel";
import { ChatModel } from "../model/ChatModel";

const HomeViewModel = () => {
  const currentUser = auth().currentUser;
  if (!currentUser) {
    console.log("User is not authenticated.");
    return;
  }
  console.log("Current user UID:", currentUser.uid);
  
  const [userName, setUserName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserModel[]>([]);
  const [chatUsers, setChatUsers] = useState<UserModel[]>([]);
  const [chats, setChats] = useState<ChatModel[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    // Fetch current user's name
    const fetchUserName = async () => {
      const userDoc = await firestore().collection("users").doc(currentUser.uid).get();
      if (userDoc.exists) {
        setUserName(userDoc.data()?.username || "User");
      }
    };

    // Fetch chat list from Firestore dynamically
    const fetchChats = firestore()
      .collection("users")
      .doc(currentUser.uid)
      .collection("chats")
      .orderBy("timestamp", "desc")
      .onSnapshot(async (querySnapshot) => {
        const chatList = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const chatData = doc.data() as ChatModel;
            const userDoc = await firestore().collection("users").doc(doc.id).get();
            if (userDoc.exists) {
              return {
                uid: userDoc.id,
                username: userDoc.data()?.username || "Unknown",
                email: userDoc.data()?.email || "",
                profileImage: userDoc.data()?.profileImage || "",
                lastMessage: chatData.lastMessage || "",
                lastMessageRead: chatData.lastMessageRead ?? false, // ✅ Ensure this value is fetched
                createdAt: userDoc.data()?.createdAt || new Date(),
              } as UserModel;
            }
            return null;
          })
        );

        setChatUsers(chatList.filter((user) => user !== null) as UserModel[]);
      });

    fetchUserName();

    return () => {
      fetchChats(); 
    };
  }, []);

  // Search Users from chat list
  const searchUsers = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setUsers(chatUsers);
    } else {
      const filteredUsers = chatUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
      );
      setUsers(filteredUsers);
    }
  };
  
  // Manually Add a User by Email
  const addUserToChat = async (email: string): Promise<boolean> => {
    try {
      if (!currentUser) {
        console.log("User is not authenticated.");
        return false;
      }
  
      // Check if user is already in chat list
      if (chatUsers.some((user) => user.email === email)) {
        console.log("User already exists in chat list.");
        return false;
      }
  
      // Fetch user by email
      const querySnapshot = await firestore()
        .collection("users")
        .where("email", "==", email)
        .get();
  
      if (querySnapshot.empty) {
        console.log("No user found with email:", email);
        return false;
      }
  
      const userDoc = querySnapshot.docs[0];
      const userData = {
        uid: userDoc.id,
        username: userDoc.data()?.username || "Unknown",
        email: userDoc.data()?.email || "",
        profileImage: userDoc.data()?.profileImage || "",
        createdAt: userDoc.data()?.createdAt || new Date(),
      } as UserModel;
  
      const chatId = getChatId(currentUser.uid, userData.uid);
  
      // Batch operation to add users to each other’s chat list
      const batch = firestore().batch();
  
      const currentUserChatRef = firestore()
        .collection("users")
        .doc(currentUser.uid)
        .collection("chats")
        .doc(userData.uid);
  
      const otherUserChatRef = firestore()
        .collection("users")
        .doc(userData.uid)
        .collection("chats")
        .doc(currentUser.uid);
  
      batch.set(currentUserChatRef, {
        chatId,
        lastMessage: "",
        timestamp: firestore.FieldValue.serverTimestamp(),
        lastMessageRead: false,
      });
  
      batch.set(otherUserChatRef, {
        chatId,
        lastMessage: "",
        timestamp: firestore.FieldValue.serverTimestamp(),
        lastMessageRead: false,
      });
  
      await batch.commit();
  
      setChatUsers((prevUsers) => [...prevUsers, userData]);
  
      return true;
    } catch (error) {
      console.error("Error adding user:", error);
      return false;
    }
  };
  
  // Remove a user from chat list 
  const removeUserFromChat = async (uid: string) => {
    try {
      if (!currentUser) return;
  
      setChatUsers((prevUsers) => prevUsers.filter((user) => user.uid !== uid));
      
  
      const chatId = getChatId(currentUser.uid, uid);
  
      // Batch delete chat history and chat reference
      const batch = firestore().batch();
  
      const userChatRef = firestore()
        .collection("users")
        .doc(currentUser.uid)
        .collection("chats")
        .doc(uid);
  
      const otherUserChatRef = firestore()
        .collection("users")
        .doc(uid)
        .collection("chats")
        .doc(currentUser.uid);
  
      batch.delete(userChatRef);
      batch.delete(otherUserChatRef);
  
      const messagesSnapshot = await firestore()
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .get();
  
      messagesSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
  
      await batch.commit();
  
      console.log("Chat and messages deleted successfully.");
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  return {
    userName,
    searchQuery,
    users,
    searchUsers,
    addUserToChat,
    removeUserFromChat,
    chatUsers,
  };
};

// Generate unique chat ID
const getChatId = (uid1?: string, uid2?: string) => {
  return uid1 && uid2 ? (uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`) : "";
};

export default HomeViewModel;