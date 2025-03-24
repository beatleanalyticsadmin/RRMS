import { useEffect, useState } from "react";
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
import { Button, Icon, Input, Select, SelectItem } from "@ui-kitten/components";
import { TouchableRipple } from "react-native-paper";
import { useDispatch } from "react-redux";
import logo from "../assets/train.png";
import { TouchableOpacity } from "react-native-gesture-handler";
import { dataCenter } from "../data/dataCenter";
import Loader from "../components/Loader";

const Signup = ({ navigation }) => {
  const defaultFields = {
    zone: "",
    division: "",
    location: "",
    name: "",
    phone: "",
    headquarter: "",
    cmsId: "",
    gender: "",
    designation: "",
    password: "",
    confirmPassword: "",
    email: "",
  };

  const gender = ["Male", "Female"];
  const designations = [
    "LP (M/Exp)",
    "LP (P)",
    "LP (G)",
    "LP (Sh)",
    "Sr ALP",
    "ALP",
    "CLI",
    "TM",
  ];

  const [formFields, setFields] = useState(defaultFields);
  const apiUrl = dataCenter.apiUrl;
  const dispatch = useDispatch();
  const [username, setUsername] = useState(""); // State for username
  const [password, setPassword] = useState(""); // State for password
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedPage, setSelPage] = useState("railways");
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(null); // State for the select option
  const [zones, setZones] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [locations, setLocations] = useState([]);

  const zonefetcher = async () => {
    setLoading(true);
    const zone = await fetch(`${apiUrl}/zone.php`, {
      method: "GET",
    });
    const zoneD = await zone.json();

    setZones(zoneD);
    setLoading(false);
  };

  const divisionFetcher = async (id) => {
    setLoading(true);
    setDivisions([]);
    const div = await fetch(`${apiUrl}/division.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        zone_id: id,
      }),
    });
    const divD = await div.json();

    setDivisions(divD);
    setLoading(false);
  };
  const locationFetcher = async (zoneId, divId) => {
    setLoading(true);
    const loca = await fetch(`${apiUrl}/location.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        zone_id: zoneId,
        division_id: divId,
      }),
    });
    const locaD = await loca.json();

    setLocations(locaD);
    setLoading(false);
  };

  useEffect(() => {
    zonefetcher();

    return () => {};
  }, []);

  const renderEmailIcon = (props) => (
    <Icon {...props} name="person-outline" fill="#335075" />
  );
  const rednerHeadq = (props) => (
    <Icon {...props} name="home-outline" fill="#335075" />
  );
  const renderPhoneIcon = (props) => (
    <Icon {...props} name="phone-outline" fill="#335075" />
  );
  const renderEmailInpIcon = (props) => (
    <Icon {...props} name="email-outline" fill="#335075" />
  );

  const renderLockIcon = (props) => (
    <Icon {...props} name="lock" fill="#335075" />
  );

  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon
        {...props}
        name={secureTextEntry ? "eye-off" : "eye"}
        fill="#335075"
      />
    </TouchableWithoutFeedback>
  );

  const toggleSecureEntry = () => {
    setSecureTextEntry((prevState) => !prevState);
  };

  const renderMapIcon = (props) => (
    <Icon {...props} name="map-outline" fill="#335075" />
  );
  const handleSubmit = async () => {
    // Validate individual fields
    if (!formFields.zone) {
      Alert.alert("Error", "Zone is required.");
      return;
    }

    if (!formFields.division) {
      Alert.alert("Error", "Division is required.");
      return;
    }

    if (!formFields.location) {
      Alert.alert("Error", "Location is required.");
      return;
    }

    if (!formFields.name) {
      Alert.alert("Error", "Name is required.");
      return;
    }

    if (!formFields.phone) {
      Alert.alert("Error", "Phone number is required.");
      return;
    }

    if (!formFields.headquarter) {
      Alert.alert("Error", "Headquarter is required.");
      return;
    }

    if (!formFields.cmsId) {
      Alert.alert("Error", "CMS ID is required.");
      return;
    }

    if (!formFields.gender) {
      Alert.alert("Error", "Gender is required.");
      return;
    }

    if (!formFields.designation) {
      Alert.alert("Error", "Designation is required.");
      return;
    }

    if (!formFields.email) {
      Alert.alert("Error", "Email is required.");
      return;
    }

    if (!formFields.password) {
      Alert.alert("Error", "Password is required.");
      return;
    }

    if (!formFields.confirmPassword) {
      Alert.alert("Error", "Confirm password is required.");
      return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formFields.email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    // Validate phone number format (example: at least 10 digits)
    const phonePattern = /^\d{10,}$/; // Adjust based on your requirements
    if (!phonePattern.test(formFields.phone)) {
      Alert.alert(
        "Error",
        "Please enter a valid phone number (at least 10 digits)."
      );
      return;
    }

    // Check if passwords match
    if (formFields.password !== formFields.confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    // Validate password strength (example: at least 8 characters)
    if (formFields.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return;
    }
    setLoading(true);

    const payload = {
      zone: formFields.zone,
      division: formFields.division,
      location: formFields.location,
      name: formFields.name,
      phone: formFields.phone,
      headquarter: formFields.headquarter,
      cmsid: formFields.cmsId,
      gender: formFields.gender,
      designation: formFields.designation,
      email: formFields.email,
      password: formFields.password,
      confirm_password: formFields.confirmPassword,
    };

    try {
      const response = await fetch(`${dataCenter.apiUrl}/signup.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to sign up");
      }

      const data = await response.json();

      // Optional: Handle successful signup
      Alert.alert("Success", "Signup successful, Kindly Login!");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", error.message || "An unexpected error occurred.");
    }
    setLoading(false);
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {loading && <Loader />}
      <View style={styles.container}>
        {/* <View style={styles.formSelectorBox}>
          <TouchableRipple
            style={[
              styles.formSelector,
              {
                borderTopLeftRadius: 15,
                borderBottomLeftRadius: 15,
                borderLeftColor: "red",
                borderRightWidth: 1,
                backgroundColor: `${
                  selectedPage === "railways" ? "#17385F" : "#dedfe0"
                }`,
              },
            ]}
            onPress={() => {
              setSelPage("railways");
            }}
          >
            <Text
              style={[
                styles.selectorText,
                {
                  color: `${selectedPage === "railways" ? "white" : "black"}`,
                },
              ]}
            >
              Railways
            </Text>
          </TouchableRipple>
          <TouchableRipple
            style={[
              styles.formSelector,
              {
                borderTopRightRadius: 15,
                borderBottomRightRadius: 15,
                backgroundColor: `${
                  selectedPage === "contractor" ? "#17385F" : "#dedfe0"
                }`,
              },
            ]}
            onPress={() => {
              setSelPage("contractor");
            }}
          >
            <Text
              style={[
                styles.selectorText,
                {
                  color: `${selectedPage === "contractor" ? "white" : "black"}`,
                },
              ]}
            >
              Contractor
            </Text>
          </TouchableRipple>
        </View> */}

        <Text style={styles.formHeading}>Signup {selectedPage}</Text>
        {selectedPage === "railways" && (
          <View style={styles.formBox}>
            <Select
              label="Zone"
              placeholder="Select a zone"
              selectedIndex={selectedRoleIndex}
              onSelect={(index) => {
                divisionFetcher(zones[index["row"]]["id"]);

                setFields({
                  ...formFields,
                  zone: zones[index["row"]]["id"],
                  division: "",
                  location: "",
                });
              }}
              value={
                formFields.zone.length > 0
                  ? zones.find((z) => {
                      return z.id == formFields.zone;
                    })["zone"]
                  : ""
              }
              style={styles.formSelectInput}
              accessoryLeft={renderMapIcon} // Add the map icon on the right side
            >
              {zones.map((z) => {
                return <SelectItem key={z.id} title={z.zone} />;
              })}
            </Select>
            <Select
              label="Division"
              placeholder="Select a role"
              selectedIndex={selectedRoleIndex}
              value={
                formFields.division.length > 0
                  ? divisions.find((z) => {
                      return z.id == formFields.division;
                    })["division"]
                  : ""
              }
              onSelect={(index) => {
                locationFetcher(formFields.zone, divisions[index["row"]]["id"]);

                setFields({
                  ...formFields,
                  division: divisions[index["row"]]["id"],
                  location: "",
                });
              }}
              style={styles.formSelectInput}
              accessoryLeft={renderMapIcon} // Add the map icon on the right side
            >
              {divisions.length > 0 &&
                divisions.map((div, ind) => {
                  return <SelectItem key={div.id} title={div.division} />;
                })}
            </Select>
            <Select
              label="Location"
              placeholder="Select location"
              value={
                formFields.location.length > 0
                  ? locations.find((z) => {
                      return z.id == formFields.location;
                    })["location"]
                  : ""
              }
              style={styles.formSelectInput}
              onSelect={(index) => {
                setFields({
                  ...formFields,
                  location: locations[index["row"]]["id"],
                });
              }}
              accessoryLeft={renderMapIcon} // Add the map icon on the right side
            >
              {locations.length > 0 &&
                locations.map((loc, ind) => {
                  return <SelectItem key={ind} title={loc.location} />;
                })}
            </Select>

            {/* CMS ID Input */}
            <Input
              label="Name"
              placeholder="Name"
              accessoryLeft={renderEmailIcon}
              style={styles.formTextInput}
              size="large"
              value={formFields.name} // Bind the value to state
              onChangeText={(nextValue) =>
                setFields({ ...formFields, name: nextValue })
              } // Update state on change
            />
            <Input
              label="Email"
              placeholder="Email"
              accessoryLeft={renderEmailInpIcon}
              style={styles.formTextInput}
              size="large"
              value={formFields.email} // Bind the value to state
              onChangeText={(nextValue) =>
                setFields({ ...formFields, email: nextValue })
              } // Update state on change
            />
            <Input
              label="Phone"
              placeholder="Phone Number"
              accessoryLeft={renderPhoneIcon}
              style={styles.formTextInput}
              size="large"
              keyboardType="numeric"
              value={formFields.phone}
              onChangeText={(nextValue) =>
                setFields({ ...formFields, phone: nextValue })
              }
            />
            <Input
              label="Head Quarter"
              placeholder="Head Quarter"
              accessoryLeft={rednerHeadq}
              style={styles.formTextInput}
              size="large"
              value={formFields.headquarter}
              onChangeText={(nextValue) =>
                setFields({ ...formFields, headquarter: nextValue })
              }
            />
            <Input
              label="CMS ID"
              placeholder="CMS ID"
              accessoryLeft={renderEmailIcon}
              style={styles.formTextInput}
              size="large"
              value={formFields.cmsId}
              onChangeText={(nextValue) =>
                setFields({ ...formFields, cmsId: nextValue })
              }
            />

            {/* Role Select Dropdown with Map Icon */}

            <Select
              label="Gender"
              placeholder="Select gender"
              selectedIndex={selectedRoleIndex}
              value={formFields.gender}
              onSelect={(index) => {
                setFields({
                  ...formFields,
                  gender: gender[index["row"]],
                });
              }}
              style={styles.formSelectInput}
              accessoryLeft={<Icon name="people-outline" fill="#335075" />} // Add the map icon on the right side
            >
              {gender.map((g, ind) => {
                return <SelectItem key={ind} title={g} />;
              })}
            </Select>
            <Select
              label="Designation"
              placeholder="Select Designation"
              selectedIndex={selectedRoleIndex}
              value={formFields.designation}
              onSelect={(index) => {
                setFields({
                  ...formFields,
                  designation: designations[index["row"]],
                });
              }}
              style={styles.formSelectInput}
              accessoryLeft={renderMapIcon} // Add the map icon on the right side
            >
              {designations.map((g, ind) => {
                return <SelectItem key={ind} title={g} />;
              })}
            </Select>

            {/* Password Input */}
            <Input
              label="Password"
              placeholder="Password"
              accessoryRight={renderIcon}
              accessoryLeft={renderLockIcon}
              secureTextEntry={secureTextEntry}
              style={styles.formTextInput}
              size="large"
              value={formFields.password}
              onChangeText={(nextValue) =>
                setFields({ ...formFields, password: nextValue })
              }
            />
            <Input
              label="Confirm Password"
              placeholder="Password"
              accessoryLeft={renderLockIcon}
              secureTextEntry={false}
              style={styles.formTextInput}
              size="large"
              value={formFields.confirmPassword}
              onChangeText={(nextValue) =>
                setFields({ ...formFields, confirmPassword: nextValue })
              }
            />

            <Button
              style={{ ...styles.formBtn, borderColor: "transparent" }}
              status="primary"
              size="large"
              onPress={handleSubmit}
            >
              Signup
            </Button>

            <View style={{ paddingHorizontal: 20 }}>
              <TouchableRipple onPress={() => navigation.navigate("Login")}>
                <Text
                  style={{
                    color: "#878787",
                    textAlign: "center",
                    fontSize: 15,
                  }}
                >
                  Already have account?{"   "}
                  <Text style={{ color: "#163053", fontWeight: "900" }}>
                    Login
                  </Text>
                </Text>
              </TouchableRipple>
            </View>

            <View style={{ paddingHorizontal: 20 }}>
              <Text
                style={{
                  color: "#878787",
                  textAlign: "center",
                  fontSize: 14,
                  fontWeight: 400,
                }}
              >
                By continuing, you agree to the{" "}
                <Text
                  style={{
                    color: "black",
                    textAlign: "center",
                    fontWeight: 500,
                  }}
                >
                  Terms of Services{" "}
                </Text>
                &{" "}
                <Text
                  style={{
                    color: "black",
                    textAlign: "center",
                    fontWeight: 500,
                  }}
                >
                  Privacy Policy
                </Text>
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  formSelectorBox: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    marginBottom: 20,
  },
  formSelector: {
    width: vw(45),
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 19,
  },
  selectorText: {
    fontSize: 16,
    color: "white",
    fontWeight: "700",
  },

  logoBox: {
    flex: 0.7,
    justifyContent: "center",
    alignItems: "start",
  },
  logo: {
    width: vw(24),
    marginTop: -50,
  },
  formHeading: {
    fontSize: 22,
    fontWeight: "900",
    textAlign: "start",
    color: "#163053",
    textAlign: "center",
    textTransform: "capitalize",
  },
  formBox: {
    flex: 3,
    justifyContent: "start",
    alignItems: "center",
    gap: 10,
    position: "relative",
    marginTop: 20,
    paddingBottom: 50,
  },
  formTextInput: {
    backgroundColor: "white",
    width: "100%",
    paddingHorizontal: 1,
  },
  formSelectInput: {
    backgroundColor: "white",
    width: "100%",
    paddingHorizontal: 1,
    paddingVertical: 5,
    // marginTop: 10,
  },
  formBtn: {
    width: vw(90),
    height: vh(7),
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    textAlign: "center",
    backgroundColor: "#163053",
    marginHorizontal: "auto",
    borderRadius: 10,
    borderWidth: 0,
  },
});

export default Signup;
