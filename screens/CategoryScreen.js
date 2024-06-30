import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Alert,
  Image,
  Modal,
  Button,
  ActivityIndicator
} from 'react-native';
import * as Icon from 'react-native-feather';
import { Colors } from '../color';
import ItemCard from '../components/ItemCard';
import { useProduct } from '../context/productContext';
import SkeletonItemCard from '../components/SkeletonItemCard';
import NetInfo from '@react-native-community/netinfo';

export default function CategoryScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const searchTextInput = useRef(null);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [loading, setLoading] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (selectedCategory === 'All') {
      getProductByCategoryWithLoading("All");
    } else {
      getProductByCategoryWithLoading(selectedCategory);
    }
    setRefreshing(false);
  }, [selectedCategory]);

  const { products, page, setPage, getProductByCategory, getProductByMaterial, fetchProducts } = useProduct();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      console.log(state.type);
      console.log(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

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

  const fetchProductsWithLoading = async () => {
    setLoading(true);
    await fetchProducts();
    setLoading(false);
  };

  const getProductByCategoryWithLoading = async (category) => {
    setLoading(true);
    await getProductByCategory(category);
    setLoading(false);
  };

  const getProductByMaterialWithLoading = async (material) => {
    setLoading(true);
    await getProductByMaterial(material);
    setLoading(false);
  };

  const category = [
    {
      title: 'All',
      press: () => {
        setPage(1);
        fetchProductsWithLoading();
      },
    },
    {
      title: 'Rings',
      press: () => {
        setPage(1);
        getProductByCategoryWithLoading('Rings'||'Ring');
      },
    },
    {
      title: 'Necklaces',
      press: () => {
        setPage(1);
        getProductByCategoryWithLoading('Necklaces');
      },
    },
    {
      title: 'Bracelets',
      press: () => {
        getProductByCategoryWithLoading('Bracelets');
      },
    },
    {
      title: 'Chains',
      press: () => {
        getProductByCategoryWithLoading('Chains');
      },
    },
    {
      title: 'Mangalsutra',
      press: () => {
        getProductByCategoryWithLoading('Mangalsutra');
      },
    },
    {
      title: 'Earrings',
      press: () => {
        getProductByCategoryWithLoading('Earrings');
      },
    },
  ];

  const renderFooter = () => {
    if (products.length > 9) {
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar
        animated={true}
        barStyle={isConnected ? 'dark-content' : 'light-content'}
        backgroundColor={isConnected ? Colors.primary : '#F50057'}
        hidden={false}
      />

      {isConnected ? (
        <>
          {/* SearchBar */}
          <View style={{ width: '100%', backgroundColor: Colors.primary }}>
            <View style={{ marginBottom: 10, paddingHorizontal: 10, marginTop: 10 }}>
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
                <TouchableOpacity onPress={showModal} style={{ padding: 10 }}>
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
              style={{ backgroundColor: 'transparent', paddingLeft: 10, paddingRight: 20, width: '100%' }}>
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

          {/* Item List */}
          <View style={styles.productListContainer}>
            {loading ? (
              <ActivityIndicator size="large"  color={Colors.dark} />
            ) : (
              <FlatList
                style={{ width: '100%' }}
                data={products.length > 0 ? products : Array.from({ length: 6 })}
                renderItem={({ item }) =>
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
                contentContainerStyle={[{ width: '100%' }]}
              />
            )}
          </View>
        </>
      ) : (
        <View style={styles.noInternetContainer}>
          <Image source={require('../TestImages/nointernet.png')} style={styles.noInternetImage} />
          <Text style={styles.noInternetText}>Please Check Your Internet Connection</Text>
          <Text style={styles.noInternetSubText}>Make sure you are connected to a stable network and try again.</Text>
        </View>
      )}

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={hideModal}>
        <View style={[styles.modalContainer, styles.shadow]}>
          <TouchableOpacity style={styles.modelCloseButton}>
            <Icon.X stroke={'white'} width={25} height={25} onPress={hideModal} />
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>

          </View>
        </View>
      </Modal>
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
    marginHorizontal: 2,
    marginVertical: 2,
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
  modalContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    bottom: 0,
    position: 'absolute',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modelCloseButton: {
    position: 'absolute',
    top: 5,
    left: 5,
    height: 40,
    width: 40,
    backgroundColor: Colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});
