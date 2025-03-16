import React, { useEffect, useState } from "react";
import {
  View, Text, TextInput, FlatList, TouchableOpacity, Modal, ToastAndroid, StyleSheet
} from "react-native";
import { FloatingAction } from "react-native-floating-action";
import { MaterialIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import HomeViewModel from "../viewmodels/HomeViewModel";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import UserCard from "../components/UserCard";

const HomeScreen = () => {
  const { userName, searchQuery, users, searchUsers, addUserToChat, chatUsers, removeUserFromChat } = HomeViewModel();
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Function to show Toast messages
  const showToast = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  return (
    <View style={styles.container}>
      {/* Welcome Text */}
      <Text style={styles.welcomeText}>
        Hello, {userName || "User"} 👋
      </Text>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={24} color="gray" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or email..."
          placeholderTextColor="gray"
          value={searchQuery}
          onChangeText={searchUsers}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => searchUsers("")}>
            <MaterialIcons name="close" size={24} color="gray" />
          </TouchableOpacity>
        )}
      </View>

      {/* No Users Animation */}
      {chatUsers.length === 0 && (
        <View style={styles.noUsersContainer}>
          <LottieView
            source={require("../assets/lottie/no_users.json")}
            autoPlay
            loop
            style={styles.noUsersAnimation}
          />
          <Text style={styles.noUsersText}>
            No users added yet.
          </Text>
        </View>
      )}

      {/* User List */}
      <FlatList
        data={chatUsers}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <UserCard
            item={item}
            onPress={() => navigation.navigate("ChatScreen", { user: item })}
            onDelete={() => removeUserFromChat(item.email)}
          />
        )}
      />

      {/* Floating Action Button */}
      <FloatingAction
        color="#4df9b1"
        floatingIcon={<MaterialIcons name="message" size={28} color="white" />}
        actions={[
          {
            text: "Add Chat",
            icon: <MaterialIcons name="person-add" size={24} color="white" />,
            name: "add_chat",
          }
        ]}
        onPressItem={(name) => {
          if (name === "add_chat") {
            setModalVisible(true);
          }
        }}
      />

      {/* Add User Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add User</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter Email"
              value={email}
              onChangeText={(text) => setEmail(text.trim())}
            />

            {/* Submit & Cancel Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  addUserToChat(email)
                    .then((success) => {
                      if (success) {
                        showToast("User added successfully!");
                        setModalVisible(false);
                        setEmail("");
                      } else {
                        showToast("User not found or already added.");
                      }
                    })
                    .catch(() => showToast("Error adding user."));
                }}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fff0",
    padding: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6bf71f",
    marginBottom: 15,
    textAlign: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    elevation: 3,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    paddingHorizontal: 10,
    color: "#333",
  },
  noUsersContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  noUsersAnimation: {
    width: 200,
    height: 200,
  },
  noUsersText: {
    textAlign: "center",
    color: "gray",
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    borderBottomWidth: 1,
    padding: 10,
    width: "100%",
    fontSize: 16,
    borderColor: "#80faa8",
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 15,
  },
  submitButton: {
    backgroundColor: "#6bf71f",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    width: 90,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 8,
    width: 90,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

