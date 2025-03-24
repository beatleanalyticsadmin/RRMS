import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { dataCenter } from "../../data/dataCenter";
import Loader from "../../components/Loader";
import profile from "../../assets/profile.png";
import { Button, Input } from "@ui-kitten/components";
import { vh, vw } from "react-native-expo-viewport-units";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";

const ComplaintsDetailsRM = ({ navigation, route }) => {
  const id = route.params.id;
  const [loading, setLoading] = useState(true);
  const [complaint, setComplaint] = useState(null);
  const [processRM, setProcessRM] = useState(null);
  const [processLM, setProcessLM] = useState(null);
  const userId = useSelector((state) => state.userId);
  const [remark, setRemark] = useState("");
  const fetchComplaintDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${dataCenter.apiUrl}/rm/complaint_details.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ complaint_id: id }),
        }
      );

      if (response.status == 200) {
        const data = await response.json();

        if (data.status === "success") {
          const proArr = data["data"]["complaint_process"];

          if (proArr.length > 0) {
            const obj = proArr.find((i) => {
              return i.manager_type == "Reception manager";
            });
            const objLM = proArr.find((i) => {
              return i.manager_type != "Reception manager";
            });

            if (objLM) {
              setProcessLM(objLM);
            } else {
              setProcessLM(null);
            }

            setProcessRM(obj);
          } else {
            setProcessRM(null);
          }
          setComplaint(data["data"]["complaint"]);
        } else {
          Alert.alert(
            "Error",
            data.message || "Failed to fetch complaint details."
          );
        }
      } else if (response.status === 404) {
        Alert.alert("Error", "Complaint not found.");
      } else if (response.status === 400) {
        Alert.alert("Error", "Invalid request. Please check the input.");
      } else {
        Alert.alert(
          "Error",
          "An unexpected error occurred. Please try again later."
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Network error. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };

  const updateComplaintStatus = async () => {
    setLoading(true);
    try {
      // Define the URL for your PHP API endpoint
      const apiUrl = `${dataCenter.apiUrl}/rm/escalate_complaint.php`;

      // Prepare the request payload
      const payload = {
        user_id: userId,
        complaint_id: id,
        remark,
      };

      // Make the POST request to the PHP backend
      const response = await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // Parse the response as JSON
      const data = await response.json();

      if (response.ok) {
        // Handle success response
        Alert.alert("Success", data.message || "Status updated successfully");
        fetchComplaintDetails();
      } else {
        // Handle failure response
        Alert.alert("Error", data.message || "An error occurred");
      }
    } catch (error) {
      // Handle network or server errors
      console.error(error);
      Alert.alert("Error", "Unable to update status. Please try again later.");
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchComplaintDetails();
    }, [])
  );
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {loading && <Loader />}
      {!loading && complaint && (
        <>
          <Text
            style={{
              fontSize: 21,
              fontWeight: "bold",
              paddingVertical: 18,
              paddingHorizontal: 5,
            }}
          >
            Running Staff Details
          </Text>
          {complaint && (
            <View style={styles.requestContainer}>
              <View style={styles.header}>
                {complaint.guest_photo && complaint.guest_photo.length > 0 && (
                  <Image
                    source={{
                      uri: `${dataCenter.profileUrl}/${complaint.guest_photo}`,
                    }}
                    style={[
                      styles.profileImage,
                      {
                        width: 60,
                        height: 60,
                        borderRadius: 100,
                        marginVertical: 10,
                      },
                    ]}
                  />
                )}
                {!complaint.guest_photo && (
                  <Image source={profile} style={styles.profileImage} />
                )}
                <Text style={styles.name}>{complaint.guest_name}</Text>
              </View>

              <View style={styles.info}>
                <Text style={styles.label}>CMS ID</Text>
                <Text
                  style={{
                    fontWeight: "600",
                  }}
                >
                  {complaint.guest_cmsid}
                </Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.label}>Head Quarter</Text>
                <Text
                  style={{
                    fontWeight: "600",
                  }}
                >
                  {complaint.head_quarter}
                </Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.label}>Mobile</Text>
                <Text
                  style={{
                    fontWeight: "600",
                  }}
                >
                  {complaint.mobile}
                </Text>
              </View>
            </View>
          )}
          <Text
            style={{
              fontSize: 21,
              fontWeight: "bold",
              paddingVertical: 18,
              paddingHorizontal: 5,
            }}
          >
            Current Complaint Details
          </Text>
          {complaint && (
            <>
              <View style={styles.requestContainer}>
                <View style={styles.info}>
                  <Text style={styles.label}>Complaint ID</Text>
                  <Text
                    style={{
                      fontWeight: "600",
                    }}
                  >
                    {id}
                  </Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.label}>Complaint Type</Text>
                  <Text
                    style={{
                      fontWeight: "600",
                    }}
                  >
                    {complaint.complaint_type}
                  </Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.label}>Location</Text>
                  <Text
                    style={{
                      fontWeight: "600",
                    }}
                  >
                    {complaint.guest_location_name}
                  </Text>
                </View>

                <View style={styles.info}>
                  <Text style={styles.label}>Complaint Date</Text>
                  <Text
                    style={{
                      fontWeight: "600",
                    }}
                  >
                    {complaint.complaint_date
                      ? complaint.complaint_date.split(" ")[0]
                      : "-"}
                  </Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.label}>Staff Remark</Text>
                  <Text
                    style={{
                      fontWeight: "600",
                      maxWidth: "70%",
                    }}
                  >
                    {complaint.guest_remark}
                  </Text>
                </View>
              </View>
              <Image
                source={{
                  uri: `${dataCenter.complaintsUrl}/${complaint.complaint_image}`,
                }}
                resizeMethod="contain"
                resizeMode="contain"
                style={{
                  marginVertical: 10,
                  width: "100%",
                  height: undefined, // Allow dynamic height
                  aspectRatio: 1, // Maintain aspect ratio
                }}
              />
            </>
          )}
          {!processRM && !loading && (
            <View
              style={{
                backgroundColor: "white",
                paddingHorizontal: 20,
                paddingVertical: 20,
              }}
            >
              <Input
                placeholder="Write your remarks here..."
                multiline={true}
                textStyle={{ minHeight: 80 }}
                style={styles.input}
                onChangeText={(text) => {
                  setRemark(text);
                }}
              />
              <Button
                style={styles.submitButton}
                onPress={updateComplaintStatus}
              >
                Esclate
              </Button>
            </View>
          )}

          {processRM && !loading && (
            <>
              <Text
                style={{
                  fontSize: 21,
                  fontWeight: "bold",
                  paddingVertical: 18,
                  paddingHorizontal: 5,
                }}
              >
                Reception Manger{" "}
              </Text>
              <View style={styles.requestContainer}>
                <View style={styles.info}>
                  <Text style={styles.label}>Remark</Text>
                  <Text
                    style={{
                      fontWeight: "600",
                      maxWidth: "70%",
                    }}
                  >
                    {processRM.remark}
                  </Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.label}>Status</Text>
                  <Text
                    style={{
                      fontWeight: "600",
                      backgroundColor: "orange",
                      color: "white",
                      paddingVertical: 4,
                      paddingHorizontal: 10,
                      borderRadius: 10,
                    }}
                  >
                    Esclated
                  </Text>
                </View>
              </View>
            </>
          )}
          {processLM && !loading && (
            <>
              <Text
                style={{
                  fontSize: 21,
                  fontWeight: "bold",
                  paddingVertical: 18,
                  paddingHorizontal: 5,
                }}
              >
                Location Manger{" "}
              </Text>
              <View style={styles.requestContainer}>
                <View style={styles.info}>
                  <Text style={styles.label}>Remark</Text>
                  <Text
                    style={{
                      fontWeight: "600",
                      maxWidth: "70%",
                    }}
                  >
                    {processLM.remark}
                  </Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.label}>Status</Text>
                  <Text
                    style={{
                      fontWeight: "600",
                      backgroundColor: "green",
                      color: "white",
                      paddingVertical: 4,
                      paddingHorizontal: 10,
                      borderRadius: 10,
                    }}
                  >
                    {processLM.status}
                  </Text>
                </View>
              </View>
            </>
          )}
        </>
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  submitButton: {
    borderRadius: 25,
    backgroundColor: "#17385F",
    borderColor: "transparent",
    width: vw(50),
    marginHorizontal: "auto",
    marginVertical: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  listContent: {
    paddingBottom: 20,
  },
  requestContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    paddingVertical: 5,
    paddingBottom: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginHorizontal: 1,
  },
  profileImage: {
    width: 40,
    height: 80,
    borderRadius: 20,
    marginRight: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    marginHorizontal: 8,
  },
  label: {
    color: "#8F9BB3",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    gap: 10,
  },

  acceptText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  rejectText: {
    color: "black",
    textAlign: "center",
  },
  input: {
    elevation: 1,
    backgroundColor: "white",
  },
});

export default ComplaintsDetailsRM;
