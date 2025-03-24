import { useCallback, useEffect, useState } from "react";
import {
  BackHandler,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Alert,
  ScrollView,
} from "react-native";
import { Divider } from "react-native-paper";
import { vh, vw } from "react-native-expo-viewport-units";
import { Button, Icon, Input } from "@ui-kitten/components";
import { TouchableRipple } from "react-native-paper";
import { useDispatch } from "react-redux";
import logo from "../assets/train.png";
import { dataCenter } from "../data/dataCenter";
import Loader from "../components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const Login = ({ navigation }) => {
  const apiUrl = dataCenter.apiUrl;
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);

  const toggleSecureEntry = () => {
    setSecureTextEntry((prev) => !prev);
  };

  const validateCredentials = () => {
    if (!username || username.length < 2) {
      Alert.alert("Error", "Username must be at least 2 characters long.");
      return false;
    }
    if (!password || password.length < 4) {
      Alert.alert("Error", "Password must be at least 4 characters long.");
      return false;
    }
    return true;
  };
  const handleUpdateToken = async (userId, token) => {
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
  const handleSubmit = async () => {
    if (!validateCredentials()) return;

    setLoading(true);

    try {
      const formdata = new FormData();
      formdata.append("cmsID", username);
      formdata.append("password", password);

      const response = await fetch(`${apiUrl}/login.php`, {
        method: "POST",

        body: JSON.stringify({ cmsID: username, password: password }),
      });

      const data = await response.json();

      if (data.status == "success") {
        const tokenData = await AsyncStorage.getItem("expoPushToken");
        handleUpdateToken(data.user_id, tokenData);
        setUsername("");
        setPassword("");
        dispatch({ type: "logIn", data: data });
        const jsonValue = JSON.stringify({
          user_id: data.user_id,
          type: data.type,
        });
        await AsyncStorage.setItem("user", jsonValue);
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
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Exit App",
          "Are you sure you want to exit?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Exit", onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        );
        return true; // Prevent default back action
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      {loading && <Loader />}
      <View style={styles.logoBox}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.formBox}>
        <Text style={styles.formHeading}>Welcome</Text>
        <Text style={styles.signInHeading}> Sign in to continue</Text>

        <Input
          label="CMS ID"
          placeholder="CMS ID"
          accessoryLeft={(props) => (
            <Icon {...props} name="person-outline" fill="#335075" />
          )}
          style={styles.formTextInput}
          size="large"
          value={username}
          onChangeText={setUsername}
        />
        <Input
          label="Password"
          placeholder="Password"
          accessoryRight={(props) => (
            <TouchableWithoutFeedback onPress={toggleSecureEntry}>
              <Icon
                {...props}
                name={secureTextEntry ? "eye-off" : "eye"}
                fill="#335075"
              />
            </TouchableWithoutFeedback>
          )}
          accessoryLeft={(props) => (
            <Icon {...props} name="lock" fill="#335075" />
          )}
          secureTextEntry={secureTextEntry}
          style={styles.formTextInput}
          size="large"
          value={password}
          onChangeText={setPassword}
        />
        <Button
          style={styles.formBtn}
          status="primary"
          size="large"
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </Button>

        <TouchableRipple
          onPress={() => {
            navigation.navigate("ForgotPassword");
          }}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableRipple>

        <TouchableRipple onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.signUpText}>
            New User? <Text style={styles.signUpBoldText}>Sign up</Text>
          </Text>
        </TouchableRipple>

        <Text style={styles.termsText}>
          By continuing, you agree to the{" "}
          <Text style={styles.boldText}>Terms of Services</Text> &{" "}
          <Text style={styles.boldText}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  logoBox: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: vw(28),
    marginTop: -20,
  },
  formHeading: {
    fontSize: 45,
    fontWeight: "900",
    color: "#163053",
    textAlign: "center",
  },
  signInHeading: {
    fontSize: 17,
    color: "#163053",
    fontWeight: "900",
    textAlign: "center",
  },
  formBox: {
    flex: 3,
    alignItems: "center",
    gap: 20,
    marginTop: 20,
  },
  formTextInput: {
    backgroundColor: "white",
    width: "100%",
    paddingHorizontal: 1,
  },
  formBtn: {
    width: vw(90),
    height: vh(7),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#163053",
    borderRadius: 10,
    borderWidth: 0,
  },
  forgotPasswordText: {
    color: "#163053",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpText: {
    color: "#878787",
    textAlign: "center",
    fontSize: 15,
  },
  signUpBoldText: {
    color: "#163053",
    fontWeight: "900",
  },
  termsText: {
    color: "#878787",
    textAlign: "center",
    fontSize: 14,
  },
  boldText: {
    color: "black",
    fontWeight: "500",
  },
});

export default Login;
