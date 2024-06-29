import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ItemBox from './ItemBox'
import { Colors } from '../color'
export default function OrderCard({item}) {
  return (
    <View style={[styles.container,styles.shadow]}>
      <Text style={styles.orderID}>OrderID:{121211}</Text>
      <ItemBox item={item} showQuantity={true} showShadow={false}/>
      <View style={styles.innerContainer} >
       
        <TouchableOpacity style={[styles.button]}>
          <Text style={styles.buttonText}>Details</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button,{backgroundColor:'red'}]}>
         <Text style={[styles.buttonText,{color:'white'}]}> Cancel</Text>
        </TouchableOpacity>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        width:'100%',
        marginVertical:10,
        // borderWidth:1,
        backgroundColor:'white',
        paddingBottom:10,
        borderRadius:10
    },
    innerContainer:{
      flexDirection:'row',
      justifyContent:"space-between",
      paddingHorizontal:12
    },
    button:{
      width:'49%',
      alignItems:'center',
      borderColor:Colors.dark,
      borderWidth:0.3,
      borderRadius:5
    },
    buttonText:{
      fontFamily:'Poppins-Medium',
      fontSize:17,
      color:Colors.dark,
      paddingVertical:10
    },
    orderID:{
      fontFamily:'Poppins-SemiBold',
      color:'grey',
      paddingLeft:15,
      marginBottom:-10
    },
    shadow: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },
})