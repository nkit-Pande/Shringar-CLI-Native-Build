import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Colors } from "../color";
import * as Icon from "react-native-feather";
import { useCart } from "../context/cartContext";
import { useWishlist } from "../context/wishlistContext";
export default function ItemBox({ item, showRemove=false, showQuantity=false }) {
  const [counter, changeCounter] = useState(1);
  const hw = 25;
  const [ratingColor, setRatingColor] = useState("green");
  const { deleteItem, increment, decrement } = useCart();
  const { deleteItemFromWishlist } = useWishlist();
  const avgRating = item.avg_rating ? item.avg_rating : 0.0;
  const handleDecrease = () => {
    if (counter > 1) {
      decrement(item.product_id);
      changeCounter(counter - 1);
    } else {
      deleteItem(item.product_id);
    }
  };
  const removeItem = (item) => {
    deleteItemFromWishlist(item.product_id);
  };

  const handleIncrease = () => {
    changeCounter(counter + 1);
    increment(item.product_id);
  };

  const truncatedTitle = (title) => {
    return title.length > 20 ? title.substring(0, 20) + "..." : title;
  };

  const ratingColorSetter = (rating) => {
    if (rating >= 4) return Colors.success;
    if (rating > 2 && rating < 4) return Colors.warning;
    return "red";
  };

  const RemoveButton = () => {
    return (
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeItem(item)}
      >
        <Icon.X width={20} height={20} stroke={"white"} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flexDirection: "row" }}>
      <View style={styles.container}>
        <Image style={styles.image} source={item.image_url ? {uri: item.image_url}: require('../TestImages/dummy.jpg')} />
        <View style={styles.outerBox}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {truncatedTitle(item.name)}
          </Text>

          <View style={styles.innerBox}>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{ color: Colors.dark, fontFamily: "Poppins-SemiBold" }}
              >
                ₹{item.price}
              </Text>

              {showQuantity ? (
                <Text style={styles.quantityText}>Quantity : {item.quantity}</Text>
              ) : (
                <View
                  style={[
                    styles.rating,
                    { backgroundColor: ratingColorSetter(avgRating) },
                  ]}
                >
                  <Icon.Star
                    stroke={Colors.warning}
                    width={15}
                    height={15}
                    strokeWidth={1}
                    fill={Colors.warning}
                    style={{ alignSelf: "center", marginRight: 4 }}
                  />
                  <Text style={styles.ratingText}>{avgRating}</Text>
                </View>
              )}
            </View>

            {showRemove || showQuantity ? (
              <View />
            ) : (
              <View style={styles.counterBox}>
                <TouchableOpacity
                  style={styles.iconBox1}
                  onPress={handleDecrease}
                >
                  <Icon.Minus height={hw} width={hw} stroke={"white"} />
                </TouchableOpacity>
                <Text style={styles.counterText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.iconBox2}
                  onPress={handleIncrease}
                >
                  <Icon.Plus
                    height={hw}
                    width={hw}
                    stroke={Colors.dark}
                    strokeWidth={1}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
      {showRemove ? <RemoveButton /> : <View />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "95%",
    backgroundColor: "white",
    marginHorizontal: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 10,
    borderWidth: 0.1,
    borderColor: Colors.dark,
    margin: 4,
  },
  outerBox: {
    marginLeft: 5,
    width: "72%",
  },
  title: {
    fontSize: 16,
    color: Colors.dark,
    marginTop: 10,
    fontFamily: "Poppins-Medium",
  },
  innerBox: {
    marginTop: 5,
    marginLeft: 5,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  counterText: {
    marginVertical: 5,
    marginHorizontal: 15,
    fontSize: 15,
    fontWeight: "bold",
    color:Colors.dark
  },
  counterBox: {
    flexDirection: "row",
    marginTop: 4,
    marginRight: 10,
  },
  iconBox1: {
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: Colors.dark,
    height: 30,
  },
  iconBox2: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: Colors.dark,
    height: 30,
  },
  removeButton: {
    backgroundColor: Colors.dark,
    borderRadius: 50,
    flexDirection: "row",
    height: 30,
    width: 30,
    position: "absolute",
    right: 10,
    top: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    fontFamily: "Poppins-Medium",
    color: "white",
  },
  rating: {
    flex: 1,
    marginLeft: 5,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 5,
    marginBottom: 3,
    justifyContent: "center",
    borderRadius: 5,
  },
  ratingText: {
    color: "white",
    fontFamily: "Poppins-Medium",
    marginEnd: 3,
  },
  quantityText:{
    fontFamily:'Poppins-Medium',
    color:Colors.dark,
    fontSize:14,
    paddingBottom:10,
    paddingTop:4
  }
});
