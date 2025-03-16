import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Animated, { useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { MaterialIcons } from "@expo/vector-icons";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const animatedStyles = useAnimatedStyle(() => {
          return {
            transform: [{ scale: withSpring(isFocused ? 1.1 : 1) }],
            backgroundColor: withTiming(isFocused ? "#e0e0e0" : "transparent", { duration: 300 }),
            width: 50, 
            height: 50, 
            borderRadius: 25, 
            justifyContent: "center",
            alignItems: "center",
          };
        });

        const iconColor = isFocused ? "#6bf71f" : "#000";

        return (
          <View key={route.key} style={styles.tabButtonContainer}>
            <AnimatedTouchable
              onPress={onPress}
              style={[styles.tabButton, animatedStyles]}
            >
              {route.name === "HomeScreen" ? (
                <Svg width={24} height={24} viewBox="0 0 24 24" fill={iconColor}>
                  <Path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </Svg>
              ) : route.name === "ProfileScreen" ? (
                <Svg width={24} height={24} viewBox="0 0 24 24" fill={iconColor}>
                  <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </Svg>
              ) : route.name === "SettingScreen" ? (
                <MaterialIcons name="settings" size={26} color={iconColor} />
              ) : null}
            </AnimatedTouchable>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 20,
    left: 100,
    right: 100,
    height: 60,
    backgroundColor: "white",
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "space-evenly", 
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  tabButtonContainer: {
    width: "10%",
    alignItems: "center",
    justifyContent: "center",
    height: "100%", 
  },
  tabButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CustomTabBar;
