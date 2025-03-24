import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Layout, Text, Button } from "@ui-kitten/components";
import { Icon, Icon as RNEIcon } from "react-native-elements";
import room from "../assets/room.png";
import BannerAdScreen from "../components/Ads/BannerAdScreen";

const BookedRoomDetails = ({ navigation, route }) => {
  const item = route.params.item;

  const checkoutDate = item.booking_req_checkout_date;

  return (
    <Layout style={styles.container}>
      <BannerAdScreen />
      {/* <Image source={room} style={styles.image} /> */}
      <Icon
        name={"bed-outline"}
        type="ionicon"
        size={200}
        style={styles.image}
        color={"#2b2b2b"}
      />

      <Text category="h5" style={styles.sectionTitle}>
        Your reservation details
      </Text>

      <View style={styles.detailItem}>
        <RNEIcon
          name="user"
          type="font-awesome"
          size={18}
          style={styles.icon}
        />
        <View style={styles.detailText}>
          <Text category="s1">
            Name : {item.booked_user_name ? item.booked_user_name : ""}
          </Text>
        </View>
      </View>

      <View style={styles.detailItem}>
        <RNEIcon name="key" type="font-awesome" style={styles.icon} size={18} />
        <View style={styles.detailText}>
          <Text category="s1">
            Room : {item.booked_room ? item.booked_room : ""} Bed No. -{" "}
            {item.bed ? item.bed : "-"}
          </Text>
        </View>
      </View>

      <View style={styles.detailItem}>
        <RNEIcon name="calendar" type="font-awesome" style={styles.icon} />
        <View style={styles.detailText}>
          <Text category="s1">Check-in</Text>
          <Text appearance="hint">
            {item.booking_req_checkin_date
              ? item.booking_req_checkin_date.split(" ")[0]
              : "-"}
          </Text>
        </View>
        <Text category="s1">
          {item.booking_req_checkin_time.split(" ")[1].split(":")[0]}:
          {item.booking_req_checkin_time.split(" ")[1].split(":")[1]}
        </Text>
      </View>

      <View style={styles.detailItem}>
        <RNEIcon name="calendar" type="font-awesome" style={styles.icon} />
        <View style={styles.detailText}>
          <Text category="s1">Checkout</Text>
          <Text appearance="hint">
            {checkoutDate != "1970-01-01 00:00:00"
              ? checkoutDate.split(" ")[0]
              : "-"}
          </Text>
        </View>
        <Text category="s1">
          {checkoutDate != "1970-01-01 00:00:00"
            ? checkoutDate.split(" ")[1].split(":")[0]
            : "-"}
          {":"}
          {checkoutDate != "1970-01-01 00:00:00"
            ? checkoutDate.split(" ")[1].split(":")[1]
            : "-"}
        </Text>
      </View>
      <View style={styles.detailItem}>
        <RNEIcon
          name="check-circle"
          type="font-awesome"
          size={24}
          style={styles.icon}
        />
        <View style={styles.detailText}>
          <Text category="s1">Booking Status:</Text>
          <Text appearance="hint">
            {item.booking_status == 0 ? "Checked Out" : ""}
            {item.booking_status == 1 ? "Blocked" : ""}
            {item.booking_status == 2 ? "Checked In" : ""}
          </Text>
        </View>
      </View>
      <BannerAdScreen />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  image: {
    height: 200,
    width: "100%",
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F4",
    gap: 5,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  detailText: {
    flex: 1,
  },
  paymentInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  paidText: {
    fontWeight: "bold",
  },
  receiptButton: {
    borderRadius: 25,
    marginTop: 20,
    backgroundColor: "#F4F4F4",
  },
});

export default BookedRoomDetails;
