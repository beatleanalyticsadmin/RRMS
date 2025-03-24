import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Text, Button, Icon, Input } from "@ui-kitten/components";
import { vw } from "react-native-expo-viewport-units";
import { useSelector } from "react-redux";
import { dataCenter } from "../data/dataCenter";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "../components/Loader";
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

const FeedbackScreen = ({ navigation }) => {
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
  const [parameterData, setParameterData] = useState([]);
  const [ratings, setRatings] = useState({});
  const [remarks, setRemarks] = useState("");
  const [modifiedRatings, setModifiedRatings] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState("");
  const userId = useSelector((state) => state.userId);
  const [loading, setLoading] = useState(false);
  const [checkIn, setCheckIn] = useState(null);
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
          "You must have an active booking to submit feedback.",
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
        paraFetcher();
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
  const paraFetcher = async () => {
    setRemarks("");
    setRatings({});
    setModifiedRatings({});
    setCurrentField("");
    setLoading(true);
    try {
      const res = await fetch(`${dataCenter.apiUrl}/feedback_parameters.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userId }),
      });
      const data = await res.json();

      setLoading(false);
      if (res.ok) {
        setParameterData(data);
      }
      // } else if (res.status === 400) {
      //   Alert.alert("Error", "ID is required.");
      //   navigation.navigate("Home");
      // } else if (res.status === 404) {
      //   Alert.alert(
      //     "Error",
      //     "You must have an active booking to submit feedback."
      //   );
      //   navigation.navigate("Home");
      else {
        Alert.alert("Error", "An unexpected error occurred.");
        navigation.navigate("Home");
      }
    } catch (error) {
      Alert.alert("Error", "Network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (field, value) => {
    setRatings((prev) => ({
      ...prev,
      [field]: value,
    }));
    setModifiedRatings((prev) => ({
      ...prev,
      [field]: true,
    }));
    setModalVisible(false);
  };

  const openModal = (field) => {
    setCurrentField(field);
    setModalVisible(true);
  };

  const getRatingText = (field) => {
    return ratings[field] === undefined || ratings[field] === null
      ? "Select"
      : `${ratings[field]}`;
  };

  const handleRemoveRating = (field) => {
    setRatings((prev) => ({
      ...prev,
      [field]: null,
    }));
    setModifiedRatings((prev) => {
      const newModifiedRatings = { ...prev };
      delete newModifiedRatings[field]; // Remove from modifiedRatings
      return newModifiedRatings;
    });
  };

  useFocusEffect(
    useCallback(() => {
      activBooking();
      // paraFetcher();
      setModifiedRatings({});
    }, [])
  );

  const handleSubmitFeedback = async () => {
    setLoading(true);
    // Filter modified fields and populate arrays for parameter_ids and values
    const parameter_ids = [];
    const values = [];

    Object.keys(modifiedRatings).forEach((field) => {
      if (modifiedRatings[field]) {
        parameter_ids.push(field);
        values.push(ratings[field]);
      }
    });

    // Prepare the final structured data
    const feedbackData = {
      comments: remarks, // Replace with the actual comment if needed
      parameter_ids: parameter_ids,
      values: values,
      user_id: userId, // Assuming userId is available from state or props
    };

    // Check if enough parameters are selected
    if (
      feedbackData.parameter_ids.length === 0 ||
      feedbackData.values.length === 0 ||
      feedbackData.parameter_ids.length < 10
    ) {
      Alert.alert("Attention", "Please select all parameters to submit.");
      setLoading(false);
      return;
    }

    // Calculate the average of values
    const averagePercentage =
      (feedbackData.values.reduce((sum, value) => sum + value, 0) /
        feedbackData.values.length) *
      10; // Assuming each value is out of 10 to get a percentage

    // Check if remark is required based on average percentage
    if (averagePercentage < 60 && feedbackData.comments.length === 0) {
      Alert.alert("Attention", "Please add a remark.");
      setLoading(false);
      return;
    }

    // Send the feedback data to the PHP API using fetch
    try {
      const response = await fetch(`${dataCenter.apiUrl}/submit_feedback.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the correct content type
        },
        body: JSON.stringify(feedbackData), // Convert the data to JSON format
      });

      if (!response.ok) {
        setLoading(false);
        // Handle error responses (e.g., 500 server error, etc.)
        const errorData = await response.json();
        console.error("Error:", errorData);
        alert(`Error: ${errorData.error || "Something went wrong"}`);
        return;
      }
      setLoading(false);
      // Handle success response
      const responseData = await response.json();

      Alert.alert("Success", "Thank you for submitting feedback.");
      handleShowAd();
      navigation.navigate("Home");
      paraFetcher();
    } catch (error) {
      // Handle any network errors or issues with the fetch request
      console.error("Network Error:", error);
      Alert.alert("Error", "Network error. Please try again.");
      setLoading(false);
    }
  };

  const sortedParameterData = parameterData.sort((a, b) => {
    const isModifiedA = !!modifiedRatings[a.parameter_id];
    const isModifiedB = !!modifiedRatings[b.parameter_id];
    return isModifiedB - isModifiedA;
  });

  return (
    <>
      <BannerAdScreen />
      <View style={styles.container}>
        {loading && <Loader />}

        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {parameterData.length > 0 && (
            <Text category="s1" style={styles.subtitle}>
              Please rate the following:
            </Text>
          )}

          {sortedParameterData.map((parameter) => {
            return (
              <View
                key={parameter.parameter_id}
                style={[
                  styles.questionContainer,
                  ratings[parameter.parameter_id] !== null &&
                    ratings[parameter.parameter_id] !== undefined &&
                    styles.modifiedBoxShadow,
                ]}
              >
                <Text
                  category="p1"
                  style={styles.text}
                  onPress={() => openModal(parameter.parameter_id)}
                >
                  {parameter.parameter_name}
                </Text>
                <Button
                  onPress={() => openModal(parameter.parameter_id)}
                  style={styles.button}
                >
                  {getRatingText(parameter.parameter_id)}
                </Button>
                {ratings[parameter.parameter_id] !== undefined &&
                  ratings[parameter.parameter_id] !== null && (
                    <TouchableOpacity
                      onPress={() => handleRemoveRating(parameter.parameter_id)}
                      style={styles.closeIconContainer}
                    >
                      <Icon
                        name="close"
                        width={24}
                        height={24}
                        fill="#FF6347"
                      />
                    </TouchableOpacity>
                  )}
              </View>
            );
          })}

          {parameterData.length > 0 && (
            <>
              <Input
                placeholder="Write your remarks here..."
                multiline={true}
                textStyle={{ minHeight: 80 }}
                style={styles.input}
                value={remarks}
                onChangeText={(text) => setRemarks(text)}
              />
              <Button
                style={styles.submitButton}
                onPress={handleSubmitFeedback}
              >
                Submit Feedback
              </Button>
            </>
          )}

          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text category="h6" style={styles.modalTitle}>
                  Select a Rating (1 to 10)
                </Text>
                <View style={styles.ratingContainer}>
                  {[...Array(11).keys()].map((value) => {
                    if (value == 0) {
                      return;
                    }
                    return (
                      <Button
                        key={value}
                        style={styles.ratingButton}
                        onPress={() => handleRatingChange(currentField, value)}
                      >
                        {value.toString()}
                      </Button>
                    );
                  })}
                </View>
                <Button
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  Close
                </Button>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#F9FBFD",
  },
  scrollView: {
    paddingVertical: 20,
    paddingHorizontal: 5,
  },
  subtitle: {
    fontWeight: "bold",
    marginBottom: 20,
    fontSize: 20,
  },
  input: {
    marginBottom: 20,
    borderRadius: 10,
  },
  questionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    gap: 6,
    backgroundColor: "#FFFFFF",
    padding: 5,
  },
  modifiedBoxShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 8,
    padding: 10,
  },
  text: {
    flex: 8.1,
    flexWrap: "wrap",
  },
  button: {
    flex: 1.9,
  },
  submitButton: {
    marginTop: 30,
    backgroundColor: "#17385F",
    borderRadius: 8,
    width: vw(50),
    alignSelf: "center",
    borderWidth: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontWeight: "bold",
    marginBottom: 20,
  },
  ratingContainer: {
    alignItems: "center",
    flexWrap: "wrap",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  ratingButton: {
    marginBottom: 10,
    width: 80,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#17385F",
    borderWidth: 0,
  },
  closeIconContainer: {
    marginLeft: 4,
  },
});

export default FeedbackScreen;
