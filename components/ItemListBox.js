import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, { useState,useEffect } from "react";
import {Colors} from '../color';
import * as Icon from 'react-native-feather';
import {useToast} from 'react-native-toast-notifications';
import {useWishlist} from '../context/wishlistContext';

export default function ItemListBox({product, navigation}) {
    const [liked, setLiked] = useState(false);
    const {wishlistData, deleteItemFromWishlist, addItemToWishlist} = useWishlist();


  useEffect(() => {
    const checkLiked = () => {
      if (wishlistData && wishlistData.items) {
        const isInList = wishlistData.items.some(
          item => item.product_id === product.product_id,
        );
        setLiked(isInList);
      }
    };

    checkLiked();
  }, [wishlistData, product.product_id]);
  const toast = useToast();

  const toggleWishlist = async () => {
    try {
      if (liked) {
        await deleteItemFromWishlist(product.product_id);
        showToast('Removed From Wishlist');
        setLiked(!liked);
      } else {
        await addItemToWishlist(item);
        showToast('Added To Wishlist');
        setLiked(!liked);
      }
    } catch (error) {
      console.log('Error toggling wishlist:', error);
      showToast('Error toggling wishlist');
    }
  };
  const avgRating = product.avg_rating ? product.avg_rating : 0.0;
  const ratingColorSetter = rating => {
    if (rating >= 4) return Colors.success;
    if (rating > 2 && rating < 4) return Colors.warning;
    return 'red';
  };

  const showToast = message => {
    toast.show(message, {
      type: 'custom',
      placement: 'bottom',
      duration: 2000,
      animationType: 'slide-in',
      textStyle: {
        fontSize: 16,
        color: '#333',
      },
      style: {
        backgroundColor: '#fff',
        borderLeftWidth: 10,
        borderLeftColor: Colors.dark,
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        width: '90%',
        paddingHorizontal: 20,
        alignSelf: 'center',
        marginBottom: 10,
      },
      renderToast: toastOptions => (
        <View style={toastOptions.style}>
          <Text style={toastOptions.textStyle}>{toastOptions.message}</Text>
        </View>
      ),
    });
  };

  return (
    <TouchableOpacity style={[styles.container, styles.shadow]} onPress={() => navigation.navigate('ItemDescription', {product})}>
      <Image
        style={styles.image}
        source={
          product.image_url
            ? {uri: product.image_url}
            : require('../TestImages/dummy.jpg')
        }
      />
      <View style={styles.innerContainer}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={{color: Colors.dark, fontFamily: 'Poppins-SemiBold'}}>
          ₹{product.price}
        </Text>
        <View
          style={[
            styles.rating,
            {backgroundColor: ratingColorSetter(avgRating)},
          ]}>
          <Icon.Star
            stroke={Colors.warning}
            width={15}
            height={15}
            strokeWidth={1}
            fill={Colors.warning}
            style={{alignSelf:'center',paddingVertical:10, marginRight: 4}}
          />
          <Text style={styles.ratingText}>{avgRating}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.likeIcon} onPress={() => toggleWishlist()}>
        <Icon.Heart
          stroke={liked ? 'red' : 'lightgrey'}
          width={30}
          height={30}
          fill={liked ? 'red' : 'lightgrey'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '95%',
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
    // alignItems: 'center',
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 10,
    borderWidth: 0.1,
    borderColor: Colors.dark,
    margin: 4,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  innerContainer: {
    marginLeft: 10,
    paddingVertical: 10,
  },
  title: {
    fontSize: 16,
    color: Colors.dark,
    marginTop: 10,
    fontFamily: 'Poppins-SemiBold',
    textTransform: 'capitalize',
  },
  rating: {
    width:55,
    borderRadius: 5,
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 3,
    justifyContent: 'center',
    borderRadius: 5,
  },
  ratingText: {
    color: "white",
    fontFamily: "Poppins-Medium",
    marginEnd: 3,
    marginTop:3
  },
  likeIcon:{
    position:'absolute',
    right:20,
    // top:45,
    // bottom:20,
    alignSelf:'center',
    
  }
});
