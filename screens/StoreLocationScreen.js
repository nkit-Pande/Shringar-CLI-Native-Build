import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import * as Icon from 'react-native-feather';
import {Colors} from '../color';
import MapView from 'react-native-maps';


export default function StoreLocationScreen() {
  const Header = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon.MapPin
            stroke={Colors.dark}
            height={28}
            width={25}
            style={{}}
          />
          <Text style={styles.headerText}>Store</Text>
        </View>
      </View>
    );
  };

  
  return (
    <View>
      <Header />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    width: '100%',
    backgroundColor: Colors.primary,
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
});
