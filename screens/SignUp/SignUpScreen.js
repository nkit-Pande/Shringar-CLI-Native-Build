import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import * as Icon from "react-native-feather";
import React from "react";
import * as Animatable from 'react-native-animatable';
import { Colors } from "../../color";

export default function SignUpScreen({ navigation }) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.primary }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <StatusBar
            animated={true}
            barStyle={'dark-content'}
            hidden={false}
            backgroundColor={"white"}
          />
          <View style={styles.container}>
            <Animatable.Image
              animation="fadeInDown"
              duration={2000}
              style={styles.image}
              source={require("../../images/splash/undraw_pfp.png")}
              resizeMode="cover"
            />
            <View style={{ marginTop: -20 }}>
              <Animatable.View animation="fadeInLeft" duration={1500} style={styles.textFieldContainer}>
                <Icon.User
                  stroke={Colors.e_orange}
                  width={25}
                  height={25}
                  style={{ margin: 10 }}
                />
                <TextInput
                  placeholder="UserName"
                  backgroundColor="transparent"
                  placeholderTextColor={Colors.charcoal}
                  style={styles.inputField}
                />
              </Animatable.View>
              <Animatable.View animation="fadeInLeft" duration={1500} delay={200} style={styles.textFieldContainer}>
                <Icon.Mail
                  stroke={Colors.e_orange}
                  width={25}
                  height={25}
                  style={{ margin: 10 }}
                />
                <TextInput
                  placeholder="Email"
                  backgroundColor="transparent"
                  placeholderTextColor={Colors.charcoal}
                  style={styles.inputField}
                />
              </Animatable.View>
              <Animatable.View animation="fadeInLeft" duration={1500} delay={400} style={styles.textFieldContainer}>
                <Icon.Lock
                  stroke={Colors.e_orange}
                  width={25}
                  height={25}
                  style={{ margin: 10 }}
                />
                <TextInput
                  placeholder="Password"
                  backgroundColor="transparent"
                  placeholderTextColor={Colors.charcoal}
                  style={styles.inputField}
                  secureTextEntry={true}
                />
              </Animatable.View>
            </View>
            <Animatable.View animation="fadeInUp" duration={1500} delay={600}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </Animatable.View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton}
            onPress={()=>navigation.pop()}
          >
          <Icon.ArrowRight  
            stroke={'white'} 
            width={25} 
            height={25} 
            strokeWidth={3}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
    paddingBottom: 150,
    backgroundColor: "white"
  },
  image: {
    height: 200,
    width: 200,
    marginTop: 90,
    marginBottom: 40,
    borderRadius: 120,
    borderWidth: 5,
    borderColor: Colors.e_orange,
    padding: 10
  },
  textFieldContainer: {
    width: 300,
    height: 50,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: Colors.e_orange,
    flexDirection: "row",
    margin: 5,
  },
  button: {
    paddingHorizontal: 50,
    paddingVertical: 10,
    backgroundColor: Colors.e_orange,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 20,
    color: "white",
    fontFamily: "Poppins-SemiBold"
  },
  inputField: {
    width: '80%',
    fontFamily: 'Poppins-Medium',
    color: Colors.dark
  },
  topBar:{
    width:'100%',
    height:'10%',
    position:'absolute',
    top:0,
    justifyContent:'center',
    paddingTop:30
  },
  backButton:{
    height:60,
    width:70,
    borderTopLeftRadius:50,
    borderBottomLeftRadius:50,
    backgroundColor:Colors.e_orange,
    alignItems:"center",
    justifyContent:'center',
    alignSelf:'flex-end'
  }
});
