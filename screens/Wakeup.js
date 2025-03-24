import React, { useCallback, useEffect, useState } from "react";
import {
  Layout,
  Text,
  Select,
  SelectItem,
  Button,
  Card,
} from "@ui-kitten/components";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Icon } from "react-native-elements";
import alarm from "../assets/alarm.png";
import { useSelector } from "react-redux";
import { dataCenter } from "../data/dataCenter";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "../components/Loader";
import { vh, vw } from "react-native-expo-viewport-units";
import BannerAdScreen from "../components/Ads/BannerAdScreen";

import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";

const androidAdmobInterstitial = "ca-app-pub-6455906013208664/7842423502";
const productionID = androidAdmobInterstitial;
const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : productionID; // Use TestIds in development
const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  keywords: [
    "food",
    "cooking",
    "fruit",
    "railway",
    "india",
    "cricket",
    "bollywood",
    "spices",
    "travel",
    "yoga",
    "temples",
    "festivals",
    "diwali",
    "holi",
    "shopping",
    "fashion",
    "street food",
    "chai",
    "tours",
    "heritage",
    "education",
    "technology",
    "smartphones",
    "apps",
    "fitness",
    "meditation",
    "health",
    "careers",
    "jobs",
    "startups",
    "wedding",
    "music",
    "dance",
    "ayurveda",
    "culture",
    "history",
    "tourism",
    "spirituality",
    "cruises",
    "luxury",
    "real estate",
    "business",
    "finance",
    "banking",
    "e-commerce",
    "festive shopping",
    "gadgets",
    "agriculture",
    "news",
    "politics",
    "sports",
    "hobbies",
    "entertainment",
    "regional languages",
    "comedy",
    "daily news",
    "recipes",
    "restaurants",
    "parenting",
    "kids",
    "family",
    "education apps",
    "government jobs",
    "budget planning",
    "pet care",
    "books",
    "gaming",
    "quizzes",
    "puzzles",
  ],
  requestNonPersonalizedAdsOnly: true, // Show non-personalized ads
  additionalRequestParameters: {
    max_ad_content_rating: "G", // Filter out adult content
    tag_for_under_age_of_consent: true, // Enable child-directed ads if necessary
  },
});

const Wakeup = ({ navigation }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Event listener for when the ad is loaded
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
      }
    );

    // Event listener for when the ad is closed
    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setLoaded(false);
        interstitial.load(); // Load a new ad
      }
    );

    interstitial.load(); // Start loading the interstitial ad

    // Cleanup on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);
  const handleShowAd = () => {
    if (loaded) {
      try {
        interstitial.show();
      } catch (error) {}
    } else {
    }
  };
  const [arrivalTime, setArrivalTime] = useState(null);
  const [wakeupTime, setWakeupTime] = useState(null);
  const [showArrivalPicker, setShowArrivalPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const userId = useSelector((state) => state.userId);
  const [checkIn, setCheckIn] = useState(null);
  const [bookingFromDate, setBookingFromDate] = useState(null);
  const apiUrl = dataCenter.apiUrl;
  const activBooking = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/booking_status.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) {
        // Handle HTTP errors
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setLoading(false);

      setCheckIn(data.booking);
      if (data.booking.status != 2) {
        Alert.alert(
          "Attention",
          "You must have an active booking to set wakeup call.",
          [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("Home");
              },
            },
          ]
        );
      } else {
        wakeupTimeFetcher();
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching booking status:", error);
      Alert.alert(
        "Error",
        "Something went wrong while checking your booking status. Please try again later.",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("Home");
            },
          },
        ]
      );
    }
  };
  const wakeupTimeFetcher = async () => {
    setLoading(true);
    const res = await fetch(`${apiUrl}/wakeup-call.php`, {
      method: "POST",
      body: JSON.stringify({ id: userId }),
    });
    const data = await res.json();
    console.log(data);

    if (res.status == 200) {
      const time =
        data.wakeup_time != null
          ? data.wakeup_time.split(" ")[1].split(":")[0] +
            ":" +
            data.wakeup_time.split(" ")[1].split(":")[1]
          : "";
      const dte =
        data.wakeup_time != null ? data.wakeup_time.split(" ")[0] : "";
      checkoutDte = data.req_checkout_date.split(" ")[0];
      const date = new Date(checkoutDte);

      const formattedDate = `${String(date.getDate()).padStart(
        2,
        "0"
      )}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
      const checkoutTime =
        data.req_checkout_date.split(" ")[1].split(":")[0] +
        ":" +
        data.req_checkout_date.split(" ")[1].split(":")[1];

      const obj = {
        ...data,
        time,
        dte,
        checkoutDate: formattedDate,
        checkoutTime: checkoutTime,
      };

      setWakeupTime(obj);
    }
    setLoading(false);
  };

  const renderAccessory = (iconName, from) => (
    <Icon
      name={iconName}
      style={styles.icon}
      type={from}
      size={22}
      color="#335075"
    />
  );
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);

    if (selectedDate) {
      // Get today's date and reset the time to midnight for comparison
      const today = new Date();

      today.setHours(0, 0, 0, 0); // Set time to midnight

      // Create a new Date object from the selected date
      const selectedDateObj = new Date(selectedDate);
      selectedDateObj.setHours(0, 0, 0, 0); // Reset time to midnight for comparison

      // Parse the formatted max date (dd-mm-yyyy) to create a Date object
      const [day, month, year] = wakeupTime.checkoutDate.split("-");
      const maxDate = new Date(`${year}-${month}-${day}T00:00:00`);

      // Check if the selected date is in the past
      if (selectedDateObj.getTime() < today.getTime()) {
        Alert.alert("Invalid Date", "The date cannot be in the past.", [
          { text: "OK" },
        ]);
        // getToadydate(); // Reset the date picker
      }
      // Check if the selected date exceeds the maximum allowed date
      else if (selectedDateObj.getTime() > maxDate.getTime()) {
        Alert.alert(
          "Invalid Date",
          `The date cannot exceed checkout date - ${wakeupTime.checkoutDate}.`,
          [{ text: "OK" }]
        );
        // getToadydate(); // Reset the date picker
      } else {
        // Proceed with setting the selected date if it's within the allowed range
        setDate(selectedDate);

        const date = new Date(selectedDate);

        // Convert to IST by adding 5 hours and 30 minutes
        const istOffset = 5 * 60 + 30; // IST offset in minutes

        const utcDate = new Date(
          date.getTime() + date.getTimezoneOffset() * 60000
        );
        const istDate = new Date(utcDate.getTime() + istOffset * 60000);

        // Extract day, month, and year
        const day = String(istDate.getDate()).padStart(2, "0");
        const month = String(istDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
        const year = istDate.getFullYear();
        const dateISt = `${day}-${month}-${year}`;

        setBookingFromDate(dateISt);
        setArrivalTime(null);
      }
    }
  };
  const onArrivalTimeChange = (event, selectedTime) => {
    // Check if bookingFromDate is null
    if (!bookingFromDate) {
      Alert.alert(
        "Error",
        "Please select the booking date before selecting a time.",
        [{ text: "OK" }]
      );
      setShowArrivalPicker(false);
      return; // Exit the function early
    }

    setShowArrivalPicker(Platform.OS === "ios");

    if (event.type === "set" && selectedTime) {
      // Convert the selected time to a Date object
      const selectedDateTime = new Date(selectedTime);

      // Convert bookingFromDate to a comparable format (yyyy-mm-dd)
      const [day, month, year] = bookingFromDate.split("-");
      const bookingDate = new Date(`${year}-${month}-${day}`).toDateString();

      // Get today's date in a comparable format (yyyy-mm-dd)
      const today = new Date();
      const todayString = today.toDateString();

      // Check if bookingFromDate is today's date
      const isToday = bookingDate === todayString;

      if (isToday) {
        // If it's today, check if the selected time is in the past
        const currentTime = new Date();

        // Check if the selected time is less than 30 minutes from the current time
        const minTime = new Date(currentTime.getTime() + 30 * 60000); // 30 minutes from now

        if (selectedDateTime.getTime() < currentTime.getTime()) {
          Alert.alert(
            "Invalid Time",
            "The selected time cannot be in the past.",
            [{ text: "OK" }]
          );
          return; // Stop execution
        }

        if (selectedDateTime.getTime() < minTime.getTime()) {
          Alert.alert(
            "Invalid Time",
            "The selected time must be at least 30 minutes from the current time.",
            [{ text: "OK" }]
          );
          return; // Stop execution
        }
      }

      // If the checkout date is the same as the bookingFromDate
      if (wakeupTime.checkoutDate === bookingFromDate) {
        // Extract the hours and minutes from wakeupTime.checkoutTime
        const [maxHour, maxMinute] = wakeupTime.checkoutTime
          .split(":")
          .map(Number);
        const maxTime = new Date();
        maxTime.setHours(maxHour, maxMinute, 0, 0); // Set to checkout time for comparison

        // Compare selected time with the maximum allowed time
        if (selectedDateTime.getTime() > maxTime.getTime()) {
          Alert.alert(
            "Invalid Time",
            `The time cannot exceed checkout time - ${wakeupTime.checkoutTime}.`,
            [{ text: "OK" }]
          );
          return; // Stop execution
        }
      }

      // Adjust the time to IST and format it in 24-hour format
      const istTime = selectedDateTime.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // 24-hour format
      });

      setArrivalTime(istTime); // Set the selected time
    }
  };

  const getToadydate = () => {
    const date = new Date(new Date());

    // Convert to IST by adding 5 hours and 30 minutes
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);

    // Extract day, month, and year
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = date.getFullYear();
    const dateISt = `${day}-${month}-${year}`;

    // setBookingFromDate(dateISt);
  };

  useFocusEffect(
    useCallback(() => {
      setBookingFromDate(null);
      setArrivalTime(null);
      activBooking();

      // getToadydate();
    }, [userId])
  );

  const handleUpdateWakeupTime = async () => {
    // Validate input fields
    if (!bookingFromDate || !arrivalTime) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true); // Start loading

    const dateStr = bookingFromDate; // The date in DD-MM-YYYY format

    // Split the date string by "-"
    const [day, month, year] = dateStr.split("-");

    // Reformat the date to YYYY-MM-DD
    const reformattedDate = `${year}-${month}-${day}`;

    const data = {
      user_id: userId,
      booking_id: wakeupTime.booking_id,
      wakeup_datetime: reformattedDate + " " + arrivalTime,
    };

    try {
      const response = await fetch(`${dataCenter.apiUrl}/set_wakeup_call.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          "Success",
          result.message,
          [
            {
              text: "OK",
              onPress: () => {
                handleShowAd(); // Show the ad when OK is pressed
                setBookingFromDate(null);
                wakeupTimeFetcher();
                setArrivalTime(null);
              },
            },
          ],
          { cancelable: false }
        );

        // Reload the page or navigate based on your app type
        // For a web app:

        // getToadydate();

        // For React Native, you can use navigation to go back to the previous screen or re-render the current screen:
        // navigation.goBack(); // Go back to the previous screen
        // Or if you are using a state to re-render the current screen, you can update that state
      } else if (response.status === 404) {
        // If the response is 404 Not Found
        Alert.alert("Error", result.error || "Booking not found");
      } else if (response.status === 400) {
        // If the response is 400 Bad Request
        Alert.alert("Error", result.error || "Invalid input data");
      } else if (response.status === 500) {
        // If the response is 500 Internal Server Error
        Alert.alert("Error", result.error || "Something went wrong");
      }
    } catch (error) {
      // Handle network errors
      Alert.alert("Error", "Failed to connect to the server");
      console.error("Error:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <BannerAdScreen />
      <Card style={styles.card}>
        {loading && <Loader />}

        {/* New View for Wake-up Time and Date */}
        {wakeupTime && wakeupTime.wakeup_time != null && (
          <View style={styles.wakeupTimeContainer}>
            <Text style={styles.wakeupTimeText}>Scheduled Time : </Text>
            <Text style={styles.wakeupTimeText}>
              {" "}
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                {wakeupTime.time}{" "}
              </Text>
              on
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                {" "}
                {wakeupTime.dte}
              </Text>
            </Text>
          </View>
        )}
        {/* <Image source={alarm} style={styles.image} /> */}
        <Icon
          name={"alarm-outline"}
          type="ionicon"
          size={135}
          style={styles.image}
          color={"#2b2b2b"}
        />

        <Text category="h5" style={styles.title}>
          Set wake-up time
        </Text>
        {/* Arrival Time Picker */}

        <Text category="s1" style={styles.label}>
          Select Date
        </Text>

        <View style={styles.dateInputContainer}>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Icon name="calendar-outline" type="ionicon" style={styles.icon} />
            <Text style={styles.dateText}>
              {bookingFromDate ? bookingFromDate : "Select Date"}
            </Text>
          </TouchableOpacity>
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
          />
        )}
        <View style={styles.input}>
          <Text category="s1" style={styles.label}>
            Select Time
          </Text>

          <TouchableOpacity
            onPress={() => setShowArrivalPicker(true)}
            style={styles.timeDisplay}
          >
            {renderAccessory("stopwatch-outline", "ionicon")}
            <Text style={styles.timeText}>
              {arrivalTime ? arrivalTime : "Select Time"}
            </Text>
          </TouchableOpacity>
        </View>

        {showArrivalPicker && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onArrivalTimeChange}
          />
        )}

        {checkIn && wakeupTime && (
          <Button style={styles.button} onPress={handleUpdateWakeupTime}>
            <Text style={styles.buttonText}>
              {wakeupTime.wakeup_time != null ? "Update" : "Submit"}{" "}
            </Text>
          </Button>
        )}
      </Card>
      <BannerAdScreen />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
    height: vh(95),
  },
  image: {
    width: "auto",
    height: 150,
    borderRadius: 10,
    marginBottom: 16,
    resizeMode: "contain",
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
  },
  selectContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  wakeupTimeContainer: {
    marginBottom: 20,

    elevation: 10,
    backgroundColor: "white",
    alignItems: "center",

    paddingVertical: 5,

    margin: "auto",
    width: "100%",
  },
  wakeupTimeText: {
    fontSize: 16,
    color: "#222B45",
    letterSpacing: 0.6,
    marginVertical: 2,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  select: {
    flex: 1,
  },
  timeDisplay: {
    borderWidth: 1,
    borderColor: "#E4E9F2",
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    marginBottom: 20,
  },
  dateInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    flex: 1,
    justifyContent: "start",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: -10,
  },
  timeInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    flex: 1,
    justifyContent: "start",
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#222B45",
  },
  timeText: {
    fontSize: 16,
    color: "#222B45",
  },
  priceText: {
    fontSize: 18,
    color: "#222B45",
    textAlign: "center",
    marginVertical: 16,
  },
  button: {
    borderRadius: 20,
    width: "50%",
    marginHorizontal: "auto",
    backgroundColor: "#17385F",
    borderRadius: 10,
    borderColor: "#17385F",
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFFFFF",
  },
});

export default Wakeup;
