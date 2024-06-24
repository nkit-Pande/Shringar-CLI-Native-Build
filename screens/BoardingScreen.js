import { Image, StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import * as Animatable from "react-native-animatable";

export default function BoardingScreen({navigation}) {
  const whenDone = ()=>(
    navigation.replace('Login')
  )
  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        animated={true}
        barStyle={'dark-content'}
        hidden={false}
      />
      <Onboarding
        bottomBarColor="white"
        onDone={whenDone}
        onSkip={whenDone}
        pages={[
          {
            backgroundColor: "white",
            image: (
              <View>
                <Animatable.Image
                  duration={3000}
                  animation={"wobble"}
                  iterationCount={"infinite"}
                  iterationDelay={1000}
                  source={require("../images/splash/undraw_welcome_cats.png")}
                  style={styles.image1}
                />
              </View>
            ),
            title: (
              <Text>
                <Text style={{ color: "#6C63FF", fontSize: 30 }}>To</Text>
              </Text>
            ),
            subtitle: (
              <Text>
                <Text
                  style={{ fontSize: 50, color: "#6C63FF", fontWeight: "900" }}
                >
                  S
                </Text>
                <Text
                  style={{ fontSize: 35, color: "black", fontStyle: "italic" }}
                >
                  hringar
                </Text>
              </Text>
            ),
          },
          {
            backgroundColor: "white",
            image: (
              <View>
                <Animatable.Image
                  duration={1000}
                  animation={"pulse"}
                  iterationCount={"infinite"}
                  iterationDelay={1000}
                  source={require("../images/splash/undraw_gifts.png")}
                  style={styles.image2}
                />
              </View>
            ),
            title: (
              <Text>
                <Text style={{ color: "#6C63FF", fontSize: 30 }}>
                  Buy Exciting
                </Text>
              </Text>
            ),
            subtitle: (
              <Text>
                <Text
                  style={{ fontSize: 50, color: "#6C63FF", fontWeight: "900" }}
                >
                  G
                </Text>
                <Text
                  style={{ fontSize: 35, color: "black", fontStyle: "italic" }}
                >
                  ifts
                </Text>
              </Text>
            ),
          },
          {
            backgroundColor: "white",
            image: (
              <View>
                <Animatable.Image
                  duration={1000}
                  animation={"pulse"}
                  iterationCount={"infinite"}
                  iterationDelay={1000}
                  source={require("../images/splash/undraw_modern.png")}
                  style={styles.image3}
                />
              </View>
            ),
            title: (
              <Text>
                <Text style={{ color: "#6C63FF", fontSize: 30 }}>
                  Let's begin with
                </Text>
              </Text>
            ),
            subtitle: (
              <Text>
                <Text
                  style={{ fontSize: 50, color: "#6C63FF", fontWeight: "900" }}
                >
                  L
                </Text>
                <Text
                  style={{ fontSize: 35, color: "black" }}
                >
                  ogin
                </Text>
              </Text>
            ),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image1: {
    height: 200,
    width: 400,
    marginBottom: -80,
  },
  image2: {
    height: 200,
    width: 400,
  },
  image3: {
    height: 370,
    width: 370,
  },
});
