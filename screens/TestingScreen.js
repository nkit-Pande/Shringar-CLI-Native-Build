import { StatusBar, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '../color'


export default function TestingScreen({navigation}) {
  return (
    <View style={styles.container}> 
      <TouchableOpacity onPress={()=>{navigation.navigate('Starter')}}>
        <Text style={{color:Colors.dark}}>Next</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
        padding:10
    }
})