import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { vw } from "react-native-expo-viewport-units";
import Loader from "../../components/Loader";
import { dataCenter } from "../../data/dataCenter";
import { useSelector } from "react-redux";
import profile from "../../assets/profile.png";

export default function SignupRequest({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const userId = useSelector((state) => state.userId);
  const handleAcceptPress = (id) => {
    Alert.alert(
      "Confirmation",
      "Do you want to accept?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Accept",
          onPress: async () => {
            setLoading(true);
            try {
              // Send API request
              const response = await fetch(
                `${dataCenter.apiUrl}/accept-reject-signup-request.php`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    user_id: id,
                    action: "approve", // or 'accept' depending on your logic
                  }),
                }
              );

              const result = await response.json();

              if (response.ok && result.status === "success") {
                Alert.alert("Success", result.message, [{ text: "OK" }]);
                fetchUserData();
              } else {
                Alert.alert("Error", result.message || "Something went wrong", [
                  { text: "OK" },
                ]);
              }
            } catch (error) {
              console.error("Error:", error);
              Alert.alert("Network Error", "Failed to connect to the server", [
                { text: "OK" },
              ]);
            }
            setLoading(false);
          },
          style: "default",
        },
      ],
      { cancelable: true }
    );
  };

  const handleRejectPress = (id) => {
    Alert.alert(
      "Confirmation",
      "Do you want to reject?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          onPress: async () => {
            setLoading(true);
            try {
              // Send API request
              const response = await fetch(
                `${dataCenter.apiUrl}/accept-reject-signup-request.php`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    user_id: id,
                    action: "reject", // Reject action for the user
                  }),
                }
              );

              const result = await response.json();

              if (response.ok && result.status === "success") {
                fetchUserData();
                Alert.alert("Success", result.message, [{ text: "OK" }]);
                fetchUserData();
              } else {
                Alert.alert("Error", result.message || "Something went wrong", [
                  { text: "OK" },
                ]);
              }
            } catch (error) {
              console.error("Error:", error);
              Alert.alert("Network Error", "Failed to connect to the server", [
                { text: "OK" },
              ]);
            }
            setLoading(false);
          },
          style: "destructive", // Red color for the destructive action
        },
      ],
      { cancelable: true }
    );
  };
  const SignupRequestItem = ({ request }) => (
    <View style={styles.requestContainer}>
      <View style={styles.header}>
        <Image source={profile} style={styles.profileImage} />
        <Text style={styles.name}>{request.name}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>Name </Text>
        <Text
          style={{
            fontWeight: "600",
          }}
        >
          {request.name}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>CMS ID</Text>
        <Text
          style={{
            fontWeight: "600",
          }}
        >
          {request.username}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>Location</Text>
        <Text
          style={{
            fontWeight: "600",
          }}
        >
          {request.location}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>Designation</Text>
        <Text
          style={{
            fontWeight: "600",
          }}
        >
          {request.designation}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>Mobile</Text>
        <Text
          style={{
            fontWeight: "600",
          }}
        >
          {request.mobile}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>Signup Date</Text>
        <Text
          style={{
            fontWeight: "600",
          }}
        >
          {request.created_at.split(" ")[0]}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={handleAcceptPress.bind(this, request.id)}
        >
          <Text style={styles.acceptText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={handleRejectPress.bind(this, request.id)}
        >
          <Text style={styles.rejectText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  // Fetch user data from API
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true); // Assuming you're setting loading to true when starting to fetch data

    try {
      const response = await fetch(
        `${dataCenter.apiUrl}/signup_request_lm.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }), // Send user_id in the request body
        }
      );

      const result = await response.json();

      if (result.signup_users.length == 0) {
        navigation.navigate("LocationManager");
        return;
      }

      if (response.ok && result.status === "success") {
        setData(result.signup_users); // Assuming 'signup_users' is the correct field in the response
      } else {
        // Show an alert if there is an error with the response
        Alert.alert("Error", result.message || "Something went wrong.");
      }
    } catch (error) {
      // Show an alert if there's a network error
      Alert.alert("Network Error", "Failed to fetch data. Please try again.");
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && <Loader />}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SignupRequestItem request={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    paddingHorizontal: 10,
    paddingTop: 20,
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
  acceptButton: {
    backgroundColor: "#17385F",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 20,
    width: vw(40),
    textAlign: "center",
  },
  rejectButton: {
    backgroundColor: "#E4E9F2",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 20,
    width: vw(40),
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
});
