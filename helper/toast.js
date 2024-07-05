import { useEffect } from 'react';
import { useToast } from 'react-native-toast-notifications';
import { View, Text } from 'react-native-animatable';
import { Colors } from '../color';
import * as Icon from 'react-native-feather';

const useToastNotification = () => {
  const toast = useToast();

  const showToast = (message, options = {}) => {

    const defaultOptions = {
      type: 'custom',
      placement: 'bottom',
      duration: 2000,
      animationType: 'slide-in',
      textStyle: {
        fontSize: 14,
        color: '#333',
        fontFamily: 'Poppins-SemiBold',
        padding: 15,
        textAlignVertical: 'center',
      },
      style: {
        height: 60,
        backgroundColor: '#fff',
        borderLeftColor: Colors.danger,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        width: '90%',
        marginVertical: 10,
        alignSelf: 'center',
        flexDirection: 'row',
        borderWidth:2,
        borderColor:Colors.danger
      },
      renderToast: (toastOptions) => (
        <View style={toastOptions.style}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors.danger,
              height: 57,
              width: 46,
              borderTopLeftRadius: 5,
              borderBottomLeftRadius: 5,
              // borderWidth:2,
              padding:2
             
            }}
          >
            <Icon.AlertCircle stroke={'white'} height={28} width={28} strokeWidth={2} />
          </View>
          <Text style={toastOptions.textStyle}>{message}</Text>
        </View>
      ),
    };

    try {
      toast.show(message, { ...defaultOptions, ...options });
    } catch (error) {
        
    }
  };

  useEffect(() => {
    console.log('useToastNotification initialized');
  }, []);

  return { showToast };
};

export default useToastNotification;
