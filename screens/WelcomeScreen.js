import {StyleSheet, View, Image, ImageBackground, Text, StatusBar, TouchableOpacity} from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import {Colors} from '../color';

export default function WelcomeScreen({navigation}) {
  return (
    <View style={styles.container}>
      <StatusBar
        animated={true}
        barStyle={"dark-content"}
        backgroundColor={Colors.primaryL}
      />
      <ImageBackground
        source={require('../TestImages/nobg.jpg')}
        style={styles.bgImage}
        blurRadius={20}
        resizeMode="cover"
        
        >
        
        <Animatable.Image
          source={require('../TestImages/nobg1.jpg')}
          style={styles.bgImage}
          animation={'rotate'}
          duration={90000}
          iterationCount={'infinite'}
          iterationDelay={0}
          delay={0}
          resizeMode="cover"
          blurRadius={0.4}
        />
        
      </ImageBackground>

      {/* Welcome Text  */}
      <Animatable.View 
        animation="fadeInDown" 
        duration={4000} 
        style={styles.textContainer}> 
          <Text style={styles.welcomeText}>
            Welcome{'\n'}To
          </Text>
          <Animatable.Text style={styles.headerText}
          animation={'pulse'}
          duration={5000}
          iterationCount={'infinite'}
          iterationDelay={10}
          delay={4000}
          >
          <Text
          delay={4000}
            style={{
              color: Colors.e_orange,
              fontSize: 90,
              fontFamily: 'GreatVibes-Regular',
            }}>
            S
          </Text>
          hringar
        </Animatable.Text>
      </Animatable.View>

      <Animatable.View 
        animation="fadeInUp" 
        delay={1500}
        duration={1500} 
        style={styles.loginContainer}>
          <TouchableOpacity style={styles.loginButton} onPress={()=>navigation.navigate('Login')}>
              <Text style={styles.loginText}>
                Login
              </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signUpButton} onPress={()=>navigation.navigate('SignUp')}>
              <Text style={styles.signUpText}>
                SignUp
              </Text>
          </TouchableOpacity>
      </Animatable.View>

      {/* <View style={styles.bottomCard}>

      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgImage: {
    height: 2000,
    width: 2000,
  },
  textContainer: {
    backgroundColor: 'transparent',
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    paddingBottom: 100
  },
  bottomCard: {
    height: 250,
    width: '100%',
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  welcomeText: {
    fontSize: 40,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'right',
    color: 'white',
    width:'83%',
    marginBottom:-26
  },
  headerText: {
    fontSize: 60,
    color: Colors.e_orange,
    fontFamily: 'Poppins-Medium',
    textShadowColor: 'white',
    textShadowOffset: {width: 2, height: 1},
    textShadowRadius: 1,
    alignSelf: 'center',
    marginTop: -50
  },
  loginContainer: {
    position: 'absolute',
    alignItems: 'center',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius:50,
    borderTopRightRadius:50,
    backgroundColor:'white',
    paddingBottom:40,
    paddingTop:40,
    borderWidth:4,
    borderTopColor:Colors.e_orange,
    borderRightWidth:0.5,
    borderLeftWidth:0.5
  },
  loginButton: {
    width:300,
    height:65,
    backgroundColor: Colors.e_orange,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'white',
    marginBottom: 10,
    alignItems:'center',
    justifyContent:'center'
  },
  loginText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: 20
  },
  signUpButton: {
    width:300,
    height:65,
    backgroundColor: 'white',
    borderWidth:2,
    borderRadius: 10,
    borderColor: Colors.rojo,
    alignItems:'center',
    justifyContent:'center'
  },
  signUpText: {
    color: Colors.rojo,
    fontFamily: 'Poppins-Medium',
    fontSize: 20
  }
    
});
