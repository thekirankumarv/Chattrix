import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';
import { RootStackParamList } from './AppNavigator'; 

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

// Helper function to navigate to a specific tab
export function navigateToTab(tabName: string) {
  if (navigationRef.isReady()) {
    // First navigate to BottomTabs
    navigationRef.navigate('BottomTabs');
    
    // Navigate to the specific tab
    setTimeout(() => {
      navigationRef.dispatch(
        CommonActions.navigate({
          name: tabName,
        })
      );
    }, 100);
  }
}