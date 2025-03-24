import React, { useState } from "react";
import {
  BackHandler,
  Image,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { Icon, Input, Button, Text } from "@ui-kitten/components";
import Loader from "../components/Loader";
import train from "../assets/train.png";
import { dataCenter } from "../data/dataCenter";

const ForgotPassword = ({ navigation }) => {
  const defaultFields = {
    email: "",
    password: "",
    code: "",
    confirmPass: "",
  };
  const [inpFields, setInpFields] = useState(defaultFields);
  const [passValid, setPassValid] = useState(true);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setIsLoading] = useState(false);
  const [firstStep, setFirstStep] = useState(false);
  const [secondStep, setSecondStep] = useState(false);
  const [timer, setTimer] = useState(0);
  const [otp, setOtp] = useState(null);

  // Toggle secure text entry visibility
  const toggleSecureEntry = () => {
    setSecureTextEntry((prevState) => !prevState);
  };
  const passwordHandler = (text) => {
    setPassValid(true);
    setInpFields({ ...inpFields, password: text.trim() });
  };

  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon
        {...props}
        name={secureTextEntry ? "eye-off" : "eye"}
        fill="#163053"
      />
    </TouchableWithoutFeedback>
  );

  const emailHandler = (text) => {
    setInpFields({ ...inpFields, email: text.trim() });
  };

  const sendOtp = async () => {
    setIsLoading(true);
    const apiUrl = `${dataCenter.apiUrl}/otp/genrate_otp.php`; // Replace with your backend endpoint

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cmsid: inpFields.email }), // Pass the CMS ID to the backend
      });

      if (!response.ok) {
        throw new Error("Failed to send OTP. Please try again.");
      }

      const data = await response.json();

      if (data.success) {
        setOtp(data);
        setFirstStep(true);
        startTimer(); // Start the timer for the resend button
        Alert.alert("Success", `OTP sent successfully.`, [{ text: "OK" }]);
      } else {
        throw new Error(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const compareOtp = () => {
    setIsLoading(true);
    if (inpFields.code == otp.otp) {
      setTimeout(() => {
        setIsLoading(false);
        setSecondStep(true);
      }, 1000);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert("Error", "Invalid OTP. Please try again.");
        setInpFields({ ...inpFields, code: "" });
      }, 1000);
    }
  };

  const startTimer = () => {
    setTimer(60); // Set timer to 60 seconds
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  const passHandler = async () => {
    if (inpFields.password != inpFields.confirmPass) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    const apiUrl = `${dataCenter.apiUrl}/otp/password_reset.php`;
    setIsLoading(true);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cms_id: inpFields.email,
          new_password: inpFields.password,
        }),
      });

      // Parse JSON response
      const data = await response.json();
      setIsLoading(false);
      if (response.ok && data.status === "success") {
        Alert.alert("Success", data.message);
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", data.message || "Failed to update password.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      Alert.alert(
        "Error",
        "An unexpected error occurred. Please try again later."
      );
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      {loading && <Loader />}
      <View style={styles.logoBox}>
        <Image source={train} style={styles.logo} resizeMode="contain" />
      </View>
      <View style={styles.formBox}>
        <Text style={styles.formHeading}>Reset Password</Text>

        {!firstStep && (
          <Input
            label="CMS ID"
            size="large"
            placeholder="Enter your CMS ID"
            style={styles.formTextInput}
            onChangeText={emailHandler}
          />
        )}
        {firstStep && !secondStep && (
          <Input
            style={styles.formTextInput}
            label="OTP"
            size="large"
            placeholder="Enter OTP sent to your mobile"
            accessoryRight={renderIcon}
            secureTextEntry={secureTextEntry}
            keyboardType="numeric"
            value={inpFields.code}
            onChangeText={(text) => {
              if (text.length > 4) {
                return;
              }
              setInpFields({ ...inpFields, code: text });
            }}
          />
        )}
        {firstStep && secondStep && (
          <>
            <Input
              style={styles.formTextInput}
              label="Password"
              size="large"
              placeholder="Enter new password"
              accessoryRight={renderIcon}
              secureTextEntry={secureTextEntry}
              status={passValid ? "primary" : "danger"}
              onChangeText={passwordHandler}
            />
            <Input
              style={styles.formTextInput}
              label="Confirm Password"
              size="large"
              placeholder="Enter new password"
              secureTextEntry={false}
              status={passValid ? "primary" : "danger"}
              onChangeText={(text) => {
                setInpFields({ ...inpFields, confirmPass: text.trim() });
              }}
            />
          </>
        )}

        {!firstStep && (
          <Button style={styles.formBtn} appearance="filled" onPress={sendOtp}>
            Send OTP
          </Button>
        )}
        {firstStep && !secondStep && (
          <>
            <Button
              style={styles.formBtn}
              appearance="filled"
              onPress={compareOtp}
            >
              Enter OTP
            </Button>
            <TouchableWithoutFeedback disabled={timer > 0} onPress={sendOtp}>
              <Text
                style={[
                  styles.resendText,
                  timer > 0 && styles.resendTextDisabled,
                ]}
              >
                {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
              </Text>
            </TouchableWithoutFeedback>
          </>
        )}
        {firstStep && secondStep && (
          <Button
            style={styles.formBtn}
            appearance="filled"
            onPress={passHandler}
          >
            Submit
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  heading: {
    flex: 0.2,
    fontSize: 19,
    fontWeight: "bold",
    padding: 12,
    textAlign: "center",
  },

  logoBox: {
    flex: 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: vw(30),
  },

  formBox: {
    flex: 2.4,
    justifyContent: "start",
    alignItems: "center",
    gap: 15,
    position: "relative",
    backgroundColor: "#FAFAFA",
    paddingTop: 20,
  },

  formHeading: {
    fontSize: 22,
    textTransform: "uppercase",
    margin: 10,
    letterSpacing: 2,
    fontWeight: "900",
  },

  formTextInput: {
    backgroundColor: "white",
    width: vw(85),
    borderRadius: 50,
    borderColor: "#e7e7e7",
    paddingHorizontal: 1,
  },
  formBtn: {
    width: vw(35),
    height: vh(6),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginTop: 10,
    textAlign: "center",
    backgroundColor: "#163053",
    borderWidth: 0,
  },
  formLastHeading: {
    position: "absolute",
    bottom: 0,
    left: "29%",
    textAlign: "center",
  },
});
export default ForgotPassword;
