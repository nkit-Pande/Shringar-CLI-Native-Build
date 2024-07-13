import { StyleSheet, Text, View, StatusBar } from "react-native";
import React, { useEffect } from "react";
import { Colors } from "../color";
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Welcome");
    }, 3500);

    return () => {
    };
  }, []);

  return (
    <LinearGradient colors={[Colors.primary,'white']} style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
      <StatusBar
        animated={true}
        barStyle={'dark-content'}
        backgroundColor={Colors.primary}
        hidden={false}/>
      <Animatable.View delay={900} animation={'fadeInDown'} duration={2500} >
        <View style={styles.headerTextContainer}>
          <Animatable.Text delay={2500} animation={'swing'} duration={1000} style={styles.animatedText}>
            S
          </Animatable.Text>
          <Text style={styles.headerText}>hringar</Text>
        </View>
      </Animatable.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  animatedText: {
    color: Colors.e_orange,
    fontSize: 60,
    fontFamily: 'GreatVibes-Regular',
    width:60
  },
  headerText: {
    marginLeft:-1,
    fontSize: 40,
    color: Colors.e_orange,
    fontFamily: 'Poppins-SemiBold',
    textShadowColor: 'white',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 1,
  },
});
