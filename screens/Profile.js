import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  View,
  TextInput,
} from "react-native";
import {
  Text,
  Button,
  Icon,
  Layout,
  Select,
  SelectItem,
} from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { vh, vw } from "react-native-expo-viewport-units";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { dataCenter } from "../data/dataCenter";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "../components/Loader";
import profilePic from "../assets/profile.png";
import BannerAdScreen from "../components/Ads/BannerAdScreen";

const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const userId = useSelector((state) => state.userId);
  const [s, setS] = useState(true);
  const [timeoutExecuted, setTimeoutExecuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [designation, setDesignation] = useState(""); // State for designation
  const [headQuarter, setHeadQuarter] = useState(""); // State for headquarter
  const [selectedDesignationIndex, setSelectedDesignationIndex] =
    useState(null); // State for selected designation index

  const dispatch = useDispatch();

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

  const fetchUserInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${dataCenter.apiUrl}/profile.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        setModalImage("");
        setUser(data);
        setFirstName(data.name);
        setEmail(data.email);
        setPhoneNumber(data.mobile);
        setDesignation(data.desination); // Set designation from response
        setHeadQuarter(data.head_quarter); // Set headquarter from response

        // Set the selected designation index
        const index = designations.indexOf(data.desination);
        if (index !== -1) {
          setSelectedDesignationIndex(index);
        }
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.error);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      if (!timeoutExecuted) {
        setTimeout(() => {
          setS(false);
          setTimeoutExecuted(true); // Mark the timeout as executed
        }, 2000);
      }
      fetchUserInfo();
    }, [userId])
  );

  const handleSave = async () => {
    if (!firstName || firstName.trim() === "") {
      Alert.alert("Validation Error", "Name cannot be empty");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      Alert.alert(
        "Validation Error",
        "Please enter a valid phone number (10 digits)"
      );
      return;
    }

    const updatedUser = new FormData();
    updatedUser.append("user_id", userId);
    updatedUser.append("name", firstName);
    updatedUser.append("email", email);
    updatedUser.append("mobile", phoneNumber);
    updatedUser.append("desination", designation); // Append designation
    updatedUser.append("head_quarter", headQuarter); // Append headquarter

    if (modalImage) {
      updatedUser.append("image", {
        uri: modalImage,
        type: "image/jpeg",
        name: "profile_pic.jpg",
      });
    }

    setLoading(true);

    try {
      const response = await fetch(`${dataCenter.apiUrl}/update_profile.php`, {
        method: "POST",
        body: updatedUser,
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Your profile has been updated successfully!");
        fetchUserInfo();
        setEditModalVisible(false);
      } else {
        Alert.alert("Error", result.error || "An unknown error occurred");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while updating your profile.");
      console.error("Error:", error);
    }

    setLoading(false);
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setModalImage(result.assets[0].uri);
    }
  };

  return (
    <>
      <BannerAdScreen />
      <Layout style={styles.container}>
        {loading && <Loader />}

        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => {
                setModalImage("");
                setEditModalVisible(true);
              }}
              style={styles.editButton}
            >
              <Icon name="edit-outline" style={styles.editIcon} />
            </TouchableOpacity>
          </View>

          {user && (
            <>
              {user.profile_pic && user.profile_pic.length > 0 && (
                <Image
                  style={styles.profileImage}
                  source={{
                    uri: `${dataCenter.profileUrl}/${user.profile_pic}`,
                  }}
                />
              )}
              {!user.profile_pic && (
                <Image style={styles.profileImage} source={profilePic} />
              )}
              <Text style={styles.title} category="h4">
                Profile
              </Text>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.inputField}>{user.name}</Text>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.inputField}>{user.email}</Text>
              <Text style={styles.label}>Phone Number:</Text>
              <Text style={styles.inputField}>{user.mobile}</Text>
              <Text style={styles.label}>Headquarter:</Text>
              <Text style={styles.inputField}>{user.head_quarter}</Text>
              <Text style={styles.label}>Designation:</Text>
              <Text style={styles.inputField}>{user.desination}</Text>

              <Button
                style={styles.logoutButton}
                onPress={() => {
                  AsyncStorage.removeItem("user");
                  dispatch({ type: "logout" });
                  navigation.navigate("Login");
                }}
              >
                Logout
              </Button>
            </>
          )}
        </ScrollView>

        {user && (
          <Modal
            visible={isEditModalVisible}
            animationType="slide"
            transparent={true}
          >
            <Layout style={styles.modalContainer}>
              <Text category="h5" style={styles.modalTitle}>
                Edit Profile
              </Text>
              <TouchableOpacity onPress={openCamera}>
                {modalImage ? (
                  <Image
                    source={{ uri: modalImage }}
                    style={styles.modalProfileImage}
                  />
                ) : (
                  <Image
                    source={
                      user.profile_pic
                        ? {
                            uri: `${dataCenter.profileUrl}/${user.profile_pic}`,
                          }
                        : profilePic
                    }
                    style={styles.modalProfileImage}
                  />
                )}
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </TouchableOpacity>

              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
              />

              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>Headquarter</Text>
              <TextInput
                style={styles.input}
                value={headQuarter}
                onChangeText={setHeadQuarter}
                placeholder="Enter your headquarter"
              />

              <Text style={styles.label}>Designation</Text>
              <Select
                placeholder="Select Designation"
                selectedIndex={selectedDesignationIndex}
                value={designation}
                onSelect={(index) => {
                  setSelectedDesignationIndex(index);
                  setDesignation(designations[index.row]);
                }}
                style={styles.input}
              >
                {designations.map((item, index) => (
                  <SelectItem key={index} title={item} />
                ))}
              </Select>

              <Button
                onPress={handleSave}
                style={{ borderWidth: 0, backgroundColor: "#19426C" }}
              >
                Save Changes
              </Button>

              <Button
                appearance="ghost"
                onPress={() => {
                  fetchUserInfo();
                  setEditModalVisible(false);
                }}
              >
                Cancel
              </Button>
            </Layout>
          </Modal>
        )}
      </Layout>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: vh(5),
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },
  title: {
    textAlign: "center",
    marginVertical: 13,
  },
  label: {
    marginTop: 2,
    fontWeight: "bold",
    textAlign: "left", // Ensure labels are aligned to the left
  },
  inputField: {
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  logoutButton: {
    marginTop: 13,
    backgroundColor: "#17385F",
    width: vw(40),
    alignSelf: "center",
    borderWidth: 0,
    marginBottom: 10,
  },
  editButton: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    position: "absolute",
    right: 0,
    borderRadius: 100,
    backgroundColor: "#19426C",
  },
  editIcon: {
    width: 24,
    height: 24,
    tintColor: "white",
  },
  modalContainer: {
    padding: 20,
    backgroundColor: "white",
    margin: 20,
    borderRadius: 10,
    justifyContent: "center",
    // alignItems: "center",
    elevation: 10,
  },
  modalTitle: {
    marginBottom: 20,
    marginHorizontal: "auto",
  },
  modalProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    margin: "auto",
  },
  changePhotoText: {
    color: "#17385F",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 15,
    paddingVertical: 5,
  },
});

export default Profile;
