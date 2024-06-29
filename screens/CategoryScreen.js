import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  FlatList,
  Animated,
} from 'react-native';
import * as Icon from 'react-native-feather';
import {Colors} from '../color';
import ItemCard from '../components/ItemCard';
import {useProduct} from '../context/productContext';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import SkeletonItemCard from '../components/SkeletonItemCard';
export default function CategoryScreen({navigation}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchTextInput = useRef(null);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (selectedCategory === 'All') {
      getProductByCategory('All');
    } else {
      getProductByCategory(selectedCategory);
    }
    setRefreshing(false);
  }, [selectedCategory]);
  const {products, page, setPage, getProductByCategory, getProductByMaterial} =
    useProduct();
  console.log(products);
  const handleCategoryPress = category => {
    setSelectedCategory(category.title);
    category.press();
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  const handleSearchSubmit = () => {
    searchTextInput.current.blur();
  };

  const prevPage = () => {
    if (page >= 1) {
      setPage(page - 1);
    } else {
      console.log('Cannot go to prev page:');
    }
  };

  const nextPage = () => {
    setPage(page + 1);
  };
  // {id: 1, name: 'Rings'},.
  // {id: 2, name: 'Earrings'},
  // {id: 3, name: 'Bracelets'},.
  // {id: 4, name: 'Mangalsutra'},
  // {id: 5, name: 'Chains'},.
  // {id: 6, name: 'Necklaces'},.
  const category = [
    {
      title: 'All',
      press: () => {
        setPage(1);
        getProductByCategory('All');
      },
    },
    {
      title: 'Rings',
      press: () => {
        setPage(1);
        getProductByCategory('Rings');
      },
    },
    {
      title: 'Necklaces',
      press: () => {
        setPage(1);
        getProductByCategory('Necklaces');
      },
    },
    {
      title: 'Bracelets',
      press: () => {
        getProductByCategory('Bracelets');
      },
    },
    {
      title: 'Chains',
      press: () => {
        getProductByCategory('Chains');
      },
    },
    {
      title: 'Mangalsutra',
      press: () => {
        getProductByCategory('Mangalsutra');
      },
    },
    {
      title: 'Earrings',
      press: () => {
        getProductByCategory('Earrings');
      },
    },
  ];
  // console.log(products)

  const renderFooter = () => {
    if (products.length > 0) {
      return (
        <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.arrowButton} onPress={prevPage}>
            {page !== 1 && (
              <Icon.ArrowLeft height={25} width={25} stroke={Colors.dark} />
            )}
          </TouchableOpacity>
          <Text style={styles.pageText}>Page {page}</Text>
          <TouchableOpacity style={styles.arrowButton} onPress={nextPage}>
            <Icon.ArrowRight height={25} width={25} stroke={Colors.dark} />
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  };
  useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

  return (
    <KeyboardAvoidingView style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar
        animated={true}
        barStyle={'dark-content'}
        backgroundColor={Colors.primary}
        hidden={false}
      />

      {/* SearchBar */}
      <View
        style={{width: '100%', backgroundColor: Colors.primary}}>
        <View style={{marginBottom: 10, paddingHorizontal: 10, marginTop: 10}}>
          <View style={styles.searchContainer}>
            <Icon.Search height={20} width={20} stroke={Colors.dark} />
            <TextInput
              ref={searchTextInput}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              onSubmitEditing={handleSearchSubmit}
              placeholder="Search"
              placeholderTextColor={'grey'}
              marginHorizontal={10}
              style={styles.searchInput}
            />
            <View style={styles.verticleLine} />
            <TouchableOpacity onPress={() => alert('Option Clicked')} style={{padding:10}}>
              <Icon.Filter height={20} width={20} stroke={Colors.dark} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Screen Options */}
      <View
        style={{
          width: '100%',
          backgroundColor: Colors.primary,
          paddingBottom: 5,
        }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{backgroundColor: 'transparent'}}>
          {category.map(category => (
            <TouchableOpacity
              key={category.title}
              style={[
                styles.categoryContainer,
                selectedCategory === category.title &&
                  styles.selectedCategoryContainer,
              ]}
              onPress={() => handleCategoryPress(category)}>
              <Text
                style={[
                  styles.category,
                  selectedCategory === category.title &&
                    styles.selectedCategory,
                ]}>
                {category.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {/* Item List  */}
      <View style={styles.productListContainer}>
        <FlatList
          style={{width: '100%'}}
          data={products.length > 0 ? products : Array.from({length: 10})}
          renderItem={({item}) =>
            products.length > 0 ? (
              <ItemCard product={item} navigation={navigation} />
            ) : (
              <SkeletonItemCard />
            )
          }
          showsVerticalScrollIndicator={false}
          numColumns={2}
          ListFooterComponent={renderFooter}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
  categoryContainer: {
    backgroundColor: 'white',
    borderRadius: 50,
    margin: 4,
    borderColor: 'black',
    borderWidth: 1,
  },
  selectedCategoryContainer: {
    backgroundColor: Colors.dark,
    borderRadius: 5,
    borderWidth: 2,
  },
  selectedCategory: {
    color: 'white',
    paddingHorizontal: 40,
    fontFamily: 'Poppins-Bold',
  },
  category: {
    color: Colors.dark,
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 13,
    paddingTop: 5,
    paddingBottom: 2,
    paddingHorizontal: 20,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
    width: 'auto',
  },
  productListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  footerContainer: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    backgroundColor: Colors.primary,
    height: 40,
    alignItems: 'center',
    borderRadius: 5,
  },
  arrowButton: {
    margin: 5,
  },
  pageText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.dark,
    fontFamily: 'Poppins-Medium',
  },
});
