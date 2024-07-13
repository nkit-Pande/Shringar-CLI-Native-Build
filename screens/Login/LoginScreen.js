import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import * as Icon from "react-native-feather";
import AuthService from '../../services/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from "../../context/userContext";
import { Colors } from "../../color";
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import useToastNotification from "../../helper/toast";
// ajaypanaskar8@gmail.com
// Ilovemykid

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isLoggedIn, setIsLoggedIn, setUserData, setUserInfo } = useUser();
  const { showToast } = useToastNotification();
  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      const data = await AuthService.login(trimmedUsername, trimmedPassword);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      await AsyncStorage.setItem('token', data.token);
      setUserInfo(data);
      navigation.replace('Starter');
    } catch (e) {
      setError('Login failed. Please check your credentials.');
      showToast('Login failed!')
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <LinearGradient colors={[Colors.primary,'white','white']} style={{ flex: 1, alignItems: "center",}}>
      <StatusBar
        animated={true}
        barStyle={'dark-content'}
        backgroundColor={Colors.primary}
        
        hidden={false}
      />

      <Animatable.Image
        animation="fadeInDown"
        duration={2000}
        style={styles.image}
        source={require("../../images/splash/undraw_pfp.png")}
        resizeMode="cover"
      />
      <View style={{ marginTop: -20 }}>
        <Animatable.View animation="fadeInRight" duration={1500} style={styles.textFieldContainer}>
          <Icon.AtSign
            stroke={Colors.e_orange}
            width={25}
            height={25}
            style={{ margin: 10 }}
          />
          <TextInput
            placeholder="Email"
            backgroundColor="white"
            placeholderTextColor={Colors.charcoal}
            style={styles.inputField}
            value={username}
            onChangeText={setUsername}
          />
        </Animatable.View>
        <Animatable.View animation="fadeInRight" duration={1500} delay={200} style={styles.textFieldContainer}>
          <Icon.Lock
            stroke={Colors.e_orange}
            width={25}
            height={25}
            style={{ margin: 10 }}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor={Colors.charcoal}
            style={styles.inputField}
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
            cursorColor={Colors.e_orange}
            textContentType="password"
          />
          <TouchableOpacity>
            <Text></Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeButton}>
            {passwordVisible ? (
              <Icon.Eye stroke={Colors.e_orange} width={25} height={25} />
            ) : (
              <Icon.EyeOff stroke={Colors.e_orange} width={25} height={25} />
            )}
          </TouchableOpacity>
        </Animatable.View>
      </View>
      <Animatable.Text animation="fadeInRight" duration={1500} delay={600} style={[styles.forgetPassword,{width:'90%'}]} >
        Forget Password?
      </Animatable.Text>
      {error ? (
        <Text  style={styles.errorText}>{error}</Text>
      ) : null}
      <Animatable.View animation="fadeInDown" duration={1500} delay={400}>
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={'white'} />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </Animatable.View>

      <View style={{marginTop:30,flexDirection:'row',alignItems:'center'}}>
          <Animatable.View animation="fadeInLeft" duration={1500} delay={400} style={styles.verticalLine} />
          <Animatable.Text animation="fadeIn" duration={1500} delay={400} style={[styles.forgetPassword,{paddingHorizontal:5}]} >OR</Animatable.Text>
          <Animatable.View animation="fadeInRight" duration={1500} delay={400} style={styles.verticalLine} />
      </View>
      
      <Animatable.View animation="fadeInUp" duration={1500} delay={400} style={{marginTop:10}}>
        <TouchableOpacity>
          <View style={{borderRadius:10,borderWidth:2,padding:5}} >
            <Image source={require('../../TestImages/google.png')} style={{width:50,height:50}} />
          </View>
        </TouchableOpacity>
      </Animatable.View>
      

      
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton}
            onPress={()=>navigation.goBack()}
          >
          <Icon.ArrowLeft  
            stroke={'white'} 
            width={25} 
            height={25} 
            strokeWidth={3}
          />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
    paddingVertical: 3,
    borderWidth: 2.5,
    borderRadius: 5,
    borderColor: Colors.e_orange,
    flexDirection: "row",
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 5,
    paddingHorizontal:3,
    marginHorizontal:10
  },
  button: {
    backgroundColor: Colors.e_orange,
    borderRadius: 5,
    alignItems: "center",
    justifyContent:"center",
    marginTop: 20,
    height:60,
    width:250
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    fontFamily: "Poppins-Medium",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 20,
    color: 'white',
    fontFamily: "Poppins-SemiBold",
  },
  inputField: {
    width: '70%',
    fontFamily: 'Poppins-Medium',
    color: Colors.dark,
    paddingVertical: 10,
    fontSize: 16,
  },
  eyeButton: {
    margin: 10,
  },
  forgetPassword:{
    fontFamily: 'Poppins-Medium',
    color: 'grey',
    fontSize: 14,
    textAlign:'right'
  },
  topBar:{
    width:'100%',
    height:'10%',
    position:'absolute',
    top:0,
    justifyContent:'center',
    marginTop:30
  },
  backButton:{
    height:60,
    width:70,
    borderTopRightRadius:50,
    borderBottomRightRadius:50,
    backgroundColor:Colors.e_orange,
    alignItems:"center",
    justifyContent:'center',
    alignSelf:'flex-start',
    marginTop:30,
},
verticalLine: {
  height: 2, 
  width: '40%',
  backgroundColor: 'black', 
},
});
