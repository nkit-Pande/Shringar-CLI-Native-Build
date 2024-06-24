import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { useWishlist } from "../context/wishlistContext";
import { useProduct } from "../context/productContext";
import {Heart,ArrowLeft}from "react-native-feather";
import { Colors } from "../color";
// import { useFonts } from "expo-font";
import productService from "../services/product.service";
import ItemBox from "../components/ItemBox";
import * as Animatable from "react-native-animatable";
export default function WishlistScreen({navigation}) {
  // const [fontsLoaded] = useFonts({
  //   "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
  //   "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  //   "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  // });

  const { wishlistData } = useWishlist();
  const items = wishlistData.items;

  const Header = () => {
    return (
      <View style={styles.headerContainer}>
        <StatusBar
          animated={true}
          barStyle={"dark-content"}
          backgroundColor={Colors.primary}
          hidden={false}
        />
        <ArrowLeft
        width={25}
        height={25}
        stroke={Colors.dark}
        style={{marginLeft:10}}
        strokeWidth={3}
        onPress={()=>navigation.goBack()}
        />
        <Heart
          width={25}
          height={25}
          stroke={Colors.dark}
          fill={Colors.danger}
          style={styles.headerIcon}
        />
        <Text style={styles.headerText}>Wishlist</Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Header />
      <View style={{marginBottom:50}}>
        {items.length > 0 ? (
          <FlatList
            data={items}
            renderItem={({ item }) => <ItemBox item={item} showRemove={true} />}
            contentContainerStyle={styles.itemList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Animatable.Image
              source={require("../TestImages/undraw_Cat_epte.png")}
              style={styles.image}
              duration={3000}
              animation={"jello"}
              iterationCount={"infinite"}
              iterationDelay={1000}
            />
            <Text style={styles.emptyText}>Wishlist is empty</Text>
          </View>
        )}
      </View>
      {items.length>0?(
        <View style={styles.footer}>
        <TouchableOpacity style={styles.removeAll}>
          <Text style={styles.removeAllText}>Remove All</Text>
        </TouchableOpacity>
      </View>
      ):(<View/>)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    padding: 10,
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryM,
    // justifyContent:"center"
  },
  headerText: {
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
    color:Colors.dark
  },
  headerIcon: {
    marginLeft: 80,
    marginBottom: 8,
    marginRight: 5,
    alignSelf:'center'
  },
  itemList: {
    width: "100%",
    paddingBottom: 80,
  },
  emptyContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  emptyText: {
    fontSize: 18,
    color: "gray",
    fontFamily: "Poppins-SemiBold",
    width:'100%',
    textAlign:'center'
  },
  image: {
    height: 130,
    width: 130,
  },
  footer:{
    alignSelf:'center',
    position:'absolute',
    bottom:0,
    marginBottom:10
  },
  removeAll:{
    paddingVertical:12,
    backgroundColor:Colors.dark,
    paddingHorizontal:120,
    borderRadius:5
  },
  removeAllText:{
    color:'white',
    fontFamily:'Poppins-SemiBold'
  }
});
