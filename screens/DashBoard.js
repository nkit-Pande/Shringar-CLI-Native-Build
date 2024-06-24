import React, {useState, useEffect, useRef} from 'react';
import {
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
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import {Colors} from '../color';
import ItemCard from '../components/ItemCard';
import * as Icon from 'react-native-feather';
import {useProduct} from '../context/productContext';

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

const renderCarousel = ({item}) => {
  return (
    <View>
      <Image
        source={item.image}
        style={{width: screenWidth, height: 210}}
        resizeMode="cover"
      />
    </View>
  );
};

const CategoryCard = ({name}) => {
  return (
    <View style={styles.categoryCardContainer}>
      <Image
        source={require('../TestImages/dummy.jpg')}
        resizeMode="cover"
        style={styles.categoryImage}
      />
      <Text style={styles.categoryCardText}>{name}</Text>
    </View>
  );
};

const Carousel = ({currentPosition, setCurrentPosition}) => {
  const flatListRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (flatListRef.current) {
        let newIndex = currentPosition + 1;
        if (newIndex >= dummyImage.length) {
          newIndex = 0; // Reset index to loop back
        }
        setCurrentPosition(newIndex);
        flatListRef.current.scrollToIndex({animated: true, index: newIndex});
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentPosition, setCurrentPosition]);

  return (
    <View style={{marginBottom: 50}}>
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
    </View>
  );
};

const Header = () => {
  return (
    <View style={{backgroundColor: Colors.primary, padding: 10}}>
      <Text style={styles.headerText}>
        <Text
          style={{
            color: Colors.e_orange,
            fontSize: 60,
            fontFamily: 'GreatVibes-Regular',
          }}>
          S
        </Text>
        hringar
      </Text>
      <Text style={styles.subHeaderText}>Madhya Pradesh</Text>
      <Text style={styles.headerBodyText} numberOfLines={5}>
        Family-favorite sparkle, timeless treasures, and welcoming service
        await!
      </Text>
      <Image source={require('../TestImages/nobg.jpg')}   
      style={{
        height:100,
        width:100,
        position:'absolute',
        left:30,
        top:10, 
      }} 
      />

    </View>
  );
};

const SearchBar = () => {
  return (
    <View style={styles.searchContainer}>
      <Icon.Search height={25} width={25} stroke={Colors.dark} />
      <TextInput
        placeholder="Search"
        placeholderTextColor={'grey'}
        style={styles.searchInput}
      />
      <View style={styles.verticleLine} />
      <TouchableOpacity onPress={() => alert('Option Clicked')}>
        <Icon.Filter height={20} width={20} stroke={Colors.dark} />
      </TouchableOpacity>
    </View>
  );
};

export default function DashBoard({navigation}) {
  const [currentPosition, setCurrentPosition] = useState(0);
  const {products, page, setPage, getProductByCategory, getProductByMaterial} =
    useProduct();
  // ["Earrings", "Bracelets", "Rings", "Mangalsutra", "chain", "Necklaces", "Ring", "Chains"]
  const categories = [
    {
      id: 1,
      name: 'Rings',
    },
    {
      id: 2,
      name: 'Earrings',
    },
    {
      id: 3,
      name: 'Bracelets',
    },
    {
      id: 4,
      name: 'Mangalsutra',
    },
    {
      id: 5,
      name: 'Chains',
    },
    {
      id: 6,
      name: 'Necklaces',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar
        animated={true}
        barStyle={'dark-content'}
        backgroundColor={Colors.primary}
        hidden={false}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        horizontal={false}
        stickyHeaderIndices={[1]} // Index of the SearchBar to make it sticky
      >
        <Header />
        <View
          style={{
            paddingVertical: 10,
            paddingHorizontal: 10,
            backgroundColor: Colors.primary,
          }}>
          <SearchBar />
        </View>
        <Carousel
          currentPosition={currentPosition}
          setCurrentPosition={setCurrentPosition}
        />
        {/* Most Gifted */}
        <View style={styles.majorContainer}>
          <View style={styles.majorHeaderContainer}>
            <Text style={styles.majorHeader}>Most Gifted</Text>
            <View style={styles.divider} />
          </View>
          <View>
            <FlatList
              style={{width: '100%'}}
              data={products}
              renderItem={({item}) => (
                <ItemCard product={item} navigation={navigation} />
              )}
              showsVerticalScrollIndicator={false}
              horizontal
              contentContainerStyle={{
                paddingLeft: 10,
                paddingRight: 10,
              }}
            />
          </View>
        </View>
        {/* Shop by Category */}
        <View style={styles.shopCatContainer}>
          <View style={styles.majorHeaderContainer}>
            <Text style={styles.majorHeader}>Category</Text>
            <View style={styles.divider} />
          </View>
          <View style={styles.categoryCardGroup}>
            {categories.map(category => (
              <CategoryCard name={category.name} />
            ))}
          </View>
        </View>
        {/* Most Sold */}
        <View style={[styles.majorContainer, {paddingBottom: 10}]}>
          <View style={styles.majorHeaderContainer}>
            <Text style={styles.majorHeader}>Most Gifted</Text>
            <View style={styles.divider} />
          </View>
          <View>
            <FlatList
              style={{width: '100%'}}
              data={products}
              renderItem={({item}) => (
                <ItemCard product={item} navigation={navigation} />
              )}
              showsVerticalScrollIndicator={false}
              horizontal
              contentContainerStyle={{
                paddingLeft: 10,
                paddingRight: 10,
              }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const customStyles = {
  stepIndicatorSize: 10,
  currentStepIndicatorSize: 10,
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
  },
  headerText: {
    fontSize: 40,
    color: Colors.e_orange,
    fontFamily: 'Poppins-Medium',
    textShadowColor: 'white',
    textShadowOffset: {width: 2, height: 1},
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
    marginVertical: 2,
  },
  shopCatContainer: {
    marginVertical: 15,
  },
  categoryCardContainer: {
    height: 150,
    width: 150,
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 7,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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
    height: 120,
    width: 140,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'black',
    marginTop: 5,
    borderRadius: 7,
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
});
