import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from '../color';
import {Cpu, Heart} from 'react-native-feather';
import {useToast} from 'react-native-toast-notifications';
import {useWishlist} from '../context/wishlistContext';



export default function ItemCard({product, navigation}) {
  const [liked, setLiked] = useState(false);
  const {wishlistData, deleteItemFromWishlist, addItemToWishlist} =
    useWishlist();


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
        await addItemToWishlist(product);
        showToast('Added To Wishlist');
        setLiked(!liked);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      showToast('Error toggling wishlist');
    }
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
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => navigation.navigate('ItemDescription', {product})}>
      <TouchableOpacity style={{position: 'absolute', right: 0}}>
        <Heart stroke={'red'} width={25} height={25} />
      </TouchableOpacity>
      <Image
        style={styles.image}
        source={
          product.image_url
            ? {uri: product.image_url}
            : require('../TestImages/dummy.jpg')
        }
      />
      <View style={styles.textContainer}>
        <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
          {product.name}
        </Text>
        <Text style={styles.productPrice}>
          <Text
            style={{
              fontSize: 12,
            }}>
            ₹
          </Text>
          {product.price}
        </Text>
      </View>
      <TouchableOpacity style={styles.heart} onPress={() => toggleWishlist()}>
        <Heart
          stroke={liked ? 'red' : 'lightgrey'}
          width={23}
          height={23}
          fill={liked ? 'red' : 'lightgrey'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: 160,
    height: 200,
    backgroundColor: Colors.primary,
    marginHorizontal: 10,
    marginVertical:10,
    borderRadius: 5,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    elevation: 9,
    borderColor: Colors.e_orange,
    borderWidth: 0.2,
  },
  image: {
    width: '100%',
    height: 130,
    backgroundColor: 'white',
    marginBottom: 15,
    borderRadius: 5,
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 5,
  },
  productName: {
    fontSize: 13,
    color: Colors.dark,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.e_orange,
    fontWeight: 'bold',
    marginTop: 3,
    alignSelf: 'center',
  },
  heart: {
    position: 'absolute',
    right: 0,
    marginRight: 2,
    marginTop: 2,
    borderRadius: 50,
    borderColor: 'grey',
    padding: 2,
  },
});
