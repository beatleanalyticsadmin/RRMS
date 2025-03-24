import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useTheme } from "@ui-kitten/components";
import food from "../assets/food.png";
import { vw } from "react-native-expo-viewport-units";
import { dataCenter } from "../data/dataCenter";
import Loader from "../components/Loader";
import BannerAdScreen from "../components/Ads/BannerAdScreen";

const BookedMealDetails = ({ navigation, route }) => {
  const order = route.params.order;
  const [loading, setLoading] = useState(false);

  const paymentColor = order.meal_payment_status == 0 ? "#ffa500" : "green";
  const theme = useTheme();

  const handlePaymentConfirmation = () => {
    Alert.alert(
      "Confirm Payment",
      "Are you sure you want to proceed with the payment?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Payment Canceled"),
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            setLoading(true);
            try {
              const res = await fetch(`${dataCenter.apiUrl}/meal_payment.php`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json", // Ensure you're sending JSON
                },
                body: JSON.stringify({ meal_id: order.payment_id }),
              });

              const data = await res.json();
              console.log(data);

              setLoading(false);
              if (res.status === 200) {
                // Payment was successful
                Alert.alert("Success", data.message, [{ text: "OK" }]);

                navigation.navigate("MealHistory");
              } else if (res.status === 400 || res.status === 404) {
                // Handle client-side errors
                Alert.alert("Error", data.message, [{ text: "OK" }]);
              } else {
                // Handle other server-side errors
                Alert.alert(
                  "Error",
                  "An unexpected error occurred. Please try again.",
                  [{ text: "OK" }]
                );
              }
            } catch (error) {
              // Catch any network or API errors
              Alert.alert("Error", "Network error. Please try again later.", [
                { text: "OK" },
              ]);
              console.error(error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme["background-basic-color-1"] },
      ]}
    >
      {loading && <Loader />}
      <BannerAdScreen />
      <Image source={food} style={styles.image} resizeMode="center" />
      {order.meal_payment_status == 0 && order.booking_status == 2 && (
        <Text
          style={{
            fontSize: 20,
            textAlign: "center",
            fontWeight: "bold",
            color: paymentColor,
          }}
        >
          Payment Code - {order.code}
        </Text>
      )}

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>{order.date}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Amount</Text>
          <Text style={styles.detailValue}>₹ {order.price}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Meal Type</Text>
          <Text style={styles.detailValue}>{order.meal_category}</Text>
        </View>

        {order.booking_status == 2 && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Payment Status</Text>
            <Text style={[styles.detailValue, { color: paymentColor }]}>
              {order.meal_payment_status == 0 ? "Pending" : "Paid"}
            </Text>
          </View>
        )}
        {order.booking_status != 2 && !order.meal_payment_status == 1 && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Payment Status</Text>
            <Text style={[styles.detailValue, { color: "red" }]}>Expired</Text>
          </View>
        )}
        {order.booking_status != 2 && order.meal_payment_status == 1 && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Payment Status</Text>
            <Text style={[styles.detailValue, { color: "green" }]}>Paid</Text>
          </View>
        )}
      </View>

      {/* Payment button below the details section */}
      {order.meal_payment_status == 0 && order.booking_status == 2 && (
        <TouchableOpacity
          style={styles.paymentButton}
          onPress={handlePaymentConfirmation}
        >
          <Text style={styles.paymentButtonText}>Pay Now</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  detailsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  detailValue: {
    fontSize: 16,
  },
  paymentButton: {
    backgroundColor: "#28a745", // Green color for payment button
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20, // Added margin top to give space below the details
    width: vw(50),
    margin: "auto",
  },
  paymentButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default BookedMealDetails;
