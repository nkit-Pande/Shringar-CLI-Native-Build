import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  StatusBar,
} from 'react-native';
import React, {useState, useRef} from 'react';
import * as Icon from 'react-native-feather';
import {Colors} from '../color';
import ProfileForm from '../components/ProfileForm';
import {useUser} from '../context/userContext';
const Header = ({logOut}) => {
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: Colors.primary,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View style={{flexDirection: 'row'}}>
        <Icon.Hash
          width={25}
          height={25}
          stroke={Colors.dark}
          style={{marginTop: 5, marginLeft: 20, marginRight: 7}}
        />
        <Text style={styles.topHeader}>Profile</Text>
      </View>
      <TouchableOpacity onPress={logOut}>
        <Icon.LogOut
          width={25}
          height={25}
          stroke={Colors.dark}
          style={{marginBottom: 10, marginLeft: 7, marginRight: 20}}
        />
      </TouchableOpacity>
    </View>
  );
};

const InfoCard = ({
  userData,
  isExpanded,
  toggleExpand,
  isInfoCardExpanded,
  toggleModal,
}) => {
  const animatedHeight = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isExpanded ? 420 : 60,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  return (
    <TouchableOpacity
      onPress={toggleExpand}
      style={{
        width: '100%',
        alignItems: 'center',
        height: isExpanded ? 420 : 60,
        marginBottom: 10,
      }}
      activeOpacity={1}>
      <Animated.View style={[styles.infoContainer, {height: animatedHeight}]}>
        <View style={styles.infoHeaderBox}>
          <View style={{flexDirection: 'row'}}>
            <Icon.User
              height={25}
              width={25}
              stroke={Colors.dark}
              style={{marginRight: 15, marginLeft: 6}}
            />
            <Text style={styles.infoHeaderButtonText}>My Account</Text>
          </View>
          {isInfoCardExpanded && (
            <TouchableOpacity onPress={toggleModal}>
              <Icon.Edit height={25} width={25} stroke={Colors.dark} />
            </TouchableOpacity>
          )}
        </View>
        <View style={[styles.divider, {marginTop: 10}]} />
        {isExpanded && (
          <View>
            {/* Name */}
            <View style={styles.infoBoxContainer}>
              <Text style={styles.infoHeader}>Name</Text>
              <Text style={styles.infoText}>{userData?.fullname}</Text>
            </View>
            <View style={styles.divider} />
            {/* Email */}
            <View style={styles.infoBoxContainer}>
              <Text style={styles.infoHeader}>Email</Text>
              <Text style={styles.infoText}>{userData?.email}</Text>
            </View>
            <View style={styles.divider} />
            {/* Password */}
            <View style={styles.infoBoxContainer}>
              <Text style={styles.infoHeader}>Password</Text>
              <Text style={styles.infoText}>***********</Text>
            </View>
            <View style={styles.divider} />
            {/* User ID */}
            <View style={styles.infoBoxContainer}>
              <Text style={styles.infoHeader}>City</Text>
              <Text style={styles.infoText}>{userData?.city}</Text>
            </View>
            <View style={styles.divider} />
            {/* Zip Code */}
            <View style={styles.infoBoxContainer}>
              <Text style={styles.infoHeader}>State</Text>
              <Text style={styles.infoText}>{userData?.state}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoBoxContainer}>
              <Text style={styles.infoHeader}>Country</Text>
              <Text style={styles.infoText}>{userData?.country}</Text>
            </View>
            <View style={{height: 15}} />
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function ProfileScreen({navigationMain,navigation}) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isInfoCardExpanded, setInfoCardExpanded] = useState(false);
  const {logout, userData} = useUser();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleInfoCard = () => {
    setInfoCardExpanded(!isInfoCardExpanded);
  };

  const logOut = () => {
    logout();
    navigationMain.replace('Welcome');
  };

  return (
    <View style={{height:'100%',backgroundColor:'white'}}>
      <StatusBar
        animated={true}
        barStyle={'dark-content'}
        backgroundColor={Colors.primary}
        hidden={false}
      />
      <Header logOut={logOut} />
      <View style={styles.header}>
        <Icon.User
          stroke={Colors.dark}
          width={100}
          height={100}
          strokeWidth={1}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{userData?.username}</Text>
        <Text style={styles.profileLocation}>
          {userData?.city},{userData?.state}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.buttonContainer}>
        <InfoCard
          userData={userData}
          isExpanded={isInfoCardExpanded}
          toggleExpand={toggleInfoCard}
          isInfoCardExpanded={isInfoCardExpanded}
          toggleModal={toggleModal}
        />
        <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate('Wishlist')}>
          <Icon.Heart
            height={25}
            width={25}
            stroke={Colors.dark}
            style={{marginRight: 15, marginLeft: 6}}
          />
          <Text style={styles.infoHeaderButtonText}>Wishlist</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button,{}]}>
        <Icon.Key
            height={25}
            width={25}
            stroke={Colors.dark}
            style={{marginRight: 15, marginLeft: 6}}
          />
          <Text style={styles.infoHeaderButtonText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
        <Icon.MessageCircle
            height={25}
            width={25}
            stroke={Colors.dark}
            style={{marginRight: 15, marginLeft: 6}}
          />
          <Text style={styles.infoHeaderButtonText}>FAQ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
        <Icon.MapPin
            height={25}
            width={25}
            stroke={Colors.dark}
            style={{marginRight: 15, marginLeft: 6}}
          />
          <Text style={styles.infoHeaderButtonText}>Store</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button,{backgroundColor:'red'}]}>
        <Icon.Trash
            height={25}
            width={25}
            stroke={'white'}
            style={{marginRight: 15, marginLeft: 6}}
          />
          <Text style={[styles.infoHeaderButtonText,{color:'white'}]}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ProfileForm toggleModal={toggleModal} userData={userData} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    backgroundColor:'white'
  },
  header: {
    width: '100%',
    backgroundColor: Colors.primary,
    alignItems: 'center',
    paddingVertical: 5,
  },
  profileImage: {
    height: 110,
    width: 110,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    color: Colors.dark,
    fontFamily: 'Poppins-SemiBold',
  },
  profileLocation: {
    fontSize: 12,
    color: Colors.dark,
    fontFamily: 'Poppins-Medium',
  },
  infoContainer: {
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  infoBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  infoHeaderBox: {
    flexDirection: 'row',
    paddingVertical: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  infoHeaderButtonText: {
    fontSize: 18,
    color: Colors.dark,
    fontFamily: 'Poppins-SemiBold',
  },
  infoHeader: {
    fontSize: 16,
    color: Colors.dark,
    fontFamily: 'Poppins-SemiBold',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 5,
  },
  lowerContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    marginTop: -20,
  },
  actionButton: {
    alignItems: 'center',
    borderRadius: 30,
    marginTop: 5,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  actionButtonIcon: {
    margin: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  topHeader: {
    fontSize: 24,
    marginBottom: 8,
    alignSelf: 'flex-start',
    color: Colors.dark,
    fontFamily: 'Poppins-Medium',
  },
  button: {
    height: 60,
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.dark,
  },
  buttonContainer: {
    alignItems: 'center',
    padding: 10,
    backgroundColor:'white',
    paddingTop:20,
  },
});
