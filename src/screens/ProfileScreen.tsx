import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import Svg, { Circle } from "react-native-svg";
import useProfileViewModel from "../viewmodels/ProfileViewModel";
import IcProfile from '../assets/icons/ic_profile.svg';
import Skeleton from "../components/skeletons/ProfileSkeleton"; 
import { ActivityIndicator } from "react-native";
import useAuthViewModel from "../viewmodels/AuthViewModel";

const { width, height } = Dimensions.get("window");

const ProfileScreen = ({ navigation }) => {
  const { user, loading, uploading, handleImageUpload, formatDate } = useProfileViewModel();
  const { signOut } = useAuthViewModel(); 

  if (loading) {
    return (
      <LinearGradient colors={["#e0f7fa", "#80deea"]} style={styles.container}>
        <Skeleton />
      </LinearGradient>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigation.replace("SignInScreen");
  };

  return (
    <LinearGradient colors={["#e0f7fa", "#80deea"]} style={styles.container}>
      <Svg height={height} width={width} style={styles.backgroundSvg}>
        <Circle cx={width * 0.2} cy={height * 0.1} r={100} fill="#80faa8" opacity={0.2} />
        <Circle cx={width * 0.8} cy={height * 0.3} r={150} fill="#6bf71f" opacity={0.2} />
        <Circle cx={width * 0.5} cy={height * 0.7} r={200} fill="#4df9b1" opacity={0.2} />
      </Svg>

      <LinearGradient
        colors={["#6bf71f", "#80faa8", "#4df9b1"]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity onPress={handleImageUpload} style={styles.imageContainer}>
          {user?.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={styles.profileImage}/>
          ) : (
            <IcProfile width={120} height={120} style={styles.svgImage} />
          )}
          <View style={styles.editIconContainer}>
            <Icon name="edit" size={20} color="#fff" />
          </View>
          {uploading && <ActivityIndicator size="small" color="#fff" style={styles.uploadingIndicator} />}
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{user?.username}</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email}</Text>

          <Text style={styles.label}>Joined</Text>
          <Text style={styles.value}>{formatDate(user?.createdAt)}</Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <Text style={styles.logoutButtonText}>Logout</Text>
          <Icon name="logout" size={20} color="#fff" style={styles.logoutIcon} />
        </TouchableOpacity>

      </LinearGradient>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundSvg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  card: {
    borderRadius: 20,
    padding: 25,
    width: width * 0.9,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
  },
  svgImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#6bf71f",
    borderRadius: 15,
    padding: 5,
    borderWidth: 2,
    borderColor: "#fff",
  },
  uploadingIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -10,
    marginTop: -10,
  },
  infoContainer: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff4444", 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  logoutIcon: {
    marginLeft: 5,
  },
});

export default ProfileScreen;