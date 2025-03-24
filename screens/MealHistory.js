import React, { useCallback, useState } from "react";
import { View, Image, ScrollView } from "react-native";
import { Text, Layout, Icon } from "@ui-kitten/components";
import food from "../assets/food.png";
import { TouchableOpacity } from "react-native-gesture-handler";
import { TouchableRipple } from "react-native-paper";
import { useSelector } from "react-redux";
import { dataCenter } from "../data/dataCenter";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "../components/Loader";
import { vh } from "react-native-expo-viewport-units";
import BannerAdScreen from "../components/Ads/BannerAdScreen";

// Sample data with dates in 'dd-mm-yyyy' format
const orderss = [
  {
    name: "Breakfast",
    time: "3:30am",
    payment: "Pending",
    date: "26-10-2024",
  },
  {
    name: "Breakfast",
    time: "3:30am",
    payment: "Pending",
    date: "26-10-2024",
  },
  {
    name: "Lunch",
    time: "2:30pm",
    payment: "Paid",
    date: "24-10-2024",
  },
  {
    name: "Parcel",
    time: "1:30pm",
    payment: "Pending",
    date: "25-10-2024",
  },
];

// Helper function to format date
const formatDate = (dateString) => {
  const [day, month, year] = dateString.split("-").map(Number);
  const orderDate = new Date(year, month - 1, day);

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (orderDate.toDateString() === today.toDateString()) {
    return "Today";
  } else if (orderDate.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return orderDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }
};

// Group orders by date
const groupOrdersByDate = (orders) => {
  const groupedOrders = {};
  orders.forEach((order) => {
    if (!groupedOrders[order.date]) {
      groupedOrders[order.date] = [];
    }
    groupedOrders[order.date].push(order);
  });
  return groupedOrders;
};

const MealHistory = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const groupedOrders = groupOrdersByDate(orders);
  const userId = useSelector((state) => state.userId);
  // Sort dates in descending order
  const sortedDates = Object.keys(groupedOrders).sort((a, b) => {
    const [dayA, monthA, yearA] = a.split("-").map(Number);
    const [dayB, monthB, yearB] = b.split("-").map(Number);
    return (
      new Date(yearB, monthB - 1, dayB) - new Date(yearA, monthA - 1, dayA)
    );
  });
  const mealFecther = async () => {
    setLoading(true);

    const res = await fetch(`${dataCenter.apiUrl}/meal_history.php`, {
      method: "POST",
      body: JSON.stringify({ id: userId }),
    });
    const data = await res.json();

    if (res.ok) {
      const arr = data.map((item) => {
        const orgBookingDate = item.meal_booking_date.split(" ")[0];
        const date = new Date(orgBookingDate);

        const formattedDate = `${String(date.getDate()).padStart(
          2,
          "0"
        )}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${date.getFullYear()}`;
        const time =
          item.meal_booking_date.split(" ")[1].split(":")[0] +
          ":" +
          item.meal_booking_date.split(" ")[1].split(":")[1];
        const obj = {
          ...item,
          date: formattedDate,
          name: item.meal_category,
          time: time,
          payment: item.meal_payment_status == "0" ? "Pending" : "Paid",
        };

        return obj;
      });

      setOrders(arr);
    }
    setLoading(false);
  };
  useFocusEffect(
    useCallback(() => {
      mealFecther();
    }, [])
  );

  return (
    <>
      <BannerAdScreen />
      <Layout style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
        {loading && <Loader />}

        <ScrollView showsVerticalScrollIndicator={false}>
          {sortedDates.map((date, index) => (
            <View key={index} style={{ marginBottom: 24 }}>
              <Text
                category="s1"
                style={{ fontWeight: "bold", marginBottom: 15, fontSize: 22 }}
              >
                {formatDate(date)}
              </Text>

              {/* Highlighted group container */}
              <View
                style={{
                  backgroundColor: "#f9f9f9", // Light gray background for highlighting
                  borderRadius: 8,
                  paddingVertical: 16,
                  paddingHorizontal: 10,
                }}
              >
                {groupedOrders[date].map((order, itemIndex) => {
                  // Set the color based on payment status
                  const paymentColor =
                    order.payment === "Pending" ? "#ffa500" : "green";

                  return (
                    <TouchableRipple
                      key={itemIndex}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 16, // Reduced margin for better spacing
                        backgroundColor: "white",
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                        borderRadius: 5,
                        justifyContent: "space-around", // Ensure space between items
                        borderRadius: 5,
                      }}
                      onPress={() => {
                        navigation.navigate("BookedMealDetails", {
                          order: order,
                        });
                      }}
                      rippleColor={"white"}
                    >
                      <>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 3,
                          }}
                        >
                          <Image
                            source={food}
                            style={{
                              width: 70,
                              height: 70,
                              borderRadius: 8,
                              marginRight: 12,
                            }}
                          />
                          <View>
                            <Text
                              category="s1"
                              style={{
                                fontSize: 17,
                                fontWeight: "700",
                                marginBottom: 4,
                                letterSpacing: 0.4,
                              }}
                            >
                              {order.name}
                            </Text>
                            <Text
                              appearance="hint"
                              category="c1"
                              style={{
                                fontSize: 13,
                                marginVertical: 2,
                              }}
                            >
                              Time :{" "}
                              <Text
                                category="c1"
                                style={{ fontSize: 13, fontWeight: "700" }}
                              >
                                {order.time}
                              </Text>
                            </Text>
                            <Text
                              appearance="hint"
                              category="c1"
                              style={{
                                fontSize: 13,
                                marginVertical: 2,
                                maxWidth: "92%",
                              }}
                            >
                              Room :{" "}
                              <Text
                                category="c1"
                                style={{
                                  fontSize: 13,
                                  fontWeight: "700",
                                }}
                              >
                                {order.booked_room}
                              </Text>
                            </Text>
                            {order.booking_status != 2 &&
                              !order.meal_payment_status == 1 && (
                                <Text
                                  appearance="hint"
                                  category="c1"
                                  style={{ fontSize: 13 }}
                                >
                                  Payment:{" "}
                                  <Text
                                    category="c1"
                                    style={{
                                      fontWeight: "700",
                                      color: "red",
                                      letterSpacing: 0.6,
                                      fontSize: 14,
                                    }}
                                  >
                                    Expired
                                  </Text>
                                </Text>
                              )}

                            {order.booking_status == 2 && (
                              <Text
                                appearance="hint"
                                category="c1"
                                style={{ fontSize: 13 }}
                              >
                                Payment:{" "}
                                <Text
                                  category="c1"
                                  style={{
                                    fontWeight: "700",
                                    color: paymentColor,
                                    letterSpacing: 0.6,
                                    fontSize: 14,
                                  }}
                                >
                                  {order.payment}
                                </Text>
                              </Text>
                            )}
                            {order.booking_status != 2 &&
                              order.meal_payment_status == 1 && (
                                <Text
                                  appearance="hint"
                                  category="c1"
                                  style={{ fontSize: 13 }}
                                >
                                  Payment:{" "}
                                  <Text
                                    category="c1"
                                    style={{
                                      fontWeight: "700",
                                      color: "green",
                                      letterSpacing: 0.6,
                                      fontSize: 14,
                                    }}
                                  >
                                    Paid
                                  </Text>
                                </Text>
                              )}
                          </View>
                        </View>
                        <Icon
                          name="chevron-right"
                          width={25}
                          height={25}
                          fill="#8F9BB3" // Adjust color as needed
                        />
                      </>
                    </TouchableRipple>
                  );
                })}
              </View>
            </View>
          ))}
          {orders && orders.length == 0 && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: vh(70),
              }}
            >
              <Text>No meals ordered.</Text>
            </View>
          )}
        </ScrollView>
      </Layout>
    </>
  );
};

export default MealHistory;
