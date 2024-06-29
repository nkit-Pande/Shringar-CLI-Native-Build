import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Image,
  ScrollView,
  Share
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ArrowLeft,
  RefreshCcw,
  Share2,
  ShoppingCart,
  Star,
  TrendingUp,
  Truck,
} from 'react-native-feather';
import {Heart} from 'react-native-feather';
import {useCart} from '../context/cartContext';
import {useToast} from 'react-native-toast-notifications';
import {useWishlist} from '../context/wishlistContext';
import {Colors} from '../color';
import {Rating} from 'react-native-ratings';

const Header = ({navigation, title, onPressCart, onPressWishlist, liked}) => (
  <View style={styles.topBar}>
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.goBack()}>
      <ArrowLeft height={30} width={30} stroke={'black'} />
    </TouchableOpacity>

    <Text style={styles.screenHeader}>{title}</Text>
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity style={styles.otherButton} onPress={onPressCart}>
        <ShoppingCart height={25} width={25} stroke={'black'} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.otherButton} onPress={onPressWishlist}>
        <Heart
          height={25}
          width={25}
          stroke={'red'}
          fill={liked ? 'red' : 'none'}
        />
      </TouchableOpacity>
    </View>
  </View>
);

export default function ItemDescription({route, navigation}) {
  const {product} = route.params;
  const {addItem} = useCart(false);
  const {
    addItemToWishlist,
    deleteItemFromWishlist,
    wishlistData,
    isInWishlist,
  } = useWishlist();
  const [liked, setLiked] = useState(false);
  const rating = 3.4;
  const reviews = 5;
  console.log(product)
  const toast = useToast();

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
  const shareProduct = async () => {
    try {
      await Share.share({
        message: `Check out this product: ${product.name} - ${product.description} - ₹${product.price}`,
        url: product.image_url,
      });
    } catch (error) {
      console.error('Error sharing product:', error);
      showToast('Error sharing product');
    }
  };

  const addProductToCart = async () => {
    await addItem(product, 1);
    showToast('Added To Cart');
  };

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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.primary,
        backgroundColor: 'white',
      }}>
      <StatusBar
        animated={true}
        barStyle={'dark-content'}
        backgroundColor={Colors.primary}
        hidden={false}
      />
      <Header
        navigation={navigation}
        title="Product Description"
        onPressCart={() => {
          navigation.navigate('Cart');
        }}
        onPressWishlist={toggleWishlist}
        liked={liked}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.imageContainer}>
          {/* Main Image */}
          <Image
            style={styles.itemImage}
            source={
              product.image_url
                ? {uri: product.image_url}
                : require('../TestImages/dummy.jpg')
            }
            resizeMode="cover"
          />
        </View>
        <View style={styles.productDetails}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <View>
              <Text style={styles.productName}>{product.name}</Text>
              <View style={styles.rating}>
                <Rating
                  readonly
                  ratingCount={5}
                  startingValue={product.avg_rating}
                  imageSize={15}
                  showRating={false}
                  style={{backgroundColor: 'transparent'}}
                />
                <Text style={styles.ratingText}>{product.avg_rating}</Text>
              </View>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '300',
                  paddingLeft: 7,
                  marginTop: -2,
                  fontFamily: 'Poppins-Medium',
                  color: '#A5A5A5',
                }}>
                {product.review_count} Reviews
              </Text>
            </View>
            <TouchableOpacity onPress={shareProduct}>
                <Share2 stroke={Colors.dark} width={25} height={25} style={{alignSelf:'center'}}/>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />

          <Text style={styles.productDescription}>{product.description}</Text>

          <Text style={styles.productPrice}>₹{product.price}</Text>

          <Text style={styles.taxText}>PRICE IS INCLUSIVE OF ALL TAX</Text>

          <View
            style={{flexDirection: 'row', marginTop: 13, alignItems: 'center'}}>
            <Text style={styles.weightHeader}>Gross Weight:</Text>
            <View style={styles.weightContainer}>
              <Text style={styles.weightText}>{product.weight} Gram</Text>
            </View>
          </View>
          <View
            style={{flexDirection: 'row', marginTop: 13, alignItems: 'center'}}>
            <Text style={styles.weightHeader}>Gold Purity:</Text>
            <View style={styles.weightContainer}>
              <Text style={styles.weightText}>20 Karat</Text>
            </View>
            {/* {product.carat} */}
          </View>

          <View style={[styles.divider, {marginVertical: 12}]} />
          <View>
            <View style={styles.guarantySection}>
              <TrendingUp
                stroke={Colors.dark}
                height={25}
                width={25}
                strokeWidth={3}
                style={styles.guarantyIcon}
              />
              <Text style={styles.guarantyText}>Purity Guaranteed</Text>
            </View>
          </View>
          <View>
            <View style={styles.guarantySection}>
              <RefreshCcw
                stroke={Colors.dark}
                height={25}
                width={25}
                strokeWidth={3}
                style={styles.guarantyIcon}
              />
              <Text style={styles.guarantyText}>
                Exchange Across All Stores
              </Text>
            </View>
          </View>
          <View>
            <View style={styles.guarantySection}>
              <Truck
                stroke={Colors.dark}
                height={25}
                width={25}
                strokeWidth={2.5}
                style={styles.guarantyIcon}
              />
              <Text style={styles.guarantyText}>
                Free Shipping All Across India
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <TouchableOpacity onPress={addProductToCart} style={styles.bottomButton}>
        <View style={styles.addToCart}>
          <ShoppingCart
            height={25}
            width={25}
            stroke={'white'}
            style={{
              marginRight: 10,
            }}
            strokeWidth={2}
          />
          <Text style={styles.addToCartText}>ADD TO CART</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    marginBottom: 10,
    borderWidth: 0.2,
    borderBlockStartColor: Colors.primary,
  },
  backButton: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  otherButton: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    margin: 2,
  },
  screenHeader: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    alignSelf: 'center',
    color: Colors.dark,
  },
  itemImage: {
    height: 320,
    width: '100%',
    borderWidth: 1,
    borderColor: 'grey',
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
  scrollViewContent: {
    width: '97%',
    alignItems: 'center',
    marginHorizontal: 5,
    paddingBottom: 90,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    paddingHorizontal: 5,
  },
  productDetails: {
    width: '100%',
    paddingHorizontal: 20,
  },
  productName: {
    fontSize: 24,
    marginVertical: 10,
    color: Colors.dark,
    fontFamily: 'Poppins-SemiBold',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 21,
    fontFamily: 'Poppins-Bold',
    color: Colors.dark,
  },
  productMRP: {
    fontSize: 30,
    marginRight: 10,
    fontFamily: 'Poppins-Medium',
  },
  productDiscount: {
    fontSize: 14,
    color: 'red',
  },
  productDescription: {
    marginVertical: 10,
    fontSize: 14,
    color: 'gray',
    fontFamily: 'Poppins-Medium',
  },
  addToCart: {
    backgroundColor: Colors.dark,
    height: 50,
    paddingHorizontal:80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row',
  },
  addToCartText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Poppins-Medium',
    paddingTop: 3,
  },
  rating: {
    marginLeft: 5,
    marginTop: -15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ratingText: {
    fontFamily: 'Poppins-SemiBold',
    color: Colors.dark,
    paddingLeft: 8,
  },
  divider: {
    borderBottomColor: 'gray',
    borderBottomWidth: 2,
    width: '100%',
    marginVertical: 1,
    borderColor: Colors.dark,
  },
  taxText: {
    marginTop: -5,
    fontSize: 10,
    marginRight: 10,
    fontFamily: 'Poppins-Medium',
    color: 'grey',
  },
  weightHeader: {
    fontFamily: 'Poppins-Bold',
    color: Colors.dark,
  },
  weightContainer: {
    borderWidth: 1.5,
    marginLeft: 10,
    borderRadius: 10,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  weightText: {
    fontFamily: 'Poppins-Bold',
    color: Colors.dark,
  },
  guarantySection: {
    flexDirection: 'row',
    marginVertical: 3,
  },
  guarantyIcon: {},
  guarantyText: {
    marginLeft: 10,
    fontFamily: 'Poppins-Medium',
    color: 'grey',
  },
  bottomButton:{
    position:'absolute',
    bottom:10,
    alignSelf:'center'
  }
});

// <View style={styles.rating}>
//             <Star
//               stroke={Colors.warning}
//               width={15}
//               height={15}
//               strokeWidth={1}
//               fill={Colors.warning}
//             />
//             <Text style={styles.ratingText}>4</Text>
//           </View>
