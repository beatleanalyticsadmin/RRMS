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
import food from "../assets/food.png";
import { useSelector } from "react-redux";
import { dataCenter } from "../data/dataCenter";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "../components/Loader";
import { vh } from "react-native-expo-viewport-units";
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

const MealBookingForm = ({ navigation }) => {
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
  const [loading, setLoading] = useState(false);
  const [mealTypeIndex, setMealTypeIndex] = useState(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const userId = useSelector((state) => state.userId);
  const [menu, setMenu] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [bookingFromDate, setBookingFromDate] = useState(null);
  const apiUrl = dataCenter.apiUrl;

  const activBooking = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${dataCenter.apiUrl}/booking_status.php`, {
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
          "You must have an active booking to book meals.",
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
        fetchMeals();
      }
    } catch (error) {
      setLoading(false);
      console.error("Attention fetching booking status:", error);
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

  const [selectedMealType, setSelectedMealType] = useState(null);
  const mealPrices = { Breakfast: 45, Lunch: 34, Dinner: 22, Parcel: 98 }; // Meal prices in dollars
  const [meals, setMeals] = useState([]);

  const submitMealBooking = async () => {
    setLoading(true);

    if (selectedMealType == null) {
      setLoading(false);
      Alert.alert("Error", "Please select meal type.", [{ text: "OK" }]);
      return;
    }
    const mealId = meals.find((m) => {
      return m.meal_type == selectedMealType;
    })["meal_id"];

    try {
      const response = await fetch(`${dataCenter.apiUrl}/book_meal.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          meal_id: mealId,
          mealBookingDate: bookingFromDate,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert("Success", data.message);
        navigation.navigate("Home");
        // handleShowAd();
      } else {
        const errorData = await response.json();
        const errorMessage =
          errorData.error || "An error occurred. Please try again.";
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      console.error("Error submitting meal booking:", error);
      Alert.alert("Error", "Unable to connect to the server.");
    }
    setLoading(false);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);

    if (selectedDate) {
      // Get today's date and reset the time to midnight for comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to midnight

      // Create a new Date object from the selected date
      const selectedDateObj = new Date(selectedDate);
      selectedDateObj.setHours(0, 0, 0, 0); // Reset time to midnight for comparison

      // Compare selected date with today's date
      if (selectedDateObj.getTime() !== today.getTime()) {
        // Show alert if the selected date is not today
        Alert.alert("Invalid Date", "The date can only be today's date.", [
          { text: "OK" },
        ]);
        getToadydate(); // Reset the date picker
      } else {
        // Proceed with setting the selected date if it's today
        setDate(selectedDate);

        const date = new Date(selectedDate);

        // Convert to IST by adding 5 hours and 30 minutes
        date.setHours(date.getHours() + 5);
        date.setMinutes(date.getMinutes() + 30);

        // Extract day, month, and year
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
        const year = date.getFullYear();
        const dateISt = `${day}-${month}-${year}`;

        setBookingFromDate(dateISt);
      }
    }
  };

  const fetchMeals = async () => {
    setLoading(true);

    const response = await fetch(`${dataCenter.apiUrl}/select_meal.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
      }),
    });

    const result = await response.json();
    console.log(result);

    if (response.status == 200) {
      setMeals(result);
    } else {
      Alert.alert("Error", "Something went wrong!");
      navigation.navigate("Home");
    }

    setLoading(false);
  };

  const fetchMenu = async () => {
    try {
      const response = await fetch(
        "https://rrms.beatlebuddy.com/apis/meal-menus/food_menu.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const menuData = await response.json();
      console.log(menuData);
      setMenu(menuData.menu);
    } catch (error) {
      console.error("Error fetching menu:", error);
      throw error; // Rethrow the error to handle it in the calling function
    }
  };
  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const renderIcon = (props) => (
    <Icon name="chevron-down-outline" type="ionicon" size={20} />
  );

  const renderFIcon = (props) => (
    <Icon name="fast-food-outline" type="ionicon" style={styles.icon} />
  );

  const getTodayDate = () => {
    // Create a new date and format it to IST
    const date = new Date();
    const formatter = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // Format the date to dd-mm-yyyy
    const [day, month, year] = formatter
      .formatToParts(date)
      .filter(({ type }) => ["day", "month", "year"].includes(type))
      .map(({ value }) => value);

    const dateIST = `${day}-${month}-${year}`;

    // console.log(dateIST); // Verify the IST date
    setBookingFromDate(dateIST); // Set the state with the IST date
  };

  useFocusEffect(
    useCallback(() => {
      activBooking();
      fetchMenu();
      setBookingFromDate(null);
      getTodayDate();
      setSelectedMealType(null);
    }, [userId])
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <BannerAdScreen />
      <Card style={styles.card}>
        {loading && <Loader />}
        <Image source={food} style={styles.image} />

        <Text category="h5" style={styles.title}>
          Book a Meal
        </Text>

        <Text category="s1" style={styles.label}>
          Choose your meal type
        </Text>
        <View style={styles.selectContainer}>
          <Select
            selectedIndex={mealTypeIndex}
            onSelect={(index) => {
              setSelectedMealType(meals[index["row"]]["meal_type"]);
            }}
            accessoryLeft={renderFIcon}
            value={selectedMealType ? selectedMealType : "Select a meal"}
            placeholder="Select meal type"
            style={styles.select}
            accessoryRight={renderIcon}
          >
            {meals.length > 0 &&
              meals.map((meal, index) => (
                <SelectItem title={meal.meal_type} key={index} />
              ))}
          </Select>
        </View>

        {selectedMealType !== null && (
          <Text category="s1" style={styles.priceText}>
            Amount: ₹{" "}
            {
              meals.find((m) => {
                return m.meal_type == selectedMealType;
              })["meal_price"]
            }
          </Text>
        )}

        {checkIn && (
          <Button style={styles.button} onPress={submitMealBooking}>
            <Text style={styles.buttonText}>Book </Text>
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
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  select: {
    flex: 1,
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
    fontSize: 19,
    color: "#222B45",
    textAlign: "center",
    marginVertical: 10,
  },
  button: {
    borderRadius: 20,
    width: "50%",
    marginHorizontal: "auto",
    backgroundColor: "#17385F",
    borderRadius: 10,
    borderColor: "#17385F",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
  },
});

export default MealBookingForm;
