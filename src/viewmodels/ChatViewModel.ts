import { useState } from "react";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { ChatModel } from "../model/ChatModel";

const ChatViewModel = (receiverId: string) => {
  const currentUser = auth().currentUser;
  const [messages, setMessages] = useState<ChatModel[]>([]);

  const chatRef = firestore()
    .collection("chats")
    .doc(getChatId(currentUser?.uid, receiverId))
    .collection("messages")
    .orderBy("timestamp", "asc");

  // Function to load messages
  const loadMessages = () => {
    chatRef.onSnapshot((snapshot) => {
      if (!snapshot || snapshot.empty) {
        setMessages([]);
        return;
      }
  
      const msgs = snapshot.docs.map((doc) => {
        const data = doc.data();
  
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp ? data.timestamp.toDate() : new Date(),
        };
      }) as ChatModel[];
  
      // Mark messages as read and update `lastMessageRead`
      msgs.forEach(async (msg) => {
        if (msg.senderId === receiverId && !msg.isRead) {
          await firestore()
            .collection("chats")
            .doc(getChatId(currentUser?.uid, receiverId))
            .collection("messages")
            .doc(msg.id)
            .update({ isRead: true });
  
          await firestore()
            .collection("users")
            .doc(currentUser?.uid)
            .collection("chats")
            .doc(receiverId)
            .update({ lastMessageRead: true });
  
          await firestore()
            .collection("users")
            .doc(receiverId)
            .collection("chats")
            .doc(currentUser?.uid)
            .update({ lastMessageRead: true });
        }
      });
  
      setMessages(msgs);
    }, (error) => {
      console.error("Error loading messages:", error);
    });
  };
  
  // Function to send a message
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const chatId = getChatId(currentUser?.uid, receiverId);
    const messageData = {
      senderId: currentUser?.uid,
      receiverId,
      message: text,
      timestamp: firestore.FieldValue.serverTimestamp(),
      isRead: false,
      participants: [currentUser?.uid, receiverId],
    };

    await firestore()
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .add(messageData);

    // Automatically add both users to each other's chat list
    const user1Ref = firestore().collection("users").doc(currentUser?.uid);
    const user2Ref = firestore().collection("users").doc(receiverId);

    await user1Ref.collection("chats").doc(receiverId).set({
      chatId,
      lastMessage: text,
      timestamp: firestore.FieldValue.serverTimestamp(),
    });

    await user2Ref.collection("chats").doc(currentUser?.uid).set({
      chatId,
      lastMessage: text,
      timestamp: firestore.FieldValue.serverTimestamp(),
    });
  };

  return { messages, sendMessage, loadMessages };
};

// Generate unique chat ID
const getChatId = (uid1?: string, uid2?: string) => {
  return uid1 && uid2
    ? uid1 < uid2
      ? `${uid1}_${uid2}`
      : `${uid2}_${uid1}`
    : "";
};

export default ChatViewModel;
