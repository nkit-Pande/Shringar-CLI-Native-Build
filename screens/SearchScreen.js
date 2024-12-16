import * as Icon from 'react-native-feather';
import { Colors } from '../color';
import ItemCard from '../components/ItemCard';
import { useProduct } from '../context/productContext';
import * as Animatable from 'react-native-animatable';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableHighlight,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';

export default function SearchScreen({ navigationMain,navigation }) {
  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchTextInput = useRef(null);
  const { products } = useProduct();

  useEffect(() => {
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setSearchResult(filteredProducts);
  }, [searchText, products]);

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  const handleSearchSubmit = () => {
    searchTextInput.current.blur();
  };

  const handleSearchChange = text => {
    setSearchText(text);
  };

  const ResultView = () => {
    return (
      <View style={styles.resultContainer}>
        <Text style={styles.recommendationText}>Result:</Text>
        {searchResult.length > 0 ? (
          <FlatList
            data={searchResult}
            renderItem={({ item }) => {
              return <ResultItems product={item} navigation={navigation} />;
            }}
          />
        ) : (
          <Animatable.View
            animation={'bounce'}
            delay={1000}
            style={styles.noDataView}>
            <Image
              source={require('../TestImages/nodata.png')}
              style={styles.noDataImage}
            />
            <Text style={styles.noDataText}>Product Not Found!</Text>
          </Animatable.View>
        )}
      </View>
    );
  };

  const ResultItems = ({ product, navigation }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('ItemDescription', { product })}
        style={styles.resultItemContainer}>
        <Image
          source={
            product.image_url
              ? { uri: product.image_url }
              : require('../TestImages/dummy.jpg')
          }
          style={styles.resultImage}
          resizeMode="contain"
        />
        <View style={styles.resultItemTextContainer}>
          <Text style={styles.resultItemName}>{product.name}</Text>
          <Text style={styles.resultItemPrice}>₹{product.price}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const recommendation = [
    'Ring',
    'Bracelet',
    'Mangalsutra',
    'Gold',
    'Silver',
    'Earring',
    'Chains',
  ];

  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <View style={styles.searchContainer}>
          <Icon.Search
            style={styles.searchIcon}
            height={23}
            width={23}
            stroke={Colors.dark}
            strokeWidth={3}
          />
          <TextInput
            ref={searchTextInput}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            onSubmitEditing={handleSearchSubmit}
            onChangeText={handleSearchChange}
            value={searchText}
            placeholder="Search"
            placeholderTextColor={'grey'}
            style={styles.searchInput}
            cursorColor={Colors.dark}
            clearButtonMode="while-editing"
            maxLength={50}
          />
        </View>
        <Animatable.View animation={'bounceIn'}>
          <TouchableHighlight
            onPress={() => navigation.goBack()}
            style={styles.searchModalCloseButton}>
            <Icon.ArrowRight height={25} width={25} stroke={'white'} />
          </TouchableHighlight>
        </Animatable.View>
      </View>
      {searchText.length > 0 ? (
        <ResultView />
      ) : (
        <Animatable.View
          animation={'fadeIn'}
          style={styles.recommendationContainer}>
          <Text style={styles.recommendationText}>Recommendation</Text>
          <View style={styles.recommendationItemsContainer}>
            {recommendation.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSearchText(item)}>
                <View style={styles.recommendationItem}>
                  <Text style={styles.modelBaseText}>{item}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animatable.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchHeader: {
    paddingHorizontal: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    width: '86%',
    paddingHorizontal: 5,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderWidth: 2,
    paddingHorizontal: 10,
    borderColor: 'black',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  searchIcon: {
    marginHorizontal: 2,
  },
  searchInput: {
    color: Colors.dark,
    width: '90%',
    height: 55,
    fontFamily: 'Poppins-Medium',
    marginLeft: 10,
  },
  searchModalCloseButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark,
    marginLeft: 5,
    borderColor: 'black',
    borderRadius: 50,
    borderWidth: 2,
  },
  resultContainer: {
    paddingHorizontal: 11,
    marginTop: 25,
    width: '100%',
    paddingBottom: 10,
    flex: 1,
  },
  noDataView: {
    flex: 1,
    alignItems: 'center',
    marginTop: 120,
  },
  noDataImage: {
    height: 180,
    width: 180,
  },
  noDataText: {
    color: Colors.dark,
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    marginTop: -10,
  },
  resultItemContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderWidth:0.2,
    padding:10,
    marginVertical:5,
    borderRadius:10
  },
  resultImage: {
    height: 90,
    width: 90,
    borderRadius:10,
    borderWidth:1
  },
  resultItemTextContainer: {
    marginLeft: 10,
    height: '100%',
    width: '73%',
    paddingVertical: 10,
  },
  resultItemName: {
    color: Colors.dark,
    fontFamily:'Poppins-SemiBold',
    fontSize: 15,
  },
  resultItemPrice: {
    color: 'grey',
    fontFamily:'Poppins-Medium',
    fontSize: 15,
  },
  recommendationContainer: {
    paddingHorizontal: 10,
    marginTop: 25,
    width: '100%',
  },
  recommendationText: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: 'grey',
    textDecorationLine: 'underline',
    textDecorationColor: Colors.dark,
  },
  recommendationItemsContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  recommendationItem: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'grey',
    marginVertical: 2,
    marginHorizontal: 2,
  },
  modelBaseText: {
    color: 'grey',
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
  },
});
