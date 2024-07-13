import React, {useState, useEffect} from 'react';
import {RadioButton} from 'react-native-paper';
import API from '../api/axios.config';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import {Colors} from '../color';
import * as Icon from 'react-native-feather';
import StepIndicator from 'react-native-step-indicator';
import {useNavigation} from '@react-navigation/native';
import ItemBox from '../components/ItemBox';
import {useCart} from '../context/cartContext';
import {useUser} from '../context/userContext';
// import { useFonts } from 'expo-font';
import RazorpayCheckout from 'react-native-razorpay';
import orderService from '../services/order.service';
import {useToast} from 'react-native-toast-notifications';

const labels = ['Cart', 'Delivery', 'Payment'];
const count = [1, 2, 3, 4, 5, 6];
export default function CartScreen({navigation,route}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [checked, setChecked] = useState('first');
  const {cartData, cartTotal, cartSubTotal, setCartData} = useCart();
  const [selectedId, setSelectedId] = useState();
  const [paycheck, setPayCheck] = useState();
  const shipping = 50;
  const [isProcessing, setIsProcessing] = useState(false);
  const {userData} = useUser();
  const [fromOrder, setFromOrder] = useState(false);

  useEffect(() => {
    if (route?.params?.fromOrder) {
      setFromOrder(true);
    } else {
      setFromOrder(false);
    }
  }, [route]);
  // RazorpayCheckout.setApiKey('rzp_test_Cta71iRSfU5Jmj');
  const items = cartData.items;
  // console.log(userData)
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
        fontFamily:'Poppins-Medium',
      },
      style: {
        backgroundColor: '#fff',
        borderLeftWidth: 10,
        borderLeftColor: 'red',
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
        flexDirection:"row",
        alignItems:'center',
        color:'red',
      },
      renderToast: toastOptions => (
        <View style={toastOptions.style}>
          <Icon.AlertCircle stroke={'red'} width={25} height={25} style={{marginRight:10}}/>
          <Text style={toastOptions.textStyle}>{toastOptions.message}</Text>
        </View>
      ),
    });
  };

  const handlePayment = async () => {
    try {
      console.log('Payment process started.');
      const {fullname, email, address, city, state} = userData;

      const paymentPayload = {
        amount: cartSubTotal * 100,
        email: email,
      };
      const {data} = await API.post('/payment', paymentPayload);
      console.log(data);
      const options = {
        key: 'rzp_test_Cta71iRSfU5Jmj',
        amount: data.amount,
        currency: data.currency,
        name: 'Shringar',
        description: 'Test Transaction',
        order_id: data.id,
        handler: async function (response) {
          try {
            console.log('Payment successful:', response);

            await orderService.createOrder(
              cartSubTotal,
              cartTotal,
              data.id,
              'RAZORPAY',
            );

            setCartData({...cartData, items: []});

            navigation.navigate('Cart', {fromPaymentPage: true});
            console.log('N called');
          } catch (error) {
            showToast('Something went wrong while processing payment');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: fullname,
          email: email,
        },
        notes: {
          address: `${address}, ${city}, ${state}`,
        },
        theme: {
          color: '#3399cc',
        },
      };
      console.log(options);

      RazorpayCheckout.open(options)
        .then(data => {
          console.log('Razorpay Checkout opened.');
          setIsProcessing(true);
        })
        .catch(error => {
          showToast('Something went wrong while processing payment');
          console.log(error)
          setIsProcessing(false);
        });
    } catch (error) {
      showToast('Something went wrong while processing payment');
      console.log(error);
      setIsProcessing(false);
    }
  };

  const handleProceed = () => {
    setCurrentStep(prevStep =>
      prevStep < labels.length - 1 ? prevStep + 1 : prevStep,
    );
  };
  const renderStepIndicator = ({position, stepStatus}) => {
    const isCurrentStep = stepStatus === 'current';
    const isFinishedStep = stepStatus === 'finished';
    const icons = [
      <Icon.ShoppingCart
        stroke={isCurrentStep || isFinishedStep ? '#ffffff' : Colors.dark}
        width={20}
        height={20}
        style={{marginRight: 3}}
      />,
      <Icon.Truck
        stroke={isCurrentStep || isFinishedStep ? '#ffffff' : Colors.dark}
        width={20}
        height={20}
      />,
      <Icon.CreditCard
        stroke={isCurrentStep || isFinishedStep ? '#ffffff' : Colors.dark}
        width={20}
        height={20}
      />,
    ];
    return icons[position];
  };

  const handleBack = () => {
    if (currentStep === 0) {
      if(fromOrder){
        navigation.jumpTo('Order')
      }else{
        navigation.goBack()
      }
    } else {
      setCurrentStep(prevStep => (prevStep > 0 ? prevStep - 1 : prevStep));
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        animated={true}
        barStyle={'dark-content'}
        backgroundColor={Colors.primary}
        hidden={false}
      />
      <Header
        onBack={handleBack}
        customStyles={customStyles}
        currentPosition={currentStep}
        labels={labels}
        renderStepIndicator={renderStepIndicator}
      />
      {currentStep === 0 && <CarList items={items} />}
      {currentStep === 1 && (
        <DeliveryMethod
          checked={checked}
          setChecked={setChecked}
          cartTotal={cartTotal}
          cartSubTotal={cartSubTotal}
        />
      )}
      {currentStep === 2 && (
        <Payment
          items={items}
          cartTotal={cartTotal}
          cartSubTotal={cartSubTotal}
          setPayCheck={setPayCheck}
          paycheck={paycheck}
          handlePayment={handlePayment}
        />
      )}

      {/* <Payment/> */}

      <InfoModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        cartTotal={cartTotal}
        cartSubTotal={cartSubTotal}
      />
      {items.length > 0 && currentStep !== 2 && (
        <Footer
          proceed={handleProceed}
          setModalVisible={setModalVisible}
          cartTotal={cartSubTotal}
          currentStep={currentStep}
          handlePayment={handlePayment}
        />
      )}
    </View>
  );
}

const Header = ({
  onBack,
  customStyles,
  currentPosition,
  labels,
  renderStepIndicator,
}) => (
  <View style={styles.headerWrapper}>
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onBack}>
        <Icon.ArrowLeft
          width={25}
          height={25}
          stroke={Colors.dark}
          style={[styles.headerIcon, {marginLeft: 20}]}
        />
      </TouchableOpacity>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon.ShoppingCart
          width={25}
          height={25}
          stroke={Colors.dark}
          style={[styles.headerIcon, {marginEnd: 10}]}
        />
        <Text style={styles.header}>Cart</Text>
      </View>
    </View>
    <View style={styles.stepIndicatorContainer}>
      <StepIndicator
        customStyles={customStyles}
        currentPosition={currentPosition}
        labels={labels}
        stepCount={labels.length}
        direction="horizontal"
        renderStepIndicator={renderStepIndicator}
      />
    </View>
  </View>
);

const CarList = ({items}) => {
  return (
    <>
      {items.length > 0 ? (
        <FlatList
          data={items}
          renderItem={({item}) => <ItemBox item={item} showRemove={false} />}
          contentContainerStyle={styles.itemList}
        />
      ) : (
        <View
          style={{flex: 0.7, justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={require('../TestImages/undraw_empty_cart_co35.png')}
            style={styles.emptyCartImage}
            resizeMode="cover"
          />
          <Text style={styles.emptyCartText}>Cart is empty</Text>
        </View>
      )}
    </>
  );
};
const DeliveryMethod = ({checked, setChecked}) => {
  return (
    <View style={styles.deliveryContainer}>
      {/* Method Choose */}
      <Text style={styles.deliveryHeaderText}>Choose the Delivery Method</Text>
      <View style={styles.innerRadioContainer}>
        <TouchableOpacity
          style={[styles.singleBox, {justifyContent: 'center'}]}
          onPress={() => setChecked('second')}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View style={styles.radioIcon}>
              <RadioButton
                value="second"
                status={checked === 'second' ? 'checked' : 'unchecked'}
                color={Colors.dark}
                uncheckedColor={Colors.dark}
              />
            </View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.singleBoxHeaderText}>Call and Collect</Text>
              <Text style={styles.singleBoxBodyText} numberOfLines={1}>
                {' '}
                Collect your package from our store.{' '}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.singleBox, {justifyContent: 'center'}]}
          onPress={() => setChecked('first')}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View style={styles.radioIcon}>
              <RadioButton
                value="first"
                status={checked === 'first' ? 'checked' : 'unchecked'}
                color={Colors.dark}
                uncheckedColor={Colors.dark}
              />
            </View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.singleBoxHeaderText}>Home Delivery</Text>
              <Text
                style={[styles.singleBoxBodyText, {width: '90%'}]}
                numberOfLines={2}>
                Package would be delivered to your address.
              </Text>
            </View>
            <View>
              <TouchableOpacity>
                <Text>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Delivery Address     */}

      <Text style={[styles.deliveryHeaderText, {paddingTop: 10}]}>
        Delivery Address
      </Text>
      <View
        style={[
          styles.singleBox,
          {flexDirection: 'row', alignItems: 'center'},
        ]}>
        <View style={styles.radioIcon}>
          <Icon.Home stroke={Colors.dark} width={25} height={25} />
        </View>
        <View style={{justifyContent: 'center'}}>
          <Text
            numberOfLines={3}
            style={[
              {
                width: '60%',
                paddingVertical: 10,
              },
              styles.singleBoxBodyText,
            ]}>
            456 Banyan Road, MG Road Area, Bangalore, Karnataka 560001 India
          </Text>
        </View>
      </View>
    </View>
  );
};

const Payment = ({
  items,
  cartSubTotal,
  cartTotal,
  paycheck,
  setPayCheck,
  handlePayment,
}) => {
  return (
    <View style={{width: '100%', paddingHorizontal: 5, flex: 1}}>
      <FlatList
        data={items}
        renderItem={({item}) => (
          <ItemBox item={item} showRemove={false} showQuantity={true} />
        )}
        contentContainerStyle={[styles.itemList, {paddingVertical: 10}]}
        ListHeaderComponent={<PaymentHeader />}
        ListFooterComponent={
          <PaymentFooter
            handlePayment={handlePayment}
            paycheck={paycheck}
            setPayCheck={setPayCheck}
            cartSubTotal={cartSubTotal}
            cartTotal={cartTotal}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
const PaymentHeader = () => {
  return (
    <View style={styles.paymentHeaderContainer}>
      <Text style={styles.paymentHeaderText}>Order Summary</Text>

      <View style={styles.divider} />
    </View>
  );
};

const PaymentFooter = ({
  paycheck,
  setPayCheck,
  cartTotal,
  cartSubTotal,
  handlePayment,
}) => {
  return (
    <View>
      <View style={styles.divider} />
      <Text style={styles.paymentHeader}>Price BreakUp</Text>
      <DetailCard cartSubTotal={cartSubTotal} cartTotal={cartTotal} />
      <View style={styles.divider} />
      <View style={{alignSelf: 'flex-end'}}>
        <TouchableOpacity
          style={[
            styles.paymentProceedButton,
            {
              width: 140,
              alignItems: 'center',
              flexDirection: 'row',
              borderRadius: 5,
              marginEnd: 10,
              marginTop: 10,
            },
          ]}
          onPress={()=>{
            handlePayment()
          }}
          >
          <Icon.CreditCard stroke={'white'} height={25} width={25} />
          <Text style={styles.paymentProceedButtonText}> Pay </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const DetailCard = ({cartTotal, cartSubTotal}) => {
  return (
    <View style={styles.detailCard}>
      <View style={styles.detailRows}>
        <Text style={styles.leftText}>Items</Text>
        <Text style={styles.rightText}>{cartTotal}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.detailRows}>
        <Text style={styles.leftText}>Shipping Charge</Text>
        <Text style={styles.rightText}>50</Text>
      </View>
      <View style={styles.divider} />

      <View style={styles.detailRows}>
        <Text style={styles.leftText}>SubTotal</Text>
        <Text style={styles.rightText}>{cartSubTotal}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.detailRows}>
        <Text style={styles.leftText}>Total</Text>
        <Text
          style={[
            styles.rightText,
            {fontSize: 25, fontFamily: 'Poppins-Bold'},
          ]}>
          ₹{cartSubTotal + 50}
        </Text>
      </View>
    </View>
  );
};

const InfoModal = ({
  modalVisible,
  setModalVisible,
  cartTotal,
  cartSubTotal,
}) => (
  <Modal
    animationType="slide"
    visible={modalVisible}
    onRequestClose={() => {
      setModalVisible(!modalVisible);
    }}
    transparent={true}
    presentationStyle="overFullScreen">
    <View style={styles.modalContent}>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => setModalVisible(!modalVisible)}
          style={{
            height: 40,
            width: 40,
            borderRadius: 50,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <Icon.X stroke={Colors.dark} width={25} height={25} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 24,
            marginBottom: 8,
            marginRight: 20,
            color: 'white',
            alignSelf: 'center',
            fontFamily: 'Poppins-Bold',
          }}>
          Detail
        </Text>
      </View>
      <DetailCard cartTotal={cartTotal} cartSubTotal={cartSubTotal} />
    </View>
  </Modal>
);

const Footer = ({proceed, setModalVisible, cartTotal, currentStep}) => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>Total</Text>
    <View style={styles.footerContent}>
      <Text style={styles.paymentTotalText}>₹{cartTotal}</Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity style={{padding: 5}}>
          <Icon.Info
            stroke={Colors.dark}
            height={25}
            width={25}
            style={{alignSelf: 'flex'}}
            onPress={() => setModalVisible(true)}
          />
        </TouchableOpacity>
        {currentStep === 0 && (
          <TouchableOpacity
            style={styles.paymentProceedButton}
            onPress={proceed}>
            <Text style={styles.paymentProceedButtonText}>Continue</Text>
          </TouchableOpacity>
        )}
        {currentStep === 1 && (
          <TouchableOpacity
            style={styles.paymentProceedButton}
            onPress={proceed}>
            <Text style={styles.paymentProceedButtonText}>Continue</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  </View>
);

const customStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 3,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: Colors.dark,
  stepStrokeWidth: 2,
  stepStrokeFinishedColor: Colors.dark,
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: Colors.dark,
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: Colors.dark,
  stepIndicatorUnFinishedColor: 'white',
  stepIndicatorCurrentColor: Colors.dark,
  stepIndicatorLabelFontSize: 10,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#ffffff',
  stepIndicatorLabelFinishedColor: Colors.dark,
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: Colors.dark,
  labelSize: 12,
  labelFontFamily: 'Poppins-Medium',
  currentStepLabelColor: Colors.dark,
  separatorWidth: 40,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  headerWrapper: {
    width: '100%',
  },
  headerContainer: {
    height: 50,
    flexDirection: 'row',
    marginBottom: 15,
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIcon: {
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 8,
    marginRight: 20,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.dark,
  },
  stepIndicatorContainer: {
    width: '100%',
    padding: 20,
  },
  footer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderColor: 'grey',
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
    paddingTop: 5,
    paddingBottom: 10,
    backgroundColor: 'white',
  },
  footerText: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.dark,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentTotalText: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.dark,
  },
  paymentProceedButton: {
    backgroundColor: Colors.dark,
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 4,
    marginRight: 1,
  },
  paymentProceedButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  itemList: {
    width: '100%',
    paddingBottom: 80,
  },
  detailCard: {
    width: '95%',
    borderColor: Colors.dark,
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 5,
    backgroundColor: 'white',
    shadowColor: Colors.dark,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 10,
    shadowRadius: 4,
    elevation: 6,
    alignSelf: 'center',
    borderWidth: 0.1,
  },
  detailText: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Colors.dark,
  },
  detailRows: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 2,
  },
  leftText: {
    flex: 1,
    textAlign: 'left',
    paddingHorizontal: 10,
    marginVertical: 1,
    fontWeight: '300',
    fontFamily: 'Poppins-Medium',
    color: Colors.dark,
  },
  rightText: {
    flex: 1,
    textAlign: 'right',
    paddingHorizontal: 10,
    marginVertical: 1,
    color: Colors.dark,
    fontFamily: 'Poppins-Medium',
  },
  modalContent: {
    backgroundColor: Colors.dark,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    shadowColor: Colors.dark,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 10,
    shadowRadius: 4,
    elevation: 6,
  },
  deliveryContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  deliveryHeaderText: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: '500',
    alignSelf: 'center',
    fontFamily: 'Poppins-SemiBold',
    color: Colors.dark,
  },
  radioButtonContainer: {
    width: '100%',
    columnGap: 5,
    alignItems: 'center',
  },
  radioBox: {
    width: '100%',
    backgroundColor: 'red',
  },
  innerRadioContainer: {
    alignSelf: 'stretch',
    marginTop: 20,
  },
  singleBox: {
    height: 100,
    borderWidth: 1,
    marginTop: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 5,
  },
  singleBoxHeaderText: {
    fontSize: 17,
    paddingTop: 20,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.dark,
  },
  singleBoxBodyText: {
    paddingBottom: 20,
    marginTop: 5,
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.dark,
  },
  radioIcon: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  emptyCartText: {
    fontSize: 20,
    paddingBottom: 10,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.dark,
  },
  emptyCartImage: {
    height: 200,
    width: 200,
  },
  paymentContainer: {
    padding: 10,
    marginVertical: 10,
  },
  paymentHeader: {
    alignSelf: 'flex-start',
    fontFamily: 'Poppins-SemiBold',
    color: Colors.dark,
    fontSize: 16,
    alignSelf: 'center',
  },
  singleBoxPayment: {
    height: 50,
    borderWidth: 1,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 5,
    marginVertical: 4,
    justifyContent: 'center',
  },
  singleBoxPaymentBodyText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    alignSelf: 'center',
  },
  paymentHeaderContainer: {
    padding: 5,
    marginBottom: 10,
  },
  paymentHeaderText: {
    alignSelf: 'center',
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    paddingBottom: 10,
    color: Colors.dark,
  },
  divider: {
    borderBottomColor: 'gray',
    borderBottomWidth: 0,
    width: '100%',
    marginVertical: 1,
    borderColor: Colors.dark,
  },
});
