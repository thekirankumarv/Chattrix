import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import IcProfile from "../assets/icons/ic_profile.svg";

interface UserCardProps {
  item: {
    uid: string;
    username: string;
    email: string;
    profileImage?: string;
    lastMessageRead?: boolean;
  };
  onPress: () => void;
  onDelete: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ item, onPress, onDelete }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {/* Profile Image */}
      {item.profileImage ? (
        <Image
          source={{ uri: item.profileImage }}
          style={styles.profileImage}
        />
      ) : (
        <IcProfile width={55} height={55} style={styles.profileIcon} />
      )}

      <View style={styles.userInfoContainer}>
        <View style={styles.usernameContainer}>
          <Text style={styles.usernameText}>{item.username}</Text>
          {/* Message Read Indicator */}
          <View
            style={[
              styles.messageReadIndicator,
              {
                backgroundColor: item.lastMessageRead ? "green" : "red",
              },
            ]}
          />
        </View>
        <Text style={styles.emailText}>{item.email}</Text>
      </View>

      {/* Delete Button */}
      <TouchableOpacity onPress={onDelete}>
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
  },
  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 30,
    marginRight: 12,
  },
  profileIcon: {
    marginRight: 12,
  },
  userInfoContainer: {
    flex: 1,
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  usernameText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
  },
  messageReadIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  emailText: {
    fontSize: 13,
    color: "gray",
  },
});

export default UserCard;