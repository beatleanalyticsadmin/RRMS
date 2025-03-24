import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";

import { dataCenter } from "../data/dataCenter";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { Button, Datepicker } from "@ui-kitten/components";
import { Icon } from "react-native-elements";
import Loader from "../components/Loader";
import BannerAdScreen from "../components/Ads/BannerAdScreen";

export default function ComplaintsUser({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const userId = useSelector((state) => state.userId);
  const [pageBtn, setPageBtn] = useState("Pending");
  const [filData, setFillData] = useState([]);
  const [bookingFromDate, setBookingFromDate] = useState(null);
  const [bookingTillDate, setBookingTillDate] = useState(null);
  const [bookFromSel, setbookFromSel] = useState(null);
  const [bookTillSel, setbookTillSel] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const renderAccessory = (iconName, from) => (
    <Icon
      name={iconName}
      style={styles.icon}
      type={from}
      size={22}
      color="#335075"
    />
  );
  const SignupRequestItem = ({ request }) => (
    <TouchableOpacity
      style={styles.requestContainer}
      onPress={() => {
        navigation.navigate("ComplaintsDetailsUser", {
          id: request.complaint_id,
        });
      }}
    >
      <View style={styles.header}>
        <Text style={styles.name}># {request.complaint_id}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>Staff Name </Text>
        <Text
          style={{
            fontWeight: "600",
          }}
        >
          {request.guest_name}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>Desination</Text>
        <Text
          style={{
            fontWeight: "600",
          }}
        >
          {request.desination}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>Location</Text>
        <Text
          style={{
            fontWeight: "600",
          }}
        >
          {request.guest_location_name}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>Complaint Type</Text>
        <Text
          style={{
            fontWeight: "600",
          }}
        >
          {request.complaint_type}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>Mobile</Text>
        <Text
          style={{
            fontWeight: "600",
          }}
        >
          {request.mobile}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>Status</Text>
        <Text
          style={{
            fontWeight: "600",
            backgroundColor: `${
              request.complaint_status == "Resolved" ? "green" : "orange"
            }`,
            color: "white",
            paddingVertical: 2,
            paddingHorizontal: 5,
            borderRadius: 5,
          }}
        >
          {request.complaint_status ? request.complaint_status : "Pending"}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>Staff Checkin Date</Text>
        <Text
          style={{
            fontWeight: "600",
          }}
        >
          {request.checkin_date ? request.checkin_date.split(" ")[0] : "-"}
        </Text>
      </View>
    </TouchableOpacity>
  );
  const fetchComplaints = async () => {
    try {
      const response = await fetch(
        `${dataCenter.apiUrl}/complaint_history.php`,
        {
          method: "POST",

          body: JSON.stringify({
            user_id: userId,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        const arr = data.filter((item) => {
          return item.complaint_status == null;
        });
        setFillData(arr);

        setData(data);
      } else if (response.status === 204) {
        setLoading(false);
        return { success: false, message: "No complaints found" };
      } else if (response.status === 400) {
        setLoading(false);
        return { success: false, message: data.error || "Bad request" };
      } else if (response.status === 404) {
        setLoading(false);
        return { success: false, message: data.error || "User not found" };
      } else {
        setLoading(false);
        return { success: false, message: "Something went wrong" };
      }
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.message };
    }
    setLoading(false);
  };
  const fetchComplaintsWithDate = async (from, till) => {
    setData([]);
    setFillData([]);
    setLoading(true);

    try {
      const response = await fetch(
        `${dataCenter.apiUrl}/lm/show_complaints_dashboard.php`,
        {
          method: "POST",

          body: JSON.stringify({
            user_id: userId,
            FromDate: from,
            ToDate: till,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        const arr = data.filter((item) => {
          return item.complaint_status == null;
        });
        setFillData(arr);

        setData(data);
      } else if (response.status === 204) {
        setLoading(false);
        return { success: false, message: "No complaints found" };
      } else if (response.status === 400) {
        setLoading(false);
        return { success: false, message: data.error || "Bad request" };
      } else if (response.status === 404) {
        setLoading(false);
        return { success: false, message: data.error || "User not found" };
      } else {
        setLoading(false);
        return { success: false, message: "Something went wrong" };
      }
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.message };
    }
    setLoading(false);
    setShowFilter(false);
  };
  // Fetch user data from API
  useFocusEffect(
    useCallback(() => {
      setPageBtn("Pending");
      fetchComplaints();
    }, [])
  );

  return (
    <>
      <BannerAdScreen />
      <View style={styles.container}>
        {loading && <Loader />}

        <View
          style={{
            flexDirection: "row",
            gap: 10,
            marginTop: 10,
            marginBottom: 30,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: `${pageBtn == "Pending" ? "#163053" : "white"}`,
              elevation: 5,
              paddingVertical: 10,
              paddingHorizontal: 13,
              borderRadius: 10,
            }}
            onPress={() => {
              setPageBtn("Pending");
              const arr = data.filter((item) => {
                return item.complaint_status == null;
              });
              setFillData(arr);
            }}
          >
            <Text
              style={{
                color: `${pageBtn == "Pending" ? "white" : "black"}`,
                fontSize: 13,
                fontWeight: "bold",
                letterSpacing: 0.8,
              }}
            >
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: `${pageBtn == "Esclated" ? "#163053" : "white"}`,
              elevation: 5,
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 10,
            }}
            onPress={() => {
              setPageBtn("Esclated");
              const arr = data.filter((item) => {
                return item.complaint_status == "Escalate";
              });
              setFillData(arr);
            }}
          >
            <Text
              style={{
                color: `${pageBtn == "Esclated" ? "white" : "black"}`,
                fontSize: 13,
                fontWeight: "bold",
                letterSpacing: 0.8,
              }}
            >
              Esclated
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: `${pageBtn == "Resolved" ? "#163053" : "white"}`,
              elevation: 5,
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 10,
            }}
            onPress={() => {
              setPageBtn("Resolved");
              const arr = data.filter((item) => {
                return item.complaint_status == "Resolved";
              });
              setFillData(arr);
            }}
          >
            <Text
              style={{
                color: `${pageBtn == "Resolved" ? "white" : "black"}`,
                fontSize: 13,
                fontWeight: "bold",
                letterSpacing: 0.8,
              }}
            >
              Resolved
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: `${pageBtn == "All" ? "#163053" : "white"}`,
              elevation: 5,
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 10,
            }}
            onPress={() => {
              setPageBtn("All");
              const arr = data.filter((item) => {
                return item;
              });
              setFillData(arr);
            }}
          >
            <Text
              style={{
                color: `${pageBtn == "All" ? "white" : "black"}`,
                fontSize: 13,
                fontWeight: "bold",
                letterSpacing: 0.8,
              }}
            >
              All
            </Text>
          </TouchableOpacity>
        </View>
        {filData && filData.length > 0 && (
          <FlatList
            data={filData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <SignupRequestItem request={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
        {filData && filData.length == 0 && (
          <View
            style={{
              height: vh(50),
              alignItems: "center",

              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                letterSpacing: 1,
              }}
            >
              No Complaints Found.
            </Text>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    margin: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  listContent: {
    paddingBottom: 20,
  },
  requestContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    paddingVertical: 5,
    paddingBottom: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginHorizontal: 1,
  },
  profileImage: {
    width: 40,
    height: 80,
    borderRadius: 20,
    marginRight: 15,
  },
  name: {
    fontSize: 23,
    fontWeight: "bold",
  },
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    marginHorizontal: 8,
  },
  label: {
    color: "#8F9BB3",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    gap: 10,
  },
  acceptButton: {
    backgroundColor: "#17385F",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 20,
    width: vw(40),
    textAlign: "center",
  },
  rejectButton: {
    backgroundColor: "#E4E9F2",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 20,
    width: vw(40),
  },
  acceptText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  rejectText: {
    color: "black",
    textAlign: "center",
  },
  button: {
    width: vw(27),
    // height: vh(5),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#17385F",

    borderRadius: 10,
    borderWidth: 0,
    // marginBottom: 20,
    // marginTop: 10,
  },
});
