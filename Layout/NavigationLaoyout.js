import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Login from "../screens/Login";
import Constants from "expo-constants";
import Signup from "../screens/Signup";
import Home from "../screens/Home";
import BookRoom from "../screens/BookRoom";
import Profile from "../screens/Profile";
import BookMeal from "../screens/BookMeal";
import PastBooking from "../screens/PastBooking";
import MealHistory from "../screens/MealHistory";
import Complaints from "../screens/Complaints";
import BookedRoomDetails from "../screens/BookedRoomDetails";
import BookedMealDetails from "../screens/BookedMealDetails";
import WelcomeScreen from "../screens/WelcomeScreen";
import FeedbackScreen from "../screens/FeedbackScreen";
import Wakeup from "../screens/Wakeup";
import LocationManager from "../screens/Location Manager/LocationManager";
import SignupRequest from "../screens/Location Manager/SignupRequest";
import ReceptionManager from "../screens/ReceptionManager/ReceptionManager";
import ComplainsRM from "../screens/ReceptionManager/ComplaintsRM";
import ComplaintsDetailsRM from "../screens/ReceptionManager/ComplaintsDetails";
import ComplainsLM from "../screens/Location Manager/ComplaintsLM";
import ComplaintsDetailsLM from "../screens/Location Manager/ComplaintsDetailsLM";
import DivisionManager from "../screens/DM/DivisionManager";
import DetailsScreen from "../screens/DM/DetailsScreen";
import { Alert, Platform } from "react-native";
import { dataCenter } from "../data/dataCenter";
import ForgotPassword from "../screens/ForgotPassword";
import ComplaintsUser from "../screens/ComplaintsUser";
import ComplaintsDetailsUser from "../screens/ComplaintsDetailsUser";
import MenuPage from "../screens/MenuPage";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Home Stack for navigation
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeScreen"
      component={Home}
      options={{ headerTitle: "", headerShown: false }}
    />
  </Stack.Navigator>
);

// Book Room Stack for navigation
const BookRoomStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="BookRoomScreen"
      component={BookRoom}
      options={{ headerTitle: "", headerShown: false }}
    />
  </Stack.Navigator>
);

// Profile Stack for navigation
const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProfileScreen"
      component={Profile}
      options={{ headerTitle: "", headerShown: false }}
    />
  </Stack.Navigator>
);

// Bottom Tab Navigation
const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Room") {
            iconName = "event";
          } else if (route.name === "Profile") {
            iconName = "person";
          } else if (route.name === "BookMeal") {
            iconName = "fastfood";
          }

          return <Icon name={iconName} color={color} size={24} />;
        },
        tabBarActiveTintColor: "#163053",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: { fontSize: 13 },
        tabBarStyle: { paddingBottom: 10, paddingTop: 5, height: 70 },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen
        name="Room"
        component={BookRoomStack}
        options={{ tabBarLabel: "Book Room" }}
      />
      <Tab.Screen
        name="BookMeal"
        component={BookMeal}
        options={{
          tabBarLabel: "Book Meal",
          headerTitle: "Book Meal",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ tabBarLabel: "Profile" }}
      />
    </Tab.Navigator>
  );
};

const NavigationLayout = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.userId);

  const handleUpdateToken = async (userId, token) => {
    if (!userId || !token) {
      return;
    }

    const apiUrl = `${dataCenter.apiUrl}/notification/token.php`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          token: token,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
      } else {
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  async function registerForPushNotificationsAsync() {
    // Set up notification channel for Android
    if (Platform.OS === "android") {
      try {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      } catch (error) {
        console.error("Error setting notification channel:", error);
      }
    }

    // Check if the device is a physical device (for push notifications)
    if (Device.isDevice) {
      try {
        // Request permissions for push notifications
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          handleRegistrationError(
            "Permission not granted to get push token for push notifications!"
          );
          return;
        }

        // Get the project ID (ensure it's available)
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId;
        if (!projectId) {
          handleRegistrationError("Project ID not found");
          return;
        }

        // Try to get the Expo Push Token
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({ projectId })
        ).data;

        return pushTokenString;
      } catch (e) {
        handleRegistrationError(`Error during push token generation: ${e}`);
      }
    } else {
      handleRegistrationError(
        "Must use a physical device for push notifications"
      );
    }
  }

  // Handle errors during push notification registration
  function handleRegistrationError(message) {
    // console.error(message);
    // alert(message); // You can show the error to the user in a more user-friendly way if needed
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        handleUpdateToken(userId, token);
        // Save token to AsyncStorage or backend
        AsyncStorage.setItem("expoPushToken", token);
      } else {
        // Alert.alert("Error", "In token gen");
      }
    });

    // Notification listener
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {}
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      // Clean up listeners
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, [userId]);

  return (
    <Stack.Navigator
      screenOptions={{
        animationEnabled: true,
        transitionSpec: {
          open: { animation: "timing", config: { duration: 50 } },
          close: { animation: "timing", config: { duration: 50 } },
        },
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={BottomTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PastBooking"
        component={PastBooking}
        options={{ headerTitle: "Past Bookings", headerShown: true }}
      />
      <Stack.Screen
        name="MealHistory"
        component={MealHistory}
        options={{ headerTitle: "Meal History", headerShown: true }}
      />
      <Stack.Screen
        name="Complaints"
        component={Complaints}
        options={{ headerTitle: "Complaint", headerShown: true }}
      />
      <Stack.Screen
        name="BookedRoomDetails"
        component={BookedRoomDetails}
        options={{ headerTitle: "Room Details", headerShown: true }}
      />
      <Stack.Screen
        name="Feedback"
        component={FeedbackScreen}
        options={{ headerTitle: "Feedback", headerShown: true }}
      />
      <Stack.Screen
        name="BookedMealDetails"
        component={BookedMealDetails}
        options={{ headerTitle: "Meal Details", headerShown: true }}
      />
      <Stack.Screen
        name="LocationManager"
        component={LocationManager}
        options={{ headerTitle: "Admin", headerShown: false }}
      />
      {/* Stack for Wakeup Screen to keep bottom tabs visible */}
      <Stack.Screen
        name="Wakeup"
        component={Wakeup}
        options={{
          headerTitle: "Wakeup Call",
          headerShown: true,
          tabBarVisible: false, // Ensure tab bar is hidden for Wakeup screen
        }}
      />
      <Stack.Screen
        name="SignupRequest"
        component={SignupRequest}
        options={{ headerTitle: "Signup Requests", headerShown: true }}
      />
      <Stack.Screen
        name="ReceptionManager"
        component={ReceptionManager}
        options={{ headerTitle: "Admin", headerShown: false }}
      />
      <Stack.Screen
        name="ComplaintsDetailsRM"
        component={ComplaintsDetailsRM}
        options={{ headerTitle: "Complaints", headerShown: true }}
      />
      <Stack.Screen
        name="ComplaintsDetailsLM"
        component={ComplaintsDetailsLM}
        options={{ headerTitle: "Complaint", headerShown: true }}
      />
      <Stack.Screen
        name="ComplaintsRM"
        component={ComplainsRM}
        options={{ headerTitle: "Complaints", headerShown: true }}
      />
      <Stack.Screen
        name="ComplaintsLM"
        component={ComplainsLM}
        options={{ headerTitle: "Complaint", headerShown: true }}
      />

      <Stack.Screen
        name="DivisionManager"
        component={DivisionManager}
        options={{ headerTitle: "Admin", headerShown: false }}
      />
      <Stack.Screen
        name="DetailsScreen"
        component={DetailsScreen}
        options={{ headerTitle: "Locations", headerShown: true }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{ headerTitle: "Forgot Password", headerShown: true }}
      />
      <Stack.Screen
        name="ComplaintsUser"
        component={ComplaintsUser}
        options={{ headerTitle: "Complaint History", headerShown: true }}
      />
      <Stack.Screen
        name="MenuPage"
        component={MenuPage}
        options={{ headerTitle: "Menu", headerShown: true }}
      />
      <Stack.Screen
        name="ComplaintsDetailsUser"
        component={ComplaintsDetailsUser}
        options={{ headerTitle: "Complaint", headerShown: true }}
      />
    </Stack.Navigator>
  );
};

export default NavigationLayout;
