import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import * as eva from "@eva-design/eva";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import store from "./redux-store/store";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import NavigationLayout from "./Layout/NavigationLaoyout";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import mobileAds from "react-native-google-mobile-ads";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import * as InAppUpdates from "expo-in-app-updates";
export default function App() {
  // const checkForUpdates = async () => {
  //   // Check if an update is available
  //   const update = await InAppUpdates.checkForUpdateAsync();

  //   if (update.isAvailable) {
  //     // If an update is available, force the update process immediately
  //     await InAppUpdates.fetchUpdateAsync({
  //       type: InAppUpdates.AppUpdateType.IMMEDIATE,
  //     })
  //       .then(() => {
  //         // After fetching the update, prompt the user to update
  //         Alert.alert(
  //           "Update Available",
  //           "A new version of the app is available. Please update to the latest version.",
  //           [{ text: "Update", onPress: () => InAppUpdates.reloadAsync() }]
  //         );
  //       })
  //       .catch((error) => {
  //         console.log("Error fetching update:", error);
  //       });
  //   }
  // };
  // Initialize Google Mobile Ads SDK
  useEffect(() => {
    (async () => {
      // checkForUpdates();
      // Google AdMob will show any messages here that you just set up on the AdMob Privacy & Messaging page
      const { status: trackingStatus } =
        await requestTrackingPermissionsAsync();
      if (trackingStatus !== "granted") {
        // Do something here such as turn off Sentry tracking, store in context/redux to allow for personalized ads, etc.
      }

      // Initialize the ads
      await mobileAds().initialize();
    })();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.light}>
          <GestureHandlerRootView style={styles.container}>
            <StatusBar style="auto" />
            <SafeAreaView style={styles.container}>
              <PaperProvider>
                <NavigationLayout />
              </PaperProvider>
            </SafeAreaView>
          </GestureHandlerRootView>
        </ApplicationProvider>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
