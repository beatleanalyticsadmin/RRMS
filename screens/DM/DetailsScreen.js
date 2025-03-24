import React, { useCallback, useState } from "react";
import { StyleSheet, View, Text, ScrollView, Alert } from "react-native";
import { Layout, Divider } from "@ui-kitten/components";
import { Icon } from "react-native-elements";
import { vh, vw } from "react-native-expo-viewport-units";
import Loader from "../../components/Loader";

const DetailsScreen = ({ navigation, route }) => {
  const { page, locations } = route.params;

  return (
    <Layout style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.locationText}>{page}</Text>
        {/* <Divider style={styles.divider} /> */}
        {page &&
          page === "Rooms" &&
          locations.map((l) => {
            return (
              <View style={[styles.card, styles.elevation]} key={l.location_id}>
                <Text style={styles.sectionTitle}>{l.location_name}</Text>
                <View style={styles.row}>
                  <Icon
                    name="bed"
                    type="material"
                    color={"#163053"}
                    containerStyle={styles.iconContainer}
                    size={22}
                  />
                  <Text style={styles.label}>Total</Text>
                  <Text style={styles.value}>{l.total_occupancy}</Text>
                </View>
                <View style={styles.row}>
                  <Icon
                    name="king-bed"
                    type="material"
                    color={"#163053"}
                    containerStyle={styles.iconContainer}
                    size={22}
                  />
                  <Text style={styles.label}>Occupied</Text>
                  <Text style={styles.value}>{l.occupied}</Text>
                </View>
              </View>
            );
          })}

        {page &&
          page == "Meals" &&
          locations.map((l) => {
            return (
              <View style={[styles.card, styles.elevation]} key={l.location_id}>
                <Text style={styles.sectionTitle}>{l.location_name}</Text>
                <View style={styles.row}>
                  <Icon
                    name="fast-food-outline"
                    type="ionicon"
                    color={"#163053"}
                    containerStyle={styles.iconContainer}
                    size={22}
                  />
                  <Text style={styles.label}>Orders</Text>

                  <Text style={styles.value}>{l.meal_ordered}</Text>
                </View>
                <View style={styles.row}>
                  <Icon
                    name="delivery-dining"
                    type="material"
                    color={"#163053"}
                    containerStyle={styles.iconContainer}
                    size={22}
                  />
                  <Text style={styles.label}>Served</Text>

                  <Text style={styles.value}>{l.meal_served}</Text>
                </View>
              </View>
            );
          })}
        {page &&
          page == "Feedbacks" &&
          locations.map((l) => {
            return (
              <View style={[styles.card, styles.elevation]} key={l.location_id}>
                <Text style={styles.sectionTitle}>{l.location_name}</Text>
                <View style={styles.row}>
                  <Icon
                    name="calendar-today"
                    type="calendar_month"
                    size={20}
                    color={"#163053"}
                    containerStyle={styles.iconContainer}
                  />
                  <Text style={styles.label}>Today</Text>
                  <Text style={styles.value}>{l.today_feedback}</Text>
                </View>
                <View style={styles.row}>
                  <Icon
                    name="calendar-month"
                    type="calendar_month"
                    size={20}
                    containerStyle={styles.iconContainer}
                  />
                  <Text style={styles.label}>Month</Text>
                  <Text style={styles.value}>{l.monthly_feedback}</Text>
                </View>
              </View>
            );
          })}
        {page &&
          page == "Complaints" &&
          locations.map((l) => {
            return (
              <View style={[styles.card, styles.elevation]} key={l.location_id}>
                <Text style={styles.sectionTitle}>{l.location_name}</Text>
                <View style={styles.row}>
                  <Icon
                    name="message-alert-outline"
                    type="material-community"
                    size={20}
                    containerStyle={styles.iconContainer}
                  />
                  <Text style={styles.label}>Open</Text>
                  <Text style={styles.value}>{l.open_complaints}</Text>
                </View>
                <View style={styles.row}>
                  <Icon
                    name="message-alert"
                    type="material-community"
                    size={20}
                    containerStyle={styles.iconContainer}
                  />
                  <Text style={styles.label}>Closed</Text>
                  <Text style={styles.value}>{l.closed_complaints}</Text>
                </View>
              </View>
            );
          })}
        {page &&
          page == "GHI" &&
          locations.map((l) => {
            return (
              <View style={[styles.card, styles.elevation]} key={l.location_id}>
                <Text style={styles.sectionTitle}>{l.location_name}</Text>
                <View style={styles.row}>
                  <Icon
                    name="percent"
                    type="material"
                    size={20}
                    containerStyle={styles.iconContainer}
                  />
                  <Text style={styles.label}>GHI</Text>
                  <Text style={styles.value}>{l.ghi}%</Text>
                </View>
              </View>
            );
          })}
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
  locationText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#163053",
    marginBottom: 20,
  },
  divider: {
    marginVertical: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#163053",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  iconContainer: {
    backgroundColor: "#F0F0F0",
    padding: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: "#163053",
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "green",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#163053",
    width: vw(50),
    alignSelf: "center",
    borderWidth: 0,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    marginHorizontal: 5,
  },
  elevation: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default DetailsScreen;
