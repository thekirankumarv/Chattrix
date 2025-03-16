import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useSettingViewModel } from "../viewmodels/SettingViewModel";
import { useTranslation } from "react-i18next";
import "../utils/localization/i18n";

const SettingScreen = () => {
  const {
    isDarkTheme,
    toggleTheme,
    selectedLanguage,
    changeLanguage,
    appVersion,
  } = useSettingViewModel();
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkTheme ? "#222" : "#fbfff9" },
      ]}
    >
      <Text style={[styles.title, { color: isDarkTheme ? "#fff" : "#333" }]}>
        {t("app_name")}
      </Text>
      <Text
        style={[styles.description, { color: isDarkTheme ? "#ccc" : "#666" }]}
      >
        {t("description")}
      </Text>

      {/* Theme Toggle */}
      <View style={styles.settingRow}>
        <Text
          style={[styles.settingText, { color: isDarkTheme ? "#fff" : "#333" }]}
        >
          {t("dark_mode")}
        </Text>
        <Switch
          value={isDarkTheme}
          onValueChange={toggleTheme}
          thumbColor={isDarkTheme ? "#6bf71f" : "#80faa8"}
        />
      </View>

      {/* Localization */}
      <View style={styles.settingRow}>
        <Text
          style={[styles.settingText, { color: isDarkTheme ? "#fff" : "#333" }]}
        >
          {t("language")}
        </Text>
        <Picker
          selectedValue={selectedLanguage}
          style={[styles.picker, { color: isDarkTheme ? "#fff" : "#333" }]}
          onValueChange={changeLanguage}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="हिन्दी" value="hi" />
          <Picker.Item label="ಕನ್ನಡ" value="kn" />
        </Picker>
      </View>

      {/* App Version */}
      <View style={styles.versionContainer}>
        <MaterialIcons
          name="info"
          size={24}
          color={isDarkTheme ? "#80faa8" : "#6bf71f"}
        />
        <Text
          style={[
            styles.versionText,
            { color: isDarkTheme ? "#80faa8" : "#6bf71f" },
          ]}
        >
          {t("version")} {appVersion}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold" },
  description: { fontSize: 16, textAlign: "center", marginVertical: 10 },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 15,
  },
  settingText: { fontSize: 18 },
  picker: { width: 150 },
  versionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  versionText: { fontSize: 16, marginLeft: 5 },
});

export default SettingScreen;
