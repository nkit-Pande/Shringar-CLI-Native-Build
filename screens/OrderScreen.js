import React, {useState, useEffect} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
  Image,
  TouchableHighlight,
} from 'react-native';
import OrderCard from '../components/OrderCard';
import * as Icon from 'react-native-feather';
import {Colors} from '../color';
import {useOrders} from '../context/orderContext';
import orderService from '../services/order.service';
import * as Animatable from 'react-native-animatable';

export default function OrderScreen({navigation}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const {orders, setOrders} = useOrders();
  const [selectedOrder, setSelectedOrder] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setLoading(true);
    orderService.getAll(currentPage).then(res => {
      setOrders(res.data);
      setLoading(false);
    });
  }, [currentPage, setOrders]);
  console.log(selectedOrder);
  const RenderOrderProducts = ({products}) => {
    return (
      <FlatList
        data={products}
        renderItem={({item}) => (
          <Animatable.View animation={'slideInLeft'} delay={100} style={[styles.productItemContainer, styles.shadow]}>
            <Image
              source={
                item.product_image_url
                  ? {uri: item.product_image_url}
                  : require('../TestImages/dummy.jpg')
              }
              resizeMode="cover"
              style={styles.productItemImage}
            />
            <View style={{marginHorizontal: 10}}>
              <Text style={styles.productItemText}>{item.product_name}</Text>
              <Text style={[styles.productItemText, {color: 'grey'}]}>
                ₹{item.product_price}
              </Text>
              <Text style={[styles.productItemText, {color: 'grey'}]}>
                Quantity:{item.quantity}
              </Text>
            </View>
          </Animatable.View>
        )}
        ListHeaderComponent={<ModalHeader />}
        contentContainerStyle={{
          width: '100%',
        }}
        ListFooterComponent={<ModalFooter />}
      />
    );
  };

  const Header = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon.ShoppingBag
            stroke={Colors.dark}
            height={25}
            width={25}
            style={{}}
          />
          <Text style={styles.headerText}>Order</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Cart', {fromOrder: true})}>
          <Icon.ShoppingCart
            stroke={Colors.dark}
            height={25}
            width={25}
            strokeWidth={2}
            style={{
              alignSelf: 'flex-end',
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const ModalHeader = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 10,
            alignItems: 'center',
          }}>
          <Icon.Info height={25} width={25} stroke={Colors.dark} />
          <Text style={styles.modalHeaderText}>Details</Text>
        </View>
        <View style={{paddingHorizontal: 20}}>
          <Text style={[styles.productItemText, {fontSize: 20}]}>
            Status :
            <Text
              style={{fontFamily: 'Poppins-Bold',textTransform: 'capitalize',color: getStatusColor(selectedOrder.status)}}>
              {selectedOrder.status}
            </Text>
          </Text>
        </View>
      </View>
    );
  };

  const calculateTotalPrice = (products) => {
    return products.reduce((total, product) => total + product.product_price * product.quantity, 0);
  };

  const ModalFooter = () => {
    const totalPrice = calculateTotalPrice(selectedOrder.products || []);
    
    return (
      <Animatable.View animation={'fadeInUp'} delay={100} style={styles.modalFooterContainer}>
        <Text style={styles.modalFooterHeaderText}>Transaction Details</Text>
        <View style={styles.divider} />
        <View style={styles.modalFooterRow}>
          <Text style={styles.modalFooterText}>Name :</Text>
          <Text style={styles.modalFooterText}>{selectedOrder.user_fullname}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.modalFooterRow}>
          <Text style={styles.modalFooterText}>Email :</Text>
          <Text style={styles.modalFooterText}>{selectedOrder.user_email}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.modalFooterRow}>
          <Text style={styles.modalFooterText}>OrderID :</Text>
          <Text style={styles.modalFooterText}>{selectedOrder.order_id}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.modalFooterRow}>
          <Text style={styles.modalFooterText}>Date :</Text>
          <Text style={styles.modalFooterText}>{selectedOrder.date}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.modalFooterRow}>
          <Text style={styles.modalFooterText}>Payment Method :</Text>
          <Text style={styles.modalFooterText}>{selectedOrder.payment_method}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.modalFooterRow}>
          <Text style={styles.modalFooterText}>Ref :</Text>
          <Text style={styles.modalFooterText}>{selectedOrder.ref}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.modalFooterRow}>
          <Text style={styles.modalFooterText}>Total Price :</Text>
          <Text style={[styles.modalFooterText,{fontSize:25,color:'grey',fontFamily:'Poppins-Bold'}]}>₹{totalPrice}</Text>
        </View>
      </Animatable.View>
    );
  };
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return Colors.warning;
      case 'in transit':
        return Colors.info;
      case 'complete':
        return Colors.success;
      case 'cancelled':
        return Colors.danger;
      default:
        return Colors.dark;
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.dark}
          style={styles.activityIndicator}
        />
      ) : (
        <>
          <FlatList
            data={orders}
            renderItem={({item}) => (
              <TouchableHighlight
                underlayColor={'white'}
                onPress={() => {
                  setSelectedOrder(item);
                  setModalVisible(true);
                }}>
                <OrderCard item={item} />
              </TouchableHighlight>
            )}
            contentContainerStyle={styles.contentStyle}
          />
          <Modal
            animationType="slide"
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
              setSelectedOrder({});
            }}>
            <View style={styles.modalContainer}>
              <RenderOrderProducts products={selectedOrder.products || []} />
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  headerText: {
    color: Colors.dark,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 10,
    fontSize: 20,
    marginTop: 10,
  },
  contentStyle: {
    paddingHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeaderText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.dark,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  modalFooterContainer: {
    marginHorizontal: 10, 
    width: '95%', 
    marginBottom: 20,
    borderRadius: 5,
    padding: 10,
    borderWidth: 0.2,
  },
  modalFooterHeaderText: {
    fontSize: 21,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.dark,
    paddingTop: 5,
    paddingBottom: 20,
    paddingHorizontal: 10,
    alignSelf:'center'
  },
  modalFooterRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginVertical: 1,
  },
  modalFooterText: {
    color: Colors.dark,
    paddingHorizontal: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.charcoal,
    marginVertical: 5,
  },
  productItemContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    flexDirection: 'row',
    borderWidth: 0.2,
    width: '95%',
    marginHorizontal: 10,
  },
  productItemImage: {
    height: 80,
    width: 80,
    borderRadius: 5,
    borderWidth: 1,
  },
  productItemText: {
    color: Colors.dark,
    fontFamily: 'Poppins-SemiBold',
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});
