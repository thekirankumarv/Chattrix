import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native"; 

const { width } = Dimensions.get("window");

const Skeleton = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  return (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonImage}>
        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </View>
      <View style={styles.skeletonInfo}>
        <View style={styles.skeletonLine}>
          <Animated.View
            style={[
              styles.shimmer,
              {
                transform: [{ translateX }],
              },
            ]}
          />
        </View>
        <View style={styles.skeletonLine}>
          <Animated.View
            style={[
              styles.shimmer,
              {
                transform: [{ translateX }],
              },
            ]}
          />
        </View>
        <View style={styles.skeletonLine}>
          <Animated.View
            style={[
              styles.shimmer,
              {
                transform: [{ translateX }],
              },
            ]}
          />
        </View>
      </View>
      <View style={styles.skeletonButton}>
        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    borderRadius: 20,
    padding: 25,
    width: width * 0.9, // Use the width variable here
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    overflow: "hidden",
  },
  skeletonImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#bdbdbd",
    marginBottom: 20,
    overflow: "hidden",
  },
  skeletonInfo: {
    width: "100%",
  },
  skeletonLine: {
    height: 20,
    backgroundColor: "#bdbdbd",
    marginBottom: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  skeletonButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#bdbdbd",
    borderRadius: 25,
    marginTop: 20,
    overflow: "hidden",
  },
  shimmer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e0e0e0",
    opacity: 0.5,
  },
});

export default Skeleton;