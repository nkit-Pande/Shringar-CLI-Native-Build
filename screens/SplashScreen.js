import { StyleSheet, Text, View, StatusBar } from "react-native";
import React, { useEffect } from "react";
import { Colors } from "../color";
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    StatusBar.setHidden(true);
    setTimeout(() => {
      navigation.replace("Welcome");
    }, 3000);

    return () => {
      StatusBar.setHidden(false);
    };
  }, []);

  return (
    <LinearGradient colors={[Colors.primary,'white']} style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
      <Animatable.Text delay={500} animation={'fadeInUp'} duration={1500} style={styles.headerText}>
        <Text style={{ color: Colors.e_orange, fontSize: 60, fontFamily: 'GreatVibes-Regular' }}>
          S
        </Text>
        hringar
      </Animatable.Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 40,
    color: Colors.e_orange,
    fontFamily: 'Poppins-SemiBold',
    textShadowColor: 'white',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 1,
    alignSelf: 'center',
  },
});
