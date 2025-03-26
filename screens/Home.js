import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  BackHandler,
} from "react-native";
import {
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import rail from "../assets/rail.jpg"; // Make sure your image path is correct
import { Icon } from "react-native-elements";
import { dataCenter } from "../data/dataCenter";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "../components/Loader";
import BannerAdScreen from "../components/Ads/BannerAdScreen";
import Pagination from "../components/Ads/Pagination";
import * as Device from "expo-device";
import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";

// Admob Configuration

const androidAdmobInterstitial = "ca-app-pub-6455906013208664/8422864620";
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
const data = [
  {
    title: "Create Room Request",
    icon: "bed-outline",
    type: "material-community",
    to: "Room",
  },
  {
    title: "Room Request History",
    icon: "history",
    type: "material-community",
    to: "PastBooking",
  },
  {
    title: "Wake up call",
    icon: "alarm-outline",
    type: "ionicon",
    to: "Wakeup",
  },
  {
    title: "Feedback",
    icon: "message-draw",
    type: "material-community",
    to: "Feedback",
  },
  {
    title: "Complaint",
    icon: "report-problem",
    type: "material",
    to: "Complaints",
  },
  {
    title: "Complaint History",
    icon: "history",
    type: "material",
    to: "ComplaintsUser",
  },
  {
    title: "Today's Menu",
    icon: "fast-food-outline",
    type: "ionicon",
    to: "MenuPage",
  },
  {
    title: "Book Meals",
    icon: "fast-food-outline",
    type: "ionicon",
    to: "BookMeal",
  },
  {
    title: "Meal History",
    icon: "cash-outline",
    type: "ionicon",
    to: "MealHistory",
  },
];

const Home = ({ navigation }) => {
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

  // const handleShowAd = () => {
  //   if (loaded) {
  //     interstitial.show();
  //   }
  // };
  const userId = useSelector((state) => state.userId);
  const [loading, setLoading] = useState(false);
  const [checkIn, setCheckIn] = useState(null);
  const apiUrl = dataCenter.apiUrl;
  const fetcher = async () => {
    // setLoading(true);
    const response = await fetch(`${apiUrl}/booking_status.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    });
    const data = await response.json();

    if (data.status == "success") {
      setCheckIn(data.booking);
    } else {
      setCheckIn(null);
    }
    setLoading(false);
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     const intervalId = setInterval(() => {
  //       fetcher();
  //     }, 1500); // Calls fetcher every 1 second

  //     return () => clearInterval(intervalId); // Clear interval on component unmount or unfocus
  //   }, [])
  // );
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

  // Move renderItem inside Home so it has access to navigation
  const renderItem = (item, index) => (
    <TouchableOpacity
      key={index}
      style={styles.item}
      onPress={() => {
        if (item.to == "Wakeup" || item.to == "Room" || item.to == "BookMeal") {
          navigation.navigate(item.to);
        } else {
          handleShowAd();
          navigation.navigate(item.to);
        }
        // Navigate if there’s no restriction
        // if (checkIn) {
        //   if (item.to === "BookMeal" && checkIn.status != 2) {
        //     Alert.alert(
        //       "Error",
        //       "You must have an active booking to book meals."
        //     );
        //   } else if (item.to === "Wakeup" && checkIn.status != 2) {
        //     Alert.alert(
        //       "Error",
        //       "You must have an active booking to set wake-up time."
        //     );
        //   } else if (item.to === "Feedback" && checkIn.status != 2) {
        //     Alert.alert(
        //       "Error",
        //       "You must have an active booking for feedback."
        //     );
        //   } else if (item.to === "Complaints" && checkIn.status != 2) {
        //     Alert.alert(
        //       "Error",
        //       "You must have an active booking for complaint."
        //     );
        //   } else if (
        //     item.to === "Room" &&
        //     (checkIn.status == 2 || checkIn.status == 1)
        //   ) {
        //     Alert.alert(
        //       "Error",
        //       `You already have an active booking in ${checkIn.location}`
        //     );
        //   } else {
        //     navigation.navigate(item.to); // Navigate if there’s no restriction
        //   }
        // } else {
        //   Alert.alert("Error", "Something went wrong.", [{ text: "OK" }]);
        // }
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ededed",
          padding: 7,
          borderRadius: 5,
          marginRight: 10,
        }}
      >
        <Icon
          name={item.icon}
          style={styles.itemIcon}
          type={item.type}
          color="#3f3f3f"
          size={26}
        />
      </View>
      <Text category="s1" style={styles.itemText}>
        {item.title}
      </Text>

      <Icon
        size={20}
        color="#3f3f3f"
        name="chevron-forward-outline"
        type="ionicon"
      />
    </TouchableOpacity>
  );

  return (
    <Layout style={styles.container}>
      {loading && <Loader />}
      <BannerAdScreen />
      {/* <Pagination /> */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={rail} style={styles.image} />
        <View style={styles.content}>
          <Text category="h6" style={styles.title}>
            What would you like to do?
          </Text>

          {/* Render each item manually */}
          {data.map((item, index) => renderItem(item, index))}
        </View>
        <BannerAdScreen />
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 190,
    resizeMode: "cover",
  },
  content: {
    padding: 16,
    flex: 1, // To take up the remaining space after the image
  },
  title: {
    marginVertical: 16,
    // textAlign: "center",
    fontSize: 22,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 5,
    marginVertical: 7,
  },
  itemIcon: {},
  itemText: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
    fontWeight: "600",
  },
  arrowIcon: {},
  bottomNavigation: {
    borderTopWidth: 1,
    borderColor: "#e5e5e5",
    height: 60,
    justifyContent: "center",
  },
});

export default Home;
