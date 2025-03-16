import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../utils/localization/i18n';

export const useSettingViewModel = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const appVersion = '1.0.0';

  useEffect(() => {
    const loadSettings = async () => {
      const storedTheme = await AsyncStorage.getItem('theme');
      if (storedTheme) setIsDarkTheme(storedTheme === 'dark');

      const storedLang = await AsyncStorage.getItem('language');
      if (storedLang) {
        setSelectedLanguage(storedLang);
        i18n.changeLanguage(storedLang);  
      }
    };
    loadSettings();
  }, []);

  const toggleTheme = async () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const changeLanguage = async (language: string) => {
    setSelectedLanguage(language);
    await AsyncStorage.setItem('language', language);
    i18n.changeLanguage(language);  
  };

  return {
    isDarkTheme,
    toggleTheme,
    selectedLanguage,
    changeLanguage,
    appVersion,
  };
};
