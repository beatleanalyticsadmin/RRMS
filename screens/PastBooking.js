import React, { useCallback, useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
  Alert,
} from "react-native";
import { Text } from "@ui-kitten/components";
import { vh } from "react-native-expo-viewport-units";
import { Icon } from "react-native-elements";
import roombook from "../assets/roombook.jpg";
import { useFocusEffect } from "@react-navigation/native";
import { dataCenter } from "../data/dataCenter";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import BannerAdScreen from "../components/Ads/BannerAdScreen";

// Right accessory icon for each item
const renderItemAccessory = () => (
  <Icon name="chevron-forward-outline" size={20} type="ionicon" />
);

export const PastBooking = ({ navigation }) => {
  const userId = useSelector((state) => state.userId);

  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState(null);
  const fetcher = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${dataCenter.apiUrl}/room_history.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userId }),
      });

      // Check if the response was successful
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the JSON data
      const data = await response.json();

      if (response.status) {
        setBookings(data);
      }
    } catch (error) {
      // Handle errors such as network issues
      Alert.alert("Error", "Failed to fetch data. Please try again later.");
      console.error("Error fetching data:", error);
      setLoading(false);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetcher();
    }, [])
  );
  return (
    <>
      <BannerAdScreen />
      <View style={styles.container}>
        {loading && <Loader />}

        {/* <Text category="h5" style={styles.header}>
      Past bookings
    </Text> */}
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {bookings &&
            bookings.booking_requests.map((item) => {
              return (
                <TouchableOpacity
                  key={item.booking_id}
                  style={[styles.item]}
                  // onPress={() =>
                  //   navigation.navigate("BookedRoomDetails", {
                  //     item: item,
                  //   })
                  // }
                >
                  <View style={styles.row}>
                    <Icon
                      name={"bed-outline"}
                      type="ionicon"
                      size={50}
                      style={styles.image}
                    />
                    <View style={styles.info}>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: "bold",
                        }}
                      >
                        {/* <Icon name="time-outline" type="ionicon" size={15} />{" "} */}
                        Check In -
                        {item.booking_req_date.split(" ")[1].split(":")[0]}:
                        {item.booking_req_date.split(" ")[1].split(":")[1]}{" "}
                      </Text>
                      <Text appearance="hint">
                        {item.booking_req_date.split(" ")[0]}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      marginLeft: 5,
                      flexDirection: "row",
                      gap: 5,
                      flexWrap: "wrap",
                    }}
                  >
                    <Text>
                      <Text appearance="hint">Location : </Text>
                      <Text style={{}}>{item.booking_request_location} ,</Text>
                    </Text>
                    <Text>
                      <Text appearance="hint">Status : </Text>
                      <Text
                        style={{
                          color: "#fc7500",
                        }}
                      >
                        Waiting
                      </Text>
                    </Text>
                    <Text>
                      <Text appearance="hint">
                        Note : Room details will be shared once user is Checked
                        In or Blocked.
                      </Text>
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          {bookings &&
            bookings.booking_details.map((item) => {
              return (
                <TouchableOpacity
                  key={item.booking_id}
                  style={styles.item}
                  onPress={() =>
                    navigation.navigate("BookedRoomDetails", {
                      item: item,
                    })
                  }
                >
                  <View style={styles.row}>
                    <Icon
                      name={"bed-outline"}
                      type="ionicon"
                      size={50}
                      style={styles.image}
                    />
                    {/* <Image source={roombook} style={styles.image} /> */}
                    <View style={styles.info}>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: "bold",
                        }}
                      >
                        {/* <Icon name="time-outline" type="ionicon" size={15} />{" "} */}
                        Check In -
                        {
                          item.booking_req_checkin_time
                            .split(" ")[1]
                            .split(":")[0]
                        }
                        :
                        {
                          item.booking_req_checkin_time
                            .split(" ")[1]
                            .split(":")[1]
                        }{" "}
                      </Text>
                      <Text appearance="hint">
                        {item.booking_req_checkin_date.split(" ")[0]}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      marginLeft: 2,
                      flexDirection: "row",
                      gap: 3,
                      flexWrap: "wrap",
                    }}
                  >
                    <Text>
                      <Text appearance="hint">Room: </Text>

                      <Text style={{ textTransform: "capitalize" }}>
                        {item.booked_room}, Bed No. - {item.bed}
                      </Text>
                    </Text>
                    <Text>
                      <Text appearance="hint">Location: </Text>
                      <Text style={{}}>{item.booked_location},</Text>
                    </Text>
                    <Text>
                      <Text appearance="hint">Status: </Text>

                      {item.booking_status == 0 ? (
                        <Text style={{ color: "red" }}>Checked Out</Text>
                      ) : (
                        ""
                      )}
                      {item.booking_status == 1 ? (
                        <Text style={{ color: "orange" }}>Blocked</Text>
                      ) : (
                        ""
                      )}
                      {item.booking_status == 2 ? (
                        <Text style={{ color: "green" }}>Checked In</Text>
                      ) : (
                        ""
                      )}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          {bookings &&
            bookings.booking_details.length === 0 &&
            bookings.booking_requests.length === 0 && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: vh(70),
                }}
              >
                <Text>No bookings found.</Text>
              </View>
            )}
        </ScrollView>
      </View>
      <BannerAdScreen />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 20,
  },
  scrollViewContent: {},
  item: {
    marginBottom: 15,
    paddingVertical: 15,
    paddingHorizontal: 7,
    borderRadius: 8,
    backgroundColor: "#f7f9fc",
    gap: 10,
    justifyContent: "center",
    height: "auto",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
    gap: 5,
  },
});

export default PastBooking;
