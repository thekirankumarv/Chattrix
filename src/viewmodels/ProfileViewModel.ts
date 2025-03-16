import { useEffect, useState } from "react";
import { Platform } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { launchImageLibrary } from "react-native-image-picker";
import { UserModel } from "../model/UserModel";

const useProfileViewModel = () => {
  const [user, setUser] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const currentUser = auth().currentUser;

  useEffect(() => {
    if (currentUser) {  
      const unsubscribe = firestore()
        .collection("users")
        .doc(currentUser.uid)
        .onSnapshot(
          async (doc) => {
            if (doc.exists) {
              const userData = doc.data() as UserModel;

              if (userData.profileImageKey) {
                const imageUrl = await fetchImageUrl(userData.profileImageKey);
                setUser({ ...userData, profileImage: imageUrl });
              } else {
                setUser(userData);
              }
            } else {
              console.warn("No user document found in Firestore");
            }
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching user document:", error);
            setLoading(false);
          }
        );

      return () => unsubscribe();
    }
  }, [currentUser]);

  const handleImageUpload = async () => {
    if (!currentUser) return;

    launchImageLibrary({ mediaType: "photo" }, async (response) => {
      if (
        response.didCancel ||
        !response.assets ||
        response.assets.length === 0
      )
        return;

      const asset = response.assets[0];
      const filePath = asset.uri;

      if (!filePath) {
        console.error("Invalid file path");
        return;
      }

      const fileName = `profile_${currentUser.uid}.jpg`;
      const base64Data = await convertFileToBase64(filePath);

      setUploading(true);
      try {
        const uploadResponse = await uploadToS3(
          base64Data,
          fileName,
          currentUser.uid
        );
        const imageKey = uploadResponse.data;

        await firestore().collection("users").doc(currentUser.uid).update({
          profileImageKey: imageKey,
        });

        const imageUrl = await fetchImageUrl(imageKey);
        await firestore().collection("users").doc(currentUser.uid).update({
          profileImage: imageUrl,
        });

        setUser((prev) =>
          prev
            ? {
                ...prev,
                profileImage: imageUrl,
                profileImageKey: imageKey,
              }
            : null
        );

        console.log("Image uploaded successfully:", imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
      setUploading(false);
    });
  };

  const uploadToS3 = async (
    fileContent: string,
    key: string,
    uploadedBy: string
  ) => {
    const response = await fetch(
      "S3_UPLOAD_URL",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileContent,
          key,
          uploadedBy,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image to S3");
    }
    return response.json();
  };

  const fetchImageUrl = async (key: string) => {
    const response = await fetch(
      `S3_SIGNED_URL${key}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch image URL from S3");
    }

    const responseText = await response.text();

    const jsonData = JSON.parse(responseText);

    return jsonData.url;
  };

  const convertFileToBase64 = async (filePath: string): Promise<string> => {
    const response = await fetch(filePath);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result?.toString().split(",")[1];
        if (base64data) {
          resolve(base64data);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const formatDate = (timestamp: any) => {
    if (timestamp instanceof firestore.Timestamp) {
      return timestamp.toDate().toDateString();
    }
    return "Unknown";
  };

  return { user, loading, uploading, handleImageUpload, formatDate };
};

export default useProfileViewModel;
