import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { ImageBackground } from "react-native-web";
export default function SplashScreen({ navigation }) {
    useEffect(() => {
      setTimeout(() => {
        navigation.replace("Boarding");
      }, 3000);
    }, []);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" ,backgroundColor:"white"}}>
        <Text
          style={{ fontSize: 30, fontWeight: "500" }}
        >
          <Text style={{ color: "#F7DC6F", fontSize: 45, fontWeight: "900" }}>
            S
          </Text>
          <Text>hringar</Text>
        </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
