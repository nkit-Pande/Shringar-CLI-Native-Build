import React, { useState, useEffect, useRef,useCallback } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import StepIndicator from 'react-native-step-indicator';
import { Colors } from '../color';
import ItemCard from '../components/ItemCard';
import * as Icon from 'react-native-feather';
import { useProduct } from '../context/productContext';
import SkeletonItemCard from '../components/SkeletonItemCard';
import * as Animatable from 'react-native-animatable';
import useToastNotification from '../helper/toast';



const screenWidth = Dimensions.get('window').width;

const dummyImage = [
  {
    id: '01',
    image: require('../TestImages/b1.jpg'),
  },
  {
    id: '02',
    image: require('../TestImages/b2.jpg'),
  },
  {
    id: '03',
    image: require('../TestImages/b3.jpg'),
  },
];

const dummyProduct = {
  product_id: 100,
  image_url: '',
  price: 320,
};

const renderCarousel = ({ item }) => (
  <View>
    <Image
      source={item.image}
      style={{ width: screenWidth, height: 210 }}
      resizeMode="cover"
    />
  </View>
);

const CategoryCard = ({ name ,url}) => (
  <View style={styles.categoryCardContainer}>
    <Image
      src={url}
      resizeMode="cover"
      style={styles.categoryImage}
    />
    <Text style={styles.categoryCardText}>{name}</Text>
  </View>
);

const Carousel = ({ currentPosition, setCurrentPosition }) => {
  const flatListRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (flatListRef.current) {
        let newIndex = currentPosition + 1;
        if (newIndex >= dummyImage.length) {
          newIndex = 0; // Reset index to loop back
        }
        setCurrentPosition(newIndex);
        flatListRef.current.scrollToIndex({ animated: true, index: newIndex });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentPosition, setCurrentPosition]);

  return (
    <Animatable.View delay={500} animation={'fadeInUp'} duration={1500}
    style={{ paddingBottom: 50,backgroundColor:'white' }}>
      <FlatList
        ref={flatListRef}
        data={dummyImage}
        renderItem={renderCarousel}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        initialScrollIndex={currentPosition}
        getItemLayout={(data, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
      />
      <View
        style={{
          width: '30%',
          alignSelf: 'center',
          marginTop: -20,
        }}>
        <StepIndicator
          customStyles={customStyles}
          currentPosition={currentPosition}
          stepCount={dummyImage.length}
        />
      </View>
    </Animatable.View>
  );
};

const Header = () => (
  <Animatable.View style={{ backgroundColor: Colors.primary, padding: 10 }}>
    <Animatable.Text delay={500} animation={'fadeInRight'} duration={1500} style={styles.headerText}>
      <Text
        style={{
          color: Colors.e_orange,
          fontSize: 60,
          fontFamily: 'GreatVibes-Regular',
        }}>
        S
      </Text>
      hringar
    </Animatable.Text>
    <Animatable.Text delay={500} animation={'fadeInRight'} duration={1500} style={styles.subHeaderText}>Madhya Pradesh</Animatable.Text>
    <Animatable.Text delay={500} animation={'fadeInRight'} duration={1500} style={styles.headerBodyText} numberOfLines={5}>
      Family-favorite sparkle, timeless treasures, and welcoming service await!
    </Animatable.Text>
    <Animatable.Image
      source={require('../TestImages/nobg.jpg')}
      style={{
        height: 100,
        width: 100,
        position: 'absolute',
        left: 30,
        top: 10,
      }}
      delay={1500} animation={'fadeInLeft'} duration={1500}
    />
  </Animatable.View>
);

const SearchBar = () => (
  <Animatable.View delay={1500} animation={'fadeIn'} duration={1500} style={styles.searchContainer}>
    <Icon.Search height={25} width={25} stroke={Colors.dark} />
    <TextInput
      placeholder="Search"
      placeholderTextColor={'grey'}
      style={styles.searchInput}
    />
    <View style={styles.verticleLine} />
    <TouchableOpacity onPress={() => alert('Option Clicked')} style={{ paddingLeft: 5 }}>
      <Icon.Filter height={20} width={20} stroke={Colors.dark} />
    </TouchableOpacity>
  </Animatable.View>
);

export default function DashBoard({ navigation }) {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const { products, page, setPage, getProductByCategory, getProductByMaterial,fetchProducts} = useProduct();
  const [refreshing, setRefreshing] = useState(false);
  const [isThreeSecondsPassed, setIsThreeSecondsPassed] = useState(false);
  // console.log(products)
  const { showToast } = useToastNotification();
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsThreeSecondsPassed(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isThreeSecondsPassed) {
      if (products.length === 0) {
        // console.log('1')
        showToast("Server Not Responding");
      }
    }
  }, [isThreeSecondsPassed, products]);
  const onRefresh = async ()=> {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
    if (products.length === 0) {
      console.log('1')
      showToast("Server Not Responding");
    }
  }
  

  const categories = [
    { id: 1, name: 'Rings',url:'https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dwfc4fb974/homepage/shopByCategory/fod-rings.jpg' },
    { id: 2, name: 'Earrings',url:'https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw47b1df4b/homepage/shopByCategory/fod-earrings.jpg'  },
    { id: 3, name: 'Bracelets' ,url:'https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw4dcf3d1d/homepage/shopByCategory/fod-bracelet.jpg' },
    { id: 4, name: 'Mangalsutra',url:'https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw114df9d7/homepage/shopByCategory/fod-mangalsutra.jpg' },
    { id: 5, name: 'Chains',url:'https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dwcbb3ebbb/homepage/shopByCategory/fod-chain.jpg'  },
    { id: 6, name: 'Necklaces',url:'https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dwb8086cf2/homepage/shopByCategory/fod-necklace.jpg'  },
    { id: 7, name: 'Bangles',url:'https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw7dbdbacf/homepage/shopByCategory/fod-bangle.jpg'  },
  ];

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        Alert.alert(
          "No Internet Connection",
          "Please check your internet connection and try again.",
          [{ text: "OK" }]
        );
      }
      setIsConnected(state.isConnected);
      console.log(state.type);
      console.log(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        animated={true}
        barStyle={isConnected ? 'dark-content' : 'light-content'}
        backgroundColor={isConnected ? Colors.primary : 'red'}
      />
      {isConnected ? (
       
        <ScrollView
          showsVerticalScrollIndicator={false}
          horizontal={false}
          bounces={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.dark]}

            />
          }
          // stickyHeaderIndices={[1]}
          >
          <View style={{backgroundColor:Colors.primary}}>
          <Header />
          {/* <View style={{ paddingVertical: 10, paddingHorizontal: 10, backgroundColor: Colors.primary }}>
            <SearchBar />
          </View> */}
          <Carousel
            currentPosition={currentPosition}
            setCurrentPosition={setCurrentPosition}
          />
          </View>
          {/* Most Gifted */}
          <Animatable.View delay={1000} animation={'fadeInUp'} duration={1500} style={styles.majorContainer}>
            <View style={styles.majorHeaderContainer}>
              <Text style={styles.majorHeader}>Top Products</Text>
              <View style={styles.divider} />
            </View>
            <FlatList
              style={{ width: '100%' }}
              data={products.length > 0 ? products : Array.from({ length: 2 })}
              renderItem={({ item }) =>
                products.length > 0 ? (
                  <ItemCard product={item} navigation={navigation} />
                ) : (
                  <SkeletonItemCard />
                )
              }
              showsVerticalScrollIndicator={false}
              horizontal
              contentContainerStyle={{ paddingLeft: 10, paddingRight: 3 }}
            />
          </Animatable.View>
          {/* Shop by Category */}
          <View style={styles.shopCatContainer}>
            <View style={styles.majorHeaderContainer}>
              <Text style={styles.majorHeader}>Top Category</Text>
              <View style={styles.divider} />
            </View>
            <View style={styles.categoryCardGroup}>
              {categories.map(category => (
                <CategoryCard key={category.id} name={category.name} url={category.url} />
              ))}
            </View>
          </View>
          {/* Most Sold */}
          <Animatable.View delay={1500} animation={'fadeInUp'} duration={1500} style={[styles.majorContainer, { paddingBottom: 2}]}>
            <View style={styles.majorHeaderContainer}>
              <Text style={styles.majorHeader}>Most Gifted</Text>
              <View style={styles.divider} />
            </View>
            <FlatList
              style={{}}
              data={products.length > 0 ? products : Array.from({ length: 2 })}
              renderItem={({ item }) =>
                products.length > 0 ? (
                  <ItemCard product={item} navigation={navigation} />
                ) : (
                  <SkeletonItemCard />
                )
              }
              showsVerticalScrollIndicator={false}
              horizontal
              contentContainerStyle={{ paddingLeft: 10, paddingRight: 10 }}
            />
          </Animatable.View>
        </ScrollView>
      ) : (
        <View style={styles.noInternetContainer}>
        <Image source={require('../TestImages/nointernet.png')} style={styles.noInternetImage} />
        <Text style={styles.noInternetText}>Please Check Your Internet Connection</Text>
        <Text style={styles.noInternetSubText}>Make sure you are connected to a stable network and try again.</Text>
      </View>
      )}
    </View>
  );
}

const customStyles = {
  stepIndicatorSize: 7,
  currentStepIndicatorSize: 7,
  separatorStrokeWidth: 0,
  currentStepStrokeWidth: 0,
  stepStrokeCurrentColor: Colors.dark,
  stepStrokeFinishedColor: 'white',
  stepStrokeUnFinishedColor: 'white',
  separatorFinishedColor: Colors.dark,
  separatorUnFinishedColor: 'white',
  stepIndicatorFinishedColor: Colors.charcoal,
  stepIndicatorUnFinishedColor: 'white',
  stepIndicatorCurrentColor: 'black',
  stepIndicatorLabelFontSize: 0,
  stepIndicatorLabelCurrentColor: 'transparent',
  stepIndicatorLabelFinishedColor: 'transparent',
  stepIndicatorLabelUnFinishedColor: 'transparent',
  labelColor: Colors.dark,
  currentStepLabelColor: Colors.dark,
  separatorWidth: 5,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // paddingTop:20
  },
  headerText: {
    fontSize: 40,
    color: Colors.e_orange,
    fontFamily: 'Poppins-Medium',
    textShadowColor: 'white',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 1,
    alignSelf: 'flex-end',
  },
  subHeaderText: {
    color: Colors.dark,
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.e_orange,
    alignSelf: 'flex-end',
    marginTop: -20,
  },
  headerBodyText: {
    fontSize: 12,
    width: '80%',
    fontFamily: 'Poppins-Medium',
    color: 'white',
    alignSelf: 'flex-end',
    textAlign: 'right',
    color: Colors.dark,
  },
  majorContainer: {
    marginVertical: 12,
    backgroundColor:'white'
  },
  majorHeaderContainer: {
    alignItems: 'center',
  },
  divider: {
    borderBottomColor: Colors.e_orange,
    borderBottomWidth: 2,
    width: '95%',
    marginVertical: 1,
    borderColor: Colors.e_orange,
    marginTop: 20,
  },
  majorHeader: {
    fontSize: 20,
    color: Colors.e_orange,
    fontFamily: 'Poppins-SemiBold',
    marginVertical: 0,
    marginBottom: -10,
    marginTop: 20
  },
  shopCatContainer: {
    marginVertical: 15,
  },
  categoryCardContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  categoryCardGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  categoryImage: {
    height: 130,
    width: 140,
    alignSelf: 'center',
    borderWidth: 0.2,
    borderColor: 'black',
    marginTop: 5,
    borderRadius: 7,
    margin:10
  },
  categoryCardText: {
    color: Colors.dark,
    alignSelf: 'center',
    fontFamily: 'Poppins-Bold',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    borderRadius: 10,
    borderWidth: 2,
    paddingHorizontal: 10,
    borderColor: 'black',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  searchInput: {
    color: Colors.dark,
    width: '70%',
    fontFamily: 'Poppins-Medium',
    paddingVertical: 13,
    marginLeft: 10,
    marginRight: 8,
  },
  verticleLine: {
    height: '80%',
    width: 1,
    backgroundColor: Colors.dark,
    margin: 8,
  },
  noInternetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  noInternetImage: {
    height: 200,
    width: 200,
  },
  noInternetText: {
    color: '#F50057',
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
  },
  noInternetSubText: {
    color: 'grey',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
