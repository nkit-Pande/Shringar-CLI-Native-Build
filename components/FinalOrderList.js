import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import { Colors } from "../color";
import { RadioButton } from "react-native-paper";

export default function FinalOrderList({ items, cartSubTotal, cartTotal }) {
  const [fontsLoaded] = useFonts({
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  const [checked, setChecked] = useState();

  const Header = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Order Summary</Text>
      </View>
    );
  };

  

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Header />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  headerContainer: {
    borderBottomWidth: 1,
    padding: 2,
  },
  headerText: {
    alignSelf: "center",
    fontFamily: "Poppins-Medium",
    fontSize: 20,
    padding: 5,
  },
  radioButtonContainer: {
    width: "100%",
    columnGap: 5,
    alignItems: "center",
  },
  radioBox: {
    width: "100%",
    backgroundColor: "red",
  },
  innerRadioContainer: {
    alignSelf: "stretch",
    marginTop: 20,
  },
  singleBox: {
    borderWidth: 1,
    marginTop: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 5,
    borderColor:'lightgrey',
    height:50,
    justifyContent:"center",
  },
  radioIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  singleBoxHeaderText: {
    alignSelf: "center",
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    marginLeft: 10,
    color:'grey'
  },
  
});
