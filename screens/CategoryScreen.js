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
  Alert,
  Image,
  Modal,
  Button,
  ActivityIndicator,
  Switch,
  Keyboard
} from 'react-native';
import * as Icon from 'react-native-feather';
import {Colors} from '../color';
import ItemCard from '../components/ItemCard';
import {useProduct} from '../context/productContext';
import SkeletonItemCard from '../components/SkeletonItemCard';
import NetInfo from '@react-native-community/netinfo';
import * as Animatable from 'react-native-animatable';
import Slider from '@react-native-community/slider';

export default function CategoryScreen({navigation}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const searchTextInput = useRef(null);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [loading, setLoading] = useState(false);
  const [layout, changeLayout] = useState(false);
  const [sliderValue, setSliderValue] = useState(500000);
  const [minPriceFocused, setMinPriceFocused] = useState(false);
  const [maxPriceFocused, setMaxPriceFocused] = useState(false);
  
  const [selectedFilter, setSelectedFilter] = useState([-1]);
  const [minPriceValue, setMinPriceValue] = useState(0);
  const [maxPriceValue, setMaxPriceValue] = useState(1000000);
  // const minSliderValue = 0;
  // const maxSliderValue = 1000000;

  const [showCategoryFiler,setShowCategoryFiler] = useState(true);
  const [showPriceFiler,setShowPriceFiler] = useState(true);
  const [showCustomPriceFiler,setShowCustomPriceFiler] = useState(false);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);


  const handleCheckboxToggle = () => {
    setChecked(!checked);
  };
  const handlePriceRangeSelection = (range) => {
    setSelectedFilter(prevSelectedFilter => {
      let newSelectedFilter = [...prevSelectedFilter];
  
      if (newSelectedFilter.includes(range.id)) {
        newSelectedFilter = newSelectedFilter.filter(id => id !== range.id);
      } else {
        if (range.id === -1) {
          newSelectedFilter = [-1];
        } else {
          newSelectedFilter = newSelectedFilter.filter(id => id !== -1);
          newSelectedFilter.push(range.id);
        }
      }
  
      return newSelectedFilter.length > 0 ? newSelectedFilter : [-1];
    });
  };
  
  console.log(selectedFilter)
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (selectedCategory === 'All') {
      getProductByCategoryWithLoading('All');
    } else {
      getProductByCategoryWithLoading(selectedCategory);
    }
    setRefreshing(false);
  }, [selectedCategory]);

  const handleFilterApply = () => {};

  const {
    products,
    page,
    setPage,
    getProductByCategory,
    getProductByMaterial,
    fetchProducts,
  } = useProduct();

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

  const getProductByCategoryWithLoading = async category => {
    setSelectedCategory(category);
    setLoading(true);
    await getProductByCategory(category);
    setLoading(false);
  };

  const getProductByMaterialWithLoading = async material => {
    setLoading(true);
    await getProductByMaterial(material);
    setLoading(false);
  };

  const categories = [
    {
      title: 'All',
      url: 'https://akm-img-a-in.tosshub.com/indiatoday/images/story/202206/nayanthara_wedding_jewellery.jpg?VersionId=.hius1F_jGy0dZEH7qSQ67cnWcXTQQfA',
      press: () => {
        setPage(1);
        setSelectedCategory('All');
        fetchProductsWithLoading();
      },
    },
    {
      title: 'Rings',
      url: 'https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dwfc4fb974/homepage/shopByCategory/fod-rings.jpg',
      press: () => {
        setPage(1);
        getProductByCategoryWithLoading('Rings' || 'Ring');
      },
    },
    {
      title: 'Necklaces',
      url: 'https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dwb8086cf2/homepage/shopByCategory/fod-necklace.jpg',
      press: () => {
        setPage(1);
        getProductByCategoryWithLoading('Necklaces');
      },
    },
    {
      title: 'Bracelets',
      url: 'https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw4dcf3d1d/homepage/shopByCategory/fod-bracelet.jpg',
      press: () => {
        getProductByCategoryWithLoading('Bracelets');
      },
    },
    {
      title: 'Chains',
      url: 'https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dwcbb3ebbb/homepage/shopByCategory/fod-chain.jpg',
      press: () => {
        getProductByCategoryWithLoading('Chains');
      },
    },
    {
      title: 'Mangalsutra',
      url: 'https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw114df9d7/homepage/shopByCategory/fod-mangalsutra.jpg',
      press: () => {
        getProductByCategoryWithLoading('Mangalsutra');
      },
    },
    {
      title: 'Earrings',
      url: 'https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw47b1df4b/homepage/shopByCategory/fod-earrings.jpg',
      press: () => {
        getProductByCategoryWithLoading('Earrings');
      },
    },
    {
      title: 'Bangles',
      url: 'https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw7dbdbacf/homepage/shopByCategory/fod-bangle.jpg',
      press: () => {
        getProductByCategoryWithLoading('Bangles');
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

  const priceRangeType = [
    {
      id: 1,
      title: 'Below 10k',
      low: 0,
      high: 10000,
    },
    {
      id: 2,
      title: 'Between 10k-25k',
      low: 10000,
      high: 25000,
    },
    {
      id: 3,
      title: 'Between 25k-50k',
      low: 25000,
      high: 50000,
    },
    {
      id: 4,
      title: 'Between 50k-100k',
      low: 50000,
      high: 100000,
    },
    {
      id: 5,
      title: '100k and Above',
      low: 100000,
      high: 1000000,
    },
    {
      id: -1,
      title: 'Default',
      low: 0,
      high: 1000000,
    },
  ];

  const Category = ({title, url, press, isSelected}) => {
    return (
      <TouchableOpacity
        style={[
          styles.categoryContainer,
          isSelected && styles.selectedCategoryContainer,
        ]}
        onPress={press}>
        <Image
          src={url}
          style={[
            styles.categoryImage,
            isSelected && styles.selectedCategoryImage,
          ]}
          resizeMode="cover"
        />
        <Text
          style={[
            styles.categoryText,
            isSelected && styles.selectedCategoryText,
          ]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };
  const ModalSubHeading = ({ text, onPress }) => {
    return (
      <TouchableOpacity style={{alignSelf:'flex-start'}} onPress={onPress}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            // paddingHorizontal: 5,
          }}
        >
          <Icon.Minus
            stroke={'grey'}
            width={20}
            height={20}
            strokeWidth={3}
            style={{ marginRight: 5 }}
          />
          <Text style={styles.subHeader}>{text}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <KeyboardAvoidingView style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar
        animated={true}
        barStyle={isConnected ? 'dark-content' : 'light-content'}
        backgroundColor={isConnected ? Colors.primary : '#F50057'}
        hidden={false}
      />
      {isConnected ? (
        <>
          <View
            style={{
              backgroundColor: 'white ',
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}></View>
          {/* SearchBar */}
          <View
            style={{
              width: '100%',
              backgroundColor: Colors.primary,
            }}>
            <View style={{paddingHorizontal: 10, marginTop: 10}}>
              <View style={styles.searchContainer}>
                <Icon.Search
                  style={{marginHorizontal: 2}}
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
                  placeholder="Search"
                  placeholderTextColor={'grey'}
                  marginHorizontal={10}
                  style={styles.searchInput}
                  // backgroundColor={'red'}
                />
                <View style={styles.verticleLine} />
                <TouchableOpacity onPress={showModal} style={{padding: 10}}>
                  <Icon.Filter height={20} width={20} stroke={Colors.dark} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Categories */}
          <View
            style={{
              backgroundColor: Colors.primary,
              paddingTop: 10,
              borderBottomLeftRadius: 50,
              borderBottomLeftRadius: 50,
            }}>
            <ScrollView
              horizontal
              contentContainerStyle={{
                paddingHorizontal: 10,
                backgroundColor: Colors.primary,
                paddingBottom: 10,
                borderBottomLeftRadius: 50,
                borderBottomLeftRadius: 50,
              }}
              showsHorizontalScrollIndicator={false}>
              {categories.map((item, index) => (
                <Category
                  key={index}
                  title={item.title}
                  url={item.url}
                  press={item.press}
                  isSelected={selectedCategory === item.title}
                />
              ))}
            </ScrollView>
          </View>
          {/* Item List */}
          <View style={styles.productListContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={Colors.dark} />
            ) : (
              <FlatList
                style={{width: '100%'}}
                data={products.length > 0 ? products : Array.from({length: 6})}
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
                contentContainerStyle={[{width: '100%'}]}
              />
            )}
          </View>
        </>
      ) : (
        <View style={styles.noInternetContainer}>
          <Image
            source={require('../TestImages/nointernet.png')}
            style={styles.noInternetImage}
          />
          <Text style={styles.noInternetText}>
            Please Check Your Internet Connection
          </Text>
          <Text style={styles.noInternetSubText}>
            Make sure you are connected to a stable network and try again.
          </Text>
        </View>
      )}

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={hideModal}>
        <Animatable.View animation={'slideInUp'} style={[styles.modalContainer, styles.shadow]}>
          <TouchableOpacity style={styles.modelCloseButton} onPress={hideModal}>
            <Icon.X stroke={Colors.dark} width={25} height={25} />
          </TouchableOpacity>
          <Icon.Filter
            stroke={Colors.dark}
            width={30}
            height={30}
            style={styles.headerIcon}
          />
          <ScrollView contentContainerStyle={{paddingBottom: 100}}>
            {/* Toggle Layout */}
            <ModalSubHeading text={'Layout'} />
            <View
              style={{
                flexDirection: 'row',
                // alignItems: 'flex-start',
                justifyContent: 'flex-start',
                marginTop: 30,
                paddingLeft: 20,
              }}>
              <Icon.Grid
                style={{marginHorizontal: 10}}
                stroke={'black'}
                width={25}
                height={25}
              />
              <Animatable.Text
                style={[styles.modelBaseText, {marginRight: 20}]}
                animation={layout ? null : 'tada'}
                iterationCount={layout ? 1 : 3}>
                Grid
              </Animatable.Text>
              <Switch
                value={layout}
                onValueChange={value => changeLayout(value)}
                thumbColor={Colors.dark}
                trackColor={{false: Colors.charcoal, true: Colors.charcoal}}
              />
              <Animatable.Text
                style={[styles.modelBaseText, {marginLeft: 20}]}
                animation={layout ? 'tada' : null}
                iterationCount={layout ? 3 : 1}>
                List
              </Animatable.Text>
              <Icon.List
                style={{marginHorizontal: 10}}
                stroke={'black'}
                width={25}
                height={25}
                strokeWidth={3}
              />
            </View>

            {/* categories */}
            <Animatable.View
              delay={100}
              animation={'fadeInRight'}
              style={{
                width: '100%',
                alignItems: 'center',
                marginTop: 30,
                flexWrap: 'wrap',
              }}>
              <ModalSubHeading text={'Category'} onPress={()=>setShowCategoryFiler(!showCategoryFiler)}/>
              {showCategoryFiler && (
                <View
                style={{
                  width: '100%', 
                  alignItems: 'flex-start',
                  marginTop: 10,
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                }}>
                {categories.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleCategoryPress(item)}>
                    <Animatable.View
                      animation={
                        item.title === selectedCategory ? 'tada' : null
                      }
                      delay={1000}
                      iterationCount={item.title === selectedCategory ? 1 : 1}
                      style={[
                        styles.priceButton,
                        {paddingHorizontal: 10},
                        item.title === selectedCategory &&
                          styles.selectedPriceButton,
                      ]}>
                      <Text
                        style={[
                          styles.modelBaseText,
                          item.title === selectedCategory &&
                            styles.selectedPriceText,
                          {
                            color:
                              item.title === selectedCategory
                                ? 'white'
                                : 'grey',
                          },
                        ]}>
                        {item.title}
                      </Text>
                    </Animatable.View>
                  </TouchableOpacity>
                ))}
              </View>
              )}
            </Animatable.View>

            {/* Price Filter */}
            <Animatable.View
              animation={'fadeInRight'}
              delay={100}
              style={{
                width: '100%',
                alignItems: 'center',
                marginTop: 30,
                flexWrap: 'wrap',
              }}>
              <ModalSubHeading text={'Price'} onPress={()=> setShowPriceFiler(!showPriceFiler)}/>
              {showPriceFiler && (
                <View
                style={{
                  width: '100%',
                  alignItems: 'flex-start',
                  marginTop: 10,
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                  // padding:4
                }}>
                {priceRangeType.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handlePriceRangeSelection(item)}>
                    <Animatable.View
                    animation={selectedFilter.includes(item.id) ? 'bounceIn' : null}
                      style={[
                        styles.priceButton,{paddingHorizontal: 10},
                        selectedFilter.includes(item.id) &&
                          styles.selectedPriceButton,
                      ]}>
                      <Text
                        style={[
                          styles.modelBaseText,
                          selectedFilter.includes(item.id) &&
                            styles.selectedPriceText,
                          {
                            color: selectedFilter.includes(item.id)
                              ? 'white'
                              : 'grey',
                          },
                        ]}>
                        {item.title}
                      </Text>
                    </Animatable.View>
                  </TouchableOpacity>
                ))}
              </View>
              )}
            </Animatable.View>

            {/* Custom Range */}
            <Animatable.View
              delay={100}
              animation={'fadeInRight'}
              style={{width: '100%', alignItems: 'center', marginTop: 30}}>
              <ModalSubHeading text={'Custom Range'} onPress={()=>setShowCustomPriceFiler(!showCustomPriceFiler)}/>
              {showCustomPriceFiler && (
                <View style={{width:'100%',alignItems:'center',marginTop:30}}>
                  <Slider
                style={{width: '96%'}}
                minimumValue={minPriceValue}
                maximumValue={maxPriceValue}
                minimumTrackTintColor={Colors.primaryL}
                maximumTrackTintColor={Colors.charcoal}
                thumbTintColor={Colors.dark}
                value={sliderValue}
                onSlidingStart={value => {
                  setSliderValue(value)
                  setSelectedFilter([-1])
                }}
                onSlidingComplete={value => setSliderValue(value)}
              />
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 5,
                  marginTop: 20,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}>
                <TextInput
                  placeholder="₹Price"
                  value={String(minPriceValue)}
                  style={[
                    styles.sliderInput,
                    styles.sliderText,
                    minPriceFocused && {
                      borderColor: Colors.primaryL,
                      borderWidth: 1,
                    },
                  ]}
                  placeholderTextColor={Colors.charcoal}
                  keyboardType="number-pad"
                  onFocus={() => setMinPriceFocused(true)}
                  onBlur={() => setMinPriceFocused(false)}
                />
                <Text style={styles.sliderText}>To</Text>
                <TextInput
                  placeholder="₹Price"
                  keyboardType="number-pad"
                  textContentType="telephoneNumber"
                  placeholderTextColor={Colors.charcoal}
                  value={String(sliderValue)}
                  onChangeText={text => setSliderValue(Number(text))}
                  style={[
                    styles.sliderInput,
                    styles.sliderText,
                    maxPriceFocused && {borderColor: Colors.primaryL},
                  ]}
                  onFocus={() => setMaxPriceFocused(true)}
                  onBlur={() => setMaxPriceFocused(false)}
                />
              </View>
                </View>
              )}
            </Animatable.View>
          </ScrollView>
          {!isKeyboardVisible && (
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>
      )}
        </Animatable.View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    fontSize: 24,
    marginBottom: 8,
    alignSelf: 'flex-start',
    color: Colors.dark,
    fontFamily: 'Poppins-Medium',
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
  categoryContainer: {
    height: 100,
    width: 90,
    // backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 5,
    marginVertical: 1,
    borderColor: 'black',
    // borderWidth: 0.3,
    alignItems: 'center',
    paddingTop: 5,
    borderColor: Colors.charcoal,
  },
  categoryImage: {
    height: 75,
    width: 75,
    borderRadius: 20,
  },
  selectedCategoryContainer: {
    backgroundColor: 'white',
    borderWidth: 0.7,
    borderColor: Colors.e_orange,
  },
  selectedCategoryText: {
    // color: 'white',
    fontFamily: 'Poppins-Bold',
  },
  selectedCategoryImage: {
    borderRadius: 4,
  },
  categoryText: {
    color: Colors.dark,
    textAlign: 'center',
    fontSize: 13,
    paddingTop: 2,
    paddingBottom: 2,
    fontFamily: 'Poppins-Medium',
    width: 'auto',
    marginTop: -2,
  },
  productListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    alignSelf: 'center',
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
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    // bottom: 0,
    // position: 'absolute',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderWidth: 0.3,
    paddingTop: 60,
  },
  modelCloseButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    height: 40,
    width: 40,
    padding: 4,
    borderBottomRightRadius: 50,
    borderTopLeftRadius: 15,
  },
  headerIcon: {
    position: 'absolute',
    top: 20,
    alignSelf: 'flex-end',
    right: 20,
  },
  modelBaseText: {
    color: 'grey',
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
  },
  sliderText: {
    color: Colors.dark,
    fontFamily: 'Poppins-SemiBold',
  },
  sliderInput: {
    width: 120,
    borderWidth: 2,
    borderRadius: 5,
    marginHorizontal: 5,
    borderColor: Colors.charcoal,
    color: Colors.dark,
    paddingHorizontal: 10,
  },
  subHeader: {
    fontSize: 20,
    color: 'grey',
    fontFamily: 'Poppins-SemiBold',
    textTransform: 'capitalize',
  },
  priceButton: {
    paddingVertical:6,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'grey',
    marginVertical: 2,
    marginHorizontal: 2,
  },
  selectedPriceButton: {
    borderRadius: 2,
    backgroundColor: Colors.dark,
  },
  selectedPriceText: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
  },
  applyButton: {
    width: 250,
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: 5,
    borderWidth: 0.3,
    alignSelf: 'center',
    justifyContent: 'center',
    position:'absolute',
    bottom:20
  },
  applyText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.dark,
    textAlign: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});
