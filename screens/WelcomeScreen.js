import React, { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import train1 from "../assets/train1.png"; // Import the image

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const checkUserAuthentication = async () => {
    try {
      const storedData = await AsyncStorage.getItem("user");
      const data = JSON.parse(storedData);

      if (data?.user_id && data.user_id.toString().length > 0) {
        // Dispatch login action if user data exists
        dispatch({
          type: "logIn",
          data: data,
        });
        if (data.type == 0) {
          navigation.navigate("Main");
        } else if (data.type == 1) {
          navigation.navigate("DivisionManager");
        } else if (data.type == 2) {
          navigation.navigate("LocationManager");
        } else if (data.type == 3) {
          navigation.navigate("ReceptionManager");
        }
      } else {
        // Navigate to Login if no user data is found
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      navigation.navigate("Login");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Show the WelcomeScreen for 2 seconds before navigating

      const timeoutId = setTimeout(() => {
        checkUserAuthentication();
      }, 500);

      // Clean up the timeout when the screen is unfocused
      return () => clearTimeout(timeoutId);
      fetcher();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Image source={train1} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: 150, // Set width for the image
    height: 150, // Set height for the image
    resizeMode: "contain", // To maintain the aspect ratio of the image
  },
});

export default WelcomeScreen;
