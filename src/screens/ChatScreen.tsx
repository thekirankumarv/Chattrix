import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import ChatViewModel from "../viewmodels/ChatViewModel";
import IcProfile from "../assets/icons/ic_profile.svg";
import { UserModel } from "../model/UserModel";
import { RootStackParamList } from "../navigation/AppNavigator";

// Navigation and route types
type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, "ChatScreen">;
type ChatScreenRouteProp = RouteProp<RootStackParamList, "ChatScreen">;

const ChatScreen = () => {
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const route = useRoute<ChatScreenRouteProp>();
  const { user } = route.params as { user: UserModel };
  const { messages, sendMessage, loadMessages } = ChatViewModel(user.uid);
  const [message, setMessage] = useState("");
  const [expandedMessages, setExpandedMessages] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadMessages(); 
  }, []);

  const toggleExpandMessage = (messageId: string) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        {user.profileImage ? (
          <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
        ) : (
          <IcProfile width={40} height={40} style={styles.profileIcon} />
        )}
        <View style={styles.userInfo}>
          <Text style={styles.username}>{user.username.trim()}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>

      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSentByCurrentUser = item.senderId !== user.uid;
          const chatBubbleColor = isSentByCurrentUser ? "#4df9b1" : "#6bf71f"; 
          
          // Limit characters to show Read More
          const maxLength = 100;
          const isLongMessage = item.message.length > maxLength;
          const shouldExpand = expandedMessages[item.id];

          return (
            <View
              style={[
                styles.chatBubble,
                { backgroundColor: chatBubbleColor, alignSelf: isSentByCurrentUser ? "flex-end" : "flex-start" }
              ]}
            >
              <Text style={styles.messageText}>
                {shouldExpand ? item.message : `${item.message.substring(0, maxLength)}${isLongMessage ? "..." : ""}`}

                {/* Read More / Read Less Button */}
                {isLongMessage && (
                  <TouchableOpacity onPress={() => toggleExpandMessage(item.id)}>
                    <Text style={styles.readMoreText}>
                      {shouldExpand ? " Read Less" : " Read More"}
                    </Text>
                  </TouchableOpacity>
                )}
              </Text>

              <Text style={styles.timestamp}>
                {new Date(item.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          );
        }}
      />

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          style={styles.input}
        />
        <TouchableOpacity onPress={() => {
          sendMessage(message);
          setMessage("");
        }}>
          <MaterialIcons name="send" size={28} color="#6bf71f" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fff0",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  profileIcon: {
    marginLeft: 10,
  },
  userInfo: {
    marginLeft: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "gray",
  },
  chatBubble: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: "80%",
  },
  messageText: {
    color: "white",
    lineHeight: 22,
  },
  readMoreText: {
    color: "blue",
    fontWeight: "bold",
  },
  timestamp: {
    fontSize: 10,
    color: "black",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 10,
  },
});

export default ChatScreen;