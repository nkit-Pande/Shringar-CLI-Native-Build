import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import OrderCard from '../components/OrderCard'
import * as Icon from 'react-native-feather';
import { Colors } from '../color';
const dummyProduct = {
  name:'Dummy',
  product_id: 100,
  image_url: '',
  price: 320,
  avg_rating:5.0,
  quantity:3
};
export default function OrderScreen({navigation}) {

  const Header = ()=>{
    return(
      <View style={styles.headerContainer}>
          <View style={{flexDirection:'row',alignItems:'center'}}>
          <Icon.ShoppingBag stroke={Colors.dark} height={25} width={25} style={{}}/>
          <Text style={styles.headerText}>Order</Text>
          </View>
          <TouchableOpacity onPress={()=> navigation.navigate('Cart', { fromOrder: true })}>
            <Icon.ShoppingCart stroke={Colors.dark} height={25} width={25} strokeWidth={2} style={{
              alignSelf:'flex-end'
            }}/>
          </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header/>
      <FlatList
        data={[1,2]}
        renderItem={()=>(
          <OrderCard item={dummyProduct}/>
        )}
        contentContainerStyle={styles.contentStyle}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white'
  },
  headerContainer:{
    width:'100%',
    backgroundColor:'white',
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:20,
    paddingVertical:12,
    justifyContent:"space-between"
  },
  headerText:{
    color:Colors.dark,
    fontFamily:'Poppins-SemiBold',
    marginLeft:10,
    fontSize:20,
    marginTop:10
  },
  contentStyle:{
    paddingHorizontal:10
  },
   shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
})