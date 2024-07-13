import { FlatList, StyleSheet, Text, View,Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors } from '../color';
import orderService from '../services/order.service';

export default function OrderCard({ item }) {
  const [currentProduct, setCurrentProduct] = useState({});

  const RenderOrderProducts = ({products}) => {
    return (
      <View style={{width:'100%',marginVertical:10}}>
        <FlatList
        data={products}
        renderItem={({item}) => (
          <View style={[styles.productItemContainer, styles.shadow]}>
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
          </View>
        )}
        contentContainerStyle={{
          width: '100%',
        }}
      />
      </View>
      
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formattedDate = formatDate(item.date);

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
    <View style={[styles.container, styles.shadow]}>
      <View style={styles.innerContainer}>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>{item.status}</Text>
        <Text style={styles.orderID}>{formattedDate}</Text>
      </View>
      <View>
        <RenderOrderProducts products={item.products} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginVertical: 10,
    backgroundColor: 'white',
    paddingBottom: 10,
    borderRadius: 16
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: "space-between",
  },
  orderID: {
    fontFamily: 'Poppins-SemiBold',
    color: 'grey',
    paddingRight: 15,
    marginBottom: -10,
    textTransform: 'capitalize',
    paddingVertical:5,
    textTransform: 'capitalize',
    fontSize:17,
    paddingVertical:5,
  },
  status: {
    fontFamily: 'Poppins-SemiBold',
    color: 'grey',
    paddingLeft: 15,
    textTransform: 'capitalize',
    fontSize:17,
    paddingVertical:5,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  productDetails: {
    paddingLeft: 15,
    paddingTop: 10
  },
  productName: {
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  productPrice: {
    fontFamily: 'Poppins-Regular',
    color: 'black',
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
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});
