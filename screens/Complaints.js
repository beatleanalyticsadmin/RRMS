import React, { useCallback, useEffect, useState } from "react";
import {
  Layout,
  Text,
  Button,
  Input,
  Select,
  SelectItem,
  Icon,
} from "@ui-kitten/components"; // Import the Icon component
import { StyleSheet, View, Image, ScrollView, Alert } from "react-native";
import { vw } from "react-native-expo-viewport-units";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { dataCenter } from "../data/dataCenter";
import Loader from "../components/Loader";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator"; // Import ImageManipulator
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

const Complaints = ({ navigation }) => {
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
  const [checkIn, setCheckIn] = useState(null);
  const userId = useSelector((state) => state.userId);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
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
          "You must have an active booking to submit complaint.",
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
        categoriesFetcher();
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
  const categoriesFetcher = async () => {
    setLoading(true);
    const res = await fetch(`${dataCenter.apiUrl}/complaint_type.php`, {
      method: "POST",
      body: JSON.stringify({ id: userId }),
    });
    const data = await res.json();

    if (res.ok) {
      setCategories(data);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    // Validation checks
    if (!selectedCategory) {
      alert("Please select a complaint category.");
      return;
    }

    if (!remarks.trim()) {
      alert("Please enter your remarks.");
      return;
    }

    if (!userId) {
      alert("User not authenticated. Please log in.");
      return;
    }

    // If image is required and not selected
    if (image === null) {
      alert("Please capture or select an image for the complaint.");
      return;
    }

    setLoading(true);
    const complaint_type = categories.find((c) => {
      return c.id === selectedCategory;
    })["complaint_type"];

    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("complaint_type", complaint_type);
      formData.append("remarks", remarks);

      if (image) {
        const uri = image.uri;
        const localUri = uri.split("?")[0]; // Remove query string if any
        const filename = localUri.split("/").pop();
        const filetype = filename.split(".").pop();

        formData.append("image", {
          uri: localUri,
          name: filename,
          type: `image/${filetype}`,
        });
      }

      const response = await fetch(`${dataCenter.apiUrl}/complaint.php`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Complaint submitted successfully!");
        setLoading(false);
        setSelectedCategory(null);
        setRemarks("");
        setImage(null);
        navigation.navigate("Home");
        handleShowAd();
        return;
      } else {
        Alert.alert(
          "Error",
          "Failed to submit the complaint. Please try again later."
        );
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      Alert.alert("Error", "An error occurred. Please try again.");
    }

    setLoading(false);
  };

  // Function to capture and compress photo
  const capturePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera is required!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false, // Disables the cropping step
      quality: 1, // Max quality
    });

    if (!result.canceled) {
      // Compress the image using ImageManipulator
      const compressedImage = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800 } }], // Resize the image width to 800px (or adjust to your preference)
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Compress to 70% of the original quality (or adjust as needed)
      );

      setImage(compressedImage); // Set the compressed image
    }
  };

  useFocusEffect(
    useCallback(() => {
      activBooking();

      setSelectedCategory(null);
      setRemarks("");
      setImage(null);
    }, [])
  );

  const renderCameraIcon = (style) => <Icon {...style} name="camera" />;

  return (
    <>
      <BannerAdScreen />
      <Layout style={styles.container}>
        {loading && <Loader />}

        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <Text category="s1" style={styles.label}>
            Select a category
          </Text>
          <Select
            onSelect={(index) => {
              setSelectedCategory(categories[index["row"]]["id"]);
            }}
            style={styles.dropdown}
            value={
              selectedCategory
                ? categories.find((c) => {
                    return c.id == selectedCategory;
                  })["complaint_type"]
                : "Select category"
            }
            placeholder="Select Category"
          >
            {categories.map((category, index) => (
              <SelectItem key={index} title={category.complaint_type} />
            ))}
          </Select>
          <Input
            placeholder="Write your remarks here..."
            multiline={true}
            textStyle={{ minHeight: 80 }}
            style={styles.input}
            value={remarks}
            onChangeText={(text) => setRemarks(text)}
          />
          {image && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image.uri }} style={styles.imagePreview} />
            </View>
          )}
          <Button
            style={styles.photoButton}
            accessoryLeft={renderCameraIcon} // Adds the camera icon to the button
            onPress={capturePhoto}
          >
            Capture Photo
          </Button>
          <Button style={styles.submitButton} onPress={handleSubmit}>
            Submit
          </Button>
        </ScrollView>
      </Layout>
      <BannerAdScreen />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  scrollViewContent: {
    flexGrow: 1,
    // justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dropdown: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
    borderRadius: 10,
  },
  submitButton: {
    borderRadius: 25,
    backgroundColor: "#17385F",
    borderColor: "transparent",
    width: vw(70),
    marginHorizontal: "auto",
    marginVertical: 20,
  },
  photoButton: {
    marginBottom: 20,
    backgroundColor: "#17385F",
    borderWidth: 0,
    width: vw(50),
    marginHorizontal: "auto",
    borderRadius: 10,
    marginTop: 20,
  },
  imagePreviewContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  input: {
    backgroundColor: "white",
  },
});

export default Complaints;
