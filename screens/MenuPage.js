import React, { useCallback, useEffect, useState } from "react";
import { Layout, Text, Card } from "@ui-kitten/components";
import { StyleSheet, View, ScrollView, Image, Alert } from "react-native";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import BannerAdScreen from "../components/Ads/BannerAdScreen";
import food from "../assets/food.png";
import { dataCenter } from "../data/dataCenter";
import { vw } from "react-native-expo-viewport-units";

const MenuPage = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState(null); // Menu data
  const [meals, setMeals] = useState([]); // Meal prices
  const userId = useSelector((state) => state.userId);

  const fetchMenu = async () => {
    try {
      const response = await fetch(`${dataCenter.apiUrl}/food_menu.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const menuData = await response.json();
      setMenu(menuData.menu);
    } catch (error) {
      console.error("Error fetching menu:", error);
      Alert.alert("Error", "Failed to fetch menu. Please try again later.");
    }
  };

  const fetchMeals = async () => {
    try {
      const response = await fetch(`${dataCenter.apiUrl}/select_meal.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      });

      const result = await response.json();
      if (response.status === 200) {
        setMeals(result);
      } else {
        Alert.alert("Error", "Failed to fetch meal prices.");
      }
    } catch (error) {
      console.error("Error fetching meals:", error);
      Alert.alert("Error", "Unable to connect to the server.");
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchMenu(), fetchMeals()])
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, []);

  const renderTable = () => {
    if (!menu || meals.length === 0) {
      return <Text style={styles.noDataText}>No menu data available.</Text>;
    }

    return (
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 0.6 }]}>Meal Type</Text>
          <Text style={styles.tableHeaderText}>Menu</Text>
          <Text style={[styles.tableHeaderText, { flex: 0.6 }]}>Price</Text>
        </View>
        <ScrollView style={styles.tableBody}>
          {Object.keys(menu).map((mealType, index) => {
            const meal = meals.find((m) => m.meal_type === mealType);
            const price = meal ? meal.meal_price : "N/A";
            return (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 0.6 }]}>
                  {mealType}
                </Text>
                <Text style={[styles.tableCell, { fontWeight: "700" }]}>
                  {menu[mealType].map((item, i) =>
                    i === menu[mealType].length - 1 ? item : item + ", "
                  )}
                </Text>
                <Text style={[styles.tableCell, { flex: 0.6 }]}>₹ {price}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <BannerAdScreen />
      <Card style={styles.card}>
        {loading && <Loader />}
        <Image source={food} style={styles.image} />
        <Text category="h5" style={styles.title}>
          Today's Menu
        </Text>
        {renderTable()}
      </Card>
      <BannerAdScreen />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    padding: 5,
    paddingHorizontal: 0,
    borderRadius: 10,
    height: "auto",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 16,
    resizeMode: "contain",
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  tableContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 1,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableBody: {
    // maxHeight: 200, // Scrollable height
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 1,
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});

export default MenuPage;
