import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../color';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
export default function SkeletonItemCard() {
    const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

  return (
    <View style={styles.cardContainer}>
    <ShimmerPlaceholder duration={3000} style={styles.image} />
    <View style={styles.textContainer}>
      <ShimmerPlaceholder  stopAutoRun style={styles.productName} />
      <ShimmerPlaceholder  stopAutoRun style={styles.productPrice} />
    </View>
  </View>
  )
}

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        flexWrap: 'wrap',
        width: 160,
        height: 200,
        backgroundColor: 'white',
        marginHorizontal: 10,
        marginVertical:10,
        borderRadius: 5,
        shadowColor: 'black',
        shadowOpacity: 0.2,
        elevation: 9,
        borderColor: Colors.e_orange,
        borderWidth: 0.2,
        padding:10
      },
      image: {
        width: '100%',
        height: 130,
        backgroundColor: 'white',
        marginBottom: 15,
        borderRadius: 5,
      },
      textContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 5,
      },
      productName: {
        width:140,
        fontSize: 13,
        color: Colors.dark,
        fontWeight: 'bold',
      },
      productPrice: {
        width:50,
        fontWeight: '400',
        color: Colors.e_orange,
        fontWeight: 'bold',
        marginTop: 3,
        alignSelf: 'center',
      },
      heart: {
        position: 'absolute',
        right: 0,
        marginRight: 2,
        marginTop: 2,
        borderRadius: 50,
        borderColor: 'grey',
        padding: 2,
      },
})