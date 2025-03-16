import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'react-native-localize';

const resources = {
  en: {
    translation: {
      app_name: "Chattrix",
      description: "A seamless chatting experience with real-time messaging and more!",
      dark_mode: "Dark Mode",
      language: "Language",
      version: "Version",
    }
  },
  hi: {
    translation: {
      app_name: "चैट्रिक्स",
      description: "रीयल-टाइम मैसेजिंग और अधिक के साथ एक सहज चैटिंग अनुभव!",
      dark_mode: "डार्क मोड",
      language: "भाषा",
      version: "संस्करण",
    }
  },
  kn: {
    translation: {
      app_name: "ಚಾಟ್ರಿಕ್ಸ್",
      description: "ತಕ್ಷಣದ ಸಂದೇಶ ವಿನಿಮಯ ಮತ್ತು ಹೆಚ್ಚಿನದನ್ನು ಒಳಗೊಂಡಿರುವ ನಯವಾದ ಚಾಟ್ ಅನುಭವ!",
      dark_mode: "ಡಾರ್ಕ್ ಮೋಡ್",
      language: "ಭಾಷೆ",
      version: "ಆವೃತ್ತಿ",
    }
  }
};

const getStoredLanguage = async () => {
  const storedLang = await AsyncStorage.getItem('language');
  return storedLang || Localization.getLocales()[0].languageCode || 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

// Load stored language preference
getStoredLanguage().then(lang => {
  i18n.changeLanguage(lang);
});

export default i18n;
