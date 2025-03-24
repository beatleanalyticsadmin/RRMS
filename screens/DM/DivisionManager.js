import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  BackHandler,
} from "react-native";
import { Layout, Button, Divider } from "@ui-kitten/components";
import { Icon } from "react-native-elements";
import { vh, vw } from "react-native-expo-viewport-units";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useFocusEffect } from "@react-navigation/native";
import { dataCenter } from "../../data/dataCenter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native-gesture-handler";

const DivisionManager = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const userId = useSelector((state) => state.userId);
  const [rooms, setRooms] = useState(null);
  const [meals, setMeals] = useState(null);
  const [feedbacks, setFeedbacks] = useState(null);
  const [complaints, setComplaints] = useState(null);
  const [ghi, setGhi] = useState(null);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    dispatch({ type: "logout" });
    navigation.navigate("Login");
    setData(null);
  };

  const showLogoutConfirmation = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: handleLogout, style: "destructive" },
      ],
      { cancelable: false }
    );
  };
  const fetchUserDataInIntv = async () => {
    try {
      const response = await fetch(
        `${dataCenter.apiUrl}/dm/division_manager.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );

      if (response.ok) {
        const json = await response.json();

        setRooms(json.occupancy);
        setMeals(json.meals);
        setComplaints(json.complaints);
        setFeedbacks(json.feedback);
        setGhi(json.GHI);
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.error || "An error occurred");
      }
    } catch (err) {
      Alert.alert("Network Error", err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };
  const fetchUserData = async () => {
    setData(null);
    setLoading(true);

    try {
      const response = await fetch(
        `${dataCenter.apiUrl}/dm/division_manager.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );

      if (response.ok) {
        const json = await response.json();

        setRooms(json.occupancy);
        setMeals(json.meals);
        setComplaints(json.complaints);
        setFeedbacks(json.feedback);
        setGhi(json.GHI);
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.error || "An error occurred");
      }
    } catch (err) {
      Alert.alert("Network Error", err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };
  useEffect(() => {
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
    fetchUserData();
    const intervalId = setInterval(() => {
      fetchUserDataInIntv();
    }, 10000); // Calls fetcher every 1 second

    return () => {
      clearInterval(intervalId);
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, []);

  return (
    <Layout style={styles.container}>
      {loading && <Loader />}

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.locationText}>Division Manager</Text>
        <Divider style={styles.divider} />

        {/* Rooms Section */}
        <TouchableOpacity
          style={[styles.card, styles.elevation]}
          onPress={() => {
            navigation.navigate("DetailsScreen", {
              page: "Rooms",
              locations: rooms.locations,
            });
          }}
        >
          <Text style={styles.sectionTitle}>Occupancy</Text>
          <View style={styles.row}>
            <Icon
              name="bed"
              type="material"
              color={"#163053"}
              containerStyle={styles.iconContainer}
              size={22}
            />
            <Text style={styles.label}>Total</Text>
            <Text style={styles.value}>
              {rooms ? rooms.overall.total_occupancy : "-"}
            </Text>
          </View>
          <View style={styles.row}>
            <Icon
              name="king-bed"
              type="material"
              color={"#163053"}
              containerStyle={styles.iconContainer}
              size={22}
            />
            <Text style={styles.label}>Occupied</Text>
            <Text style={styles.value}>
              {" "}
              {rooms ? rooms.overall.total_occupied : "-"}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.elevation]}
          onPress={() => {
            navigation.navigate("DetailsScreen", {
              page: "Meals",
              locations: meals.locations,
            });
          }}
        >
          <Text style={styles.sectionTitle}>Meals</Text>
          <View style={styles.row}>
            <Icon
              name="fast-food-outline"
              type="ionicon"
              color={"#163053"}
              containerStyle={styles.iconContainer}
              size={22}
            />
            <Text style={styles.label}>Orders</Text>

            <Text style={styles.value}>
              {meals ? meals.overall.total_meal_ordered : "-"}
            </Text>
          </View>
          <View style={styles.row}>
            <Icon
              name="delivery-dining"
              type="material"
              color={"#163053"}
              containerStyle={styles.iconContainer}
              size={22}
            />
            <Text style={styles.label}>Served</Text>

            <Text style={styles.value}>
              {meals ? meals.overall.total_meal_served : "-"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Complaints Section */}
        <TouchableOpacity
          style={[styles.card, styles.elevation]}
          onPress={() => {
            navigation.navigate("DetailsScreen", {
              page: "Feedbacks",
              locations: feedbacks.locations,
            });
          }}
        >
          <Text style={styles.sectionTitle}>Feedbacks</Text>
          <View style={styles.row}>
            <Icon
              name="calendar-today"
              type="calendar_month"
              size={20}
              color={"#163053"}
              containerStyle={styles.iconContainer}
            />
            <Text style={styles.label}>Today</Text>
            <Text style={styles.value}>
              {feedbacks ? feedbacks.overall.total_today_feedback : "-"}
            </Text>
          </View>
          <View style={styles.row}>
            <Icon
              name="calendar-month"
              type="calendar_month"
              size={20}
              containerStyle={styles.iconContainer}
            />
            <Text style={styles.label}>Month</Text>
            <Text style={styles.value}>
              {" "}
              {feedbacks ? feedbacks.overall.total_monthly_feedback : "-"}
            </Text>
          </View>
        </TouchableOpacity>
        {/* Complaints Section */}
        <TouchableOpacity
          style={[styles.card, styles.elevation]}
          onPress={() => {
            navigation.navigate("DetailsScreen", {
              page: "Complaints",
              locations: complaints.locations,
            });
          }}
        >
          <Text style={styles.sectionTitle}>Complaints</Text>
          <View style={styles.row}>
            <Icon
              name="message-alert-outline"
              type="material-community"
              size={20}
              containerStyle={styles.iconContainer}
            />
            <Text style={styles.label}>Open</Text>
            <Text style={styles.value}>
              {complaints ? complaints.overall.total_open_complaints : "-"}
            </Text>
          </View>
          <View style={styles.row}>
            <Icon
              name="message-alert"
              type="material-community"
              size={20}
              containerStyle={styles.iconContainer}
            />
            <Text style={styles.label}>Closed</Text>
            <Text style={styles.value}>
              {complaints ? complaints.overall.total_closed_complaints : "-"}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.card, styles.elevation]}
          onPress={() => {
            navigation.navigate("DetailsScreen", {
              page: "GHI",
              locations: ghi.locations,
            });
          }}
        >
          <Text style={styles.sectionTitle}>GHI</Text>
          <View style={styles.row}>
            <Icon
              name="percent"
              type="material"
              size={20}
              containerStyle={styles.iconContainer}
            />
            <Text style={styles.label}>GHI</Text>
            <Text style={styles.value}>{ghi ? ghi.overall.ghi : "-"}</Text>
          </View>
          <View style={styles.row}>
            <Icon
              name="percent"
              type="material"
              size={20}
              containerStyle={styles.iconContainer}
            />
            <Text style={styles.label}>Max GHI score</Text>
            <Text style={styles.value}>
              {ghi ? ghi.overall.max_possible_score : "-"}
            </Text>
          </View>
        </TouchableOpacity>

        <Button style={styles.button} onPress={showLogoutConfirmation}>
          Logout
        </Button>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
  locationText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  divider: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#163053",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  iconContainer: {
    backgroundColor: "#F0F0F0",
    padding: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: "#163053",
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "green",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#163053",
    width: vw(50),
    alignSelf: "center",
    borderWidth: 0,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    marginHorizontal: 5,
  },
  elevation: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default DivisionManager;
