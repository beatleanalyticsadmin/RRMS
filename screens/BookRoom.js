import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { Icon } from "react-native-elements";
import {
  Layout,
  Text,
  Input,
  Button,
  Select,
  SelectItem,
  Datepicker,
} from "@ui-kitten/components";
import DateTimePicker from "@react-native-community/datetimepicker";
import room from "../assets/room.png";
import { vh, vw } from "react-native-expo-viewport-units";
import { dataCenter } from "../data/dataCenter";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import BannerAdScreen from "../components/Ads/BannerAdScreen";

import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";

// Admob Configuration

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

const BookRoom = ({ navigation }) => {
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

  // Separate state variables for each dropdown
  const [selectedTrainType, setSelectedTrainType] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Separate state for arrival and departure train numbers
  const [arrivalTrainNumber, setArrivalTrainNumber] = useState("");
  const [departureTrainNumber, setDepartureTrainNumber] = useState("");

  // Date and time state variables
  const [arrivalTime, setArrivalTime] = useState(null);
  const [departureTime, setDepartureTime] = useState(null);
  const [showArrivalPicker, setShowArrivalPicker] = useState(false);
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [bookingFromDate, setBookingFromDate] = useState(null);
  const [bookingTillDate, setBookingTillDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state) => state.userId);

  const trainTypes = ["Coaching", "Freight"];
  const apiUrl = dataCenter.apiUrl;
  const [zones, setZones] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [locations, setLocations] = useState([]);
  const [bookFromSel, setbookFromSel] = useState(null);
  const [bookTillSel, setbookTillSel] = useState(null);
  const [checkIn, setCheckIn] = useState(null);

  const activBooking = async () => {
    setLoading(true);
    const response = await fetch(`${apiUrl}/booking_status.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    });
    const data = await response.json();
    setLoading(false);

    if (data.booking.status == 2 || data.booking.status == 1) {
      Alert.alert(
        "Attention",
        `You already have an active booking in ${data.booking.location}`,
        [
          {
            text: "OK",
            onPress: () => {
              // Replace 'Main' with the actual name of your Main screen
              navigation.navigate("Home");
            },
          },
        ]
      );
    } else {
      zonefetcher();
    }
    setCheckIn(data.activeBooking);
  };

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

  const resetAll = () => {
    setLocations([]);
    setDivisions([]);
    setSelectedTrainType(null);
    setSelectedZone(null);
    setSelectedDivision(null);
    setSelectedLocation(null);
    setArrivalTrainNumber("");
    setDepartureTrainNumber("");
    setArrivalTime(null);
    setDepartureTime(null);
    setShowArrivalPicker(false);
    setShowDeparturePicker(false);
    setBookingFromDate(null);
    setBookingTillDate(null);
    setbookTillSel(null);
    setbookFromSel(null);
    setSelectedLocation(null);
    setSelectedZone(null);
    setSelectedDivision(null);
  };
  useFocusEffect(
    useCallback(() => {
      // Reset all states to their initial values
      resetAll();

      activBooking();
    }, [])
  );

  // const onArrivalTimeChange = (event, selectedTime) => {
  //   setShowArrivalPicker(Platform.OS === "ios");
  //   if (event.type === "set" && selectedTime) {
  //     // Ensure selectedTime is valid
  //     // Adjust the time to IST and format it in 24-hour format
  //     const istTime = new Date(selectedTime).toLocaleTimeString("en-IN", {
  //       timeZone: "Asia/Kolkata",
  //       hour: "2-digit",
  //       minute: "2-digit",
  //       hour12: false, // 24-hour format
  //     });
  //     setArrivalTime(istTime);
  //   }
  // };
  const onArrivalTimeChange = (event, selectedTime) => {
    setShowArrivalPicker(Platform.OS === "ios");
    setDepartureTime(null);
    if (event.type === "set" && selectedTime) {
      // Get the current time and 30 minutes later
      const now = new Date();
      const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60000); // 30 minutes from now

      // Convert the selected time to a Date object
      const selectedDateTime = new Date(selectedTime);

      // Ensure the selected time is between now and 30 minutes from now
      if (selectedDateTime >= now && selectedDateTime <= thirtyMinutesFromNow) {
        // Adjust the time to IST and format it in 24-hour format
        const istTime = selectedDateTime.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // 24-hour format
        });
        setArrivalTime(istTime);
      } else {
        // Show an alert if the selected time is invalid
        Alert.alert(
          "Invalid Time",
          "The selected time must be between now and 30 minutes from now.",
          [{ text: "OK" }]
        );
      }
    }
  };
  const onDepartureTimeChange = (event, selectedTime) => {
    if (!bookingFromDate) {
      setShowDeparturePicker(false);
      Alert.alert(
        "Error",
        "Please select the booking from date before selecting a time.",
        [{ text: "OK" }]
      );
      setShowArrivalPicker(false);
      return; // Exit the function early
    }
    if (!arrivalTime) {
      setShowDeparturePicker(false);
      Alert.alert(
        "Error",
        "Please select the arrival time before selecting a time.",
        [{ text: "OK" }]
      );
      setShowArrivalPicker(false);
      return; // Exit the function early
    }
    if (!bookingTillDate) {
      setShowDeparturePicker(false);
      Alert.alert(
        "Error",
        "Please select the booking till date before selecting a time.",
        [{ text: "OK" }]
      );
      setShowArrivalPicker(false);
      return; // Exit the function early
    }

    setShowDeparturePicker(false); // Close the picker after selection

    if (event.type === "set" && selectedTime) {
      const selectedDateTime = new Date(selectedTime);

      // Adjust the selected time to IST
      const istTime = selectedDateTime.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // 24-hour format
      });

      if (bookingFromDate === bookingTillDate && arrivalTime) {
        // Parse arrival time into a Date object
        const [arrivalHour, arrivalMinute] = arrivalTime.split(":").map(Number);
        const arrivalDateTime = new Date(
          selectedDateTime.getFullYear(),
          selectedDateTime.getMonth(),
          selectedDateTime.getDate(),
          arrivalHour,
          arrivalMinute
        );

        // Add 10 minutes to the arrival time
        const minDepartureTime = new Date(
          arrivalDateTime.getTime() + 10 * 60000
        );

        // Ensure the selected time is not earlier than the arrival time
        if (selectedDateTime < arrivalDateTime) {
          alert("Departure time cannot be earlier than the arrival time.");
          return;
        }

        // Ensure the selected time is at least 10 minutes from the arrival time
        if (selectedDateTime < minDepartureTime) {
          alert(
            "Departure time must be at least 10 minutes after the arrival time."
          );
          return;
        }
      }

      // Set the departure time if it passes all conditions
      setDepartureTime(istTime);
    }
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
  const handleSubmit = async () => {
    setLoading(true);

    // Validation function
    const validatePayload = () => {
      if (!selectedTrainType) {
        Alert.alert("Validation Error", "Please select a train type.");
        return false;
      }
      if (!selectedLocation) {
        Alert.alert("Validation Error", "Please select a location.");
        return false;
      }
      if (arrivalTrainNumber.length == 0) {
        Alert.alert(
          "Validation Error",
          "Please enter a valid arrival train number."
        );
        return false;
      }
      if (
        selectedTrainType === "Coaching" &&
        departureTrainNumber.length == 0
      ) {
        Alert.alert(
          "Validation Error",
          "Please enter a valid departure train number."
        );
        return false;
      }
      if (!bookingFromDate) {
        Alert.alert("Validation Error", "Please select a check-in date.");
        return false;
      }
      if (!arrivalTime) {
        Alert.alert("Validation Error", "Please select an arrival time.");
        return false;
      }
      if (selectedTrainType === "Coaching") {
        if (!departureTime) {
          Alert.alert("Validation Error", "Please select a departure time.");
          return false;
        }
        if (!bookingTillDate) {
          Alert.alert("Validation Error", "Please select a check-out date.");
          return false;
        }
      }
      return true;
    };

    // Check validation before proceeding
    if (!validatePayload()) {
      setLoading(false);
      return;
    }

    let requestData;
    if (selectedTrainType === "Coaching") {
      requestData = {
        user_id: userId,
        arr_train_no: arrivalTrainNumber,
        dep_train_no: departureTrainNumber,
        booking_location: selectedLocation,
        req_checkin_date: bookingFromDate,
        req_checkin_time: arrivalTime,
        req_checkout_date: bookingTillDate,
        req_checkout_time: departureTime,
        department: selectedTrainType,
      };
    } else {
      requestData = {
        user_id: userId,
        arr_train_no: arrivalTrainNumber,
        booking_location: selectedLocation,
        req_checkin_date: bookingFromDate,
        req_checkin_time: arrivalTime,
        department: selectedTrainType,
      };
    }

    // API calls
    try {
      const apiUrlEndpoint =
        selectedTrainType === "Coaching"
          ? `${apiUrl}/coaching_booking_request.php`
          : `${apiUrl}/freight_booking_request.php`;

      const response = await fetch(apiUrlEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (result.status) {
        Alert.alert("Success", result.message);

        resetAll();
        navigation.navigate("Home");
        // handleShowAd();
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred while submitting the request.");
    }

    setLoading(false);
  };

  return (
    <>
      <BannerAdScreen />
      <Layout style={styles.container}>
        {loading && <Loader />}

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ height: vh(22) }}>
            {/* <Image source={room} style={styles.image} /> */}
            <Icon
              name={"bed-outline"}
              type="ionicon"
              size={150}
              color={"#2b2b2b"}
              style={styles.image}
            />
          </View>

          <Text category="h4" style={styles.heading}>
            Book your room
          </Text>
          <View style={{ gap: 18 }}>
            <Select
              label="Train Type"
              placeholder="Type of train"
              value={selectedTrainType ? selectedTrainType : ""}
              onSelect={(index) => {
                setSelectedTrainType(trainTypes[index["row"]]);
              }}
              accessoryLeft={() => renderAccessory("train-outline", "ionicon")}
            >
              {trainTypes.map((t, index) => (
                <SelectItem key={index} title={t} />
              ))}
            </Select>

            <Select
              label="Zone"
              placeholder="Select zone"
              accessoryLeft={() => renderAccessory("map")}
              onSelect={(index) => {
                divisionFetcher(zones[index["row"]]["id"]);
                setSelectedDivision(null);
                setSelectedLocation(null);
                setSelectedZone(zones[index["row"]]["id"]);
              }}
              value={
                selectedZone && zones.length > 0
                  ? zones.find((z) => {
                      return z.id == selectedZone;
                    })["zone"]
                  : ""
              }
              style={styles.formSelectInput}
            >
              {zones.map((z) => {
                return <SelectItem key={z.id} title={z.zone} />;
              })}
            </Select>

            <Select
              label="Division"
              placeholder="Select division"
              value={
                selectedDivision && divisions.length > 0
                  ? divisions.find((z) => {
                      return z.id == selectedDivision;
                    })["division"]
                  : ""
              }
              accessoryLeft={() =>
                renderAccessory("navigate-outline", "ionicon")
              }
              onSelect={(index) => {
                locationFetcher(selectedZone, divisions[index["row"]]["id"]);

                setSelectedLocation(null);
                setSelectedDivision(divisions[index["row"]]["id"]);
              }}
            >
              {divisions.length > 0 &&
                divisions.map((div, ind) => {
                  return <SelectItem key={div.id} title={div.division} />;
                })}
            </Select>
            <Select
              label="Location"
              placeholder="Select location"
              onSelect={(index) => {
                setSelectedLocation(locations[index["row"]]["id"]);
              }}
              style={styles.formSelectInput}
              accessoryLeft={() =>
                renderAccessory("location-outline", "ionicon")
              }
              value={
                selectedLocation && locations.length > 0
                  ? locations.find((z) => {
                      return z.id == selectedLocation;
                    })["location"]
                  : ""
              }
            >
              {locations.length > 0 &&
                locations.map((loc, ind) => {
                  return <SelectItem key={ind} title={loc.location} />;
                })}
            </Select>

            <Input
              label="Arriving From Train number"
              placeholder="Enter train number"
              value={arrivalTrainNumber}
              onChangeText={setArrivalTrainNumber}
              style={styles.input}
              accessoryLeft={() =>
                renderAccessory("train", "material-community")
              }
            />
            {selectedTrainType === "Coaching" && (
              <Input
                label="Departure By Train number"
                placeholder="Enter train number"
                value={departureTrainNumber}
                onChangeText={setDepartureTrainNumber}
                style={styles.input}
                accessoryLeft={() =>
                  renderAccessory("train", "material-community")
                }
              />
            )}
            <Datepicker
              label="Booking From"
              date={bookFromSel}
              onSelect={(selectedDate) => {
                if (selectedDate) {
                  // Get today's date and reset the time to 00:00:00 for comparison
                  const today = new Date();
                  today.setHours(0, 0, 0, 0); // Set time to midnight

                  // Create a new Date object from the selected date
                  const selectedDateObj = new Date(selectedDate);
                  selectedDateObj.setHours(0, 0, 0, 0); // Reset time to midnight for comparison

                  // Compare selected date with today's date
                  if (selectedDateObj.getTime() !== today.getTime()) {
                    // Show alert if the selected date is not today
                    Alert.alert(
                      "Invalid Date",
                      "The date can only be today's date.",
                      [{ text: "OK" }]
                    );
                    setbookFromSel(null); // Reset the date picker
                  } else {
                    // Proceed with setting the selected date
                    setbookFromSel(selectedDate);
                    const date = new Date(selectedDate);

                    // Convert to IST by adding 5 hours and 30 minutes
                    date.setHours(date.getHours() + 5);
                    date.setMinutes(date.getMinutes() + 30);

                    // Extract day, month, and year
                    const day = String(date.getDate()).padStart(2, "0");
                    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
                    const year = date.getFullYear();
                    const dateISt = `${day}-${month}-${year}`;
                    setDepartureTime(null);
                    setBookingFromDate(dateISt); // Set the formatted date
                  }
                }
              }}
              accessoryRight={() =>
                renderAccessory("calendar-outline", "ionicon")
              }
              style={styles.datePicker}
            />

            {/* Arrival Time Picker */}
            <View style={styles.input}>
              <Text category="label" style={styles.label}>
                Arrival Time
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
                is24Hour={false}
                display="default"
                onChange={onArrivalTimeChange}
              />
            )}
            {selectedTrainType === "Coaching" && (
              <Datepicker
                label="Booking Till"
                date={bookTillSel}
                onSelect={(selectedDate) => {
                  if (selectedDate) {
                    // Get today's date and reset the time to midnight for comparison
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Set time to midnight

                    // Create a new Date object from the selected date
                    const selectedDateObj = new Date(selectedDate);
                    selectedDateObj.setHours(0, 0, 0, 0); // Reset time to midnight for comparison

                    // Compare selected date with today's date
                    if (selectedDateObj.getTime() < today.getTime()) {
                      // Show alert if the selected date is before today
                      Alert.alert(
                        "Invalid Date",
                        "The date cannot be in the past.",
                        [{ text: "OK" }]
                      );
                      return; // Prevent setting the date
                    } else {
                      // Proceed with setting the selected date if it's today or any future date
                      const date = new Date(selectedDate);

                      // Convert to IST by adding 5 hours and 30 minutes
                      date.setHours(date.getHours() + 5);
                      date.setMinutes(date.getMinutes() + 30);

                      // Extract day, month, and year
                      const day = String(date.getDate()).padStart(2, "0");
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        "0"
                      ); // Month is 0-indexed
                      const year = date.getFullYear();
                      const dateISt = `${day}-${month}-${year}`;

                      setBookingTillDate(dateISt);
                      setbookTillSel(selectedDate);
                      setDepartureTime(null);
                    }
                  }
                }}
                accessoryRight={() =>
                  renderAccessory("calendar-outline", "ionicon")
                }
                style={styles.datePicker}
              />
            )}
            {/* Departure Time Picker */}
            {selectedTrainType === "Coaching" && (
              <View style={styles.input}>
                <Text category="label" style={styles.label}>
                  Departure Time
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDeparturePicker(true)}
                  style={styles.timeDisplay}
                >
                  {renderAccessory("stopwatch-outline", "ionicon")}
                  <Text style={styles.timeText}>
                    {departureTime ? departureTime : "Select Time"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {showDeparturePicker && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={onDepartureTimeChange}
              />
            )}

            {!checkIn && (
              <Button
                appearance="filled"
                style={styles.button}
                onPress={() => {
                  handleSubmit();
                }}
              >
                Book Room
              </Button>
            )}
          </View>
          <BannerAdScreen />
        </ScrollView>
      </Layout>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  image: {
    width: vw(70),
    height: "90%",
    resizeMode: "cover",
    alignSelf: "center",
  },
  heading: {
    marginBottom: 16,
    textAlign: "center",
  },
  input: {},
  timeDisplay: {
    borderWidth: 1,
    borderColor: "#E4E9F2",
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  timeText: {
    color: "#8F9BB3",
  },
  label: {
    marginBottom: 4,
    color: "#8F9BB3",
  },
  datePicker: {},
  button: {
    width: vw(50),
    height: vh(6),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#17385F",
    marginHorizontal: "auto",
    borderRadius: 10,
    borderWidth: 0,
    marginBottom: 10,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: "#8F9BB3",
  },
});

export default BookRoom;
