import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Dialog,
  Modal,
  Portal,
  Snackbar,
  TouchableRipple,
} from "react-native-paper";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
const Loader = () => {
  return (
    <View>
      <Portal>
        <Modal visible={true} contentContainerStyle={styles.containerStyle}>
          <ActivityIndicator
            animating={true}
            color={MD2Colors.blue800}
            style={{
              transform: "scale(1.2)",
            }}
          />

          <Text style={{ margin: 10, fontSize: 18 }}>Please wait...</Text>
        </Modal>
      </Portal>
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: "white",
    padding: 15,
    width: "80%",
    margin: "auto",
    borderRadius: 3,
    flexDirection: "row",
    justifyContent: "start",
    gap: 20,
    paddingLeft: 25,
  },
});
