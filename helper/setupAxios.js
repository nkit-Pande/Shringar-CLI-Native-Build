import API from '../api/axios.config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setupAxiosInterceptors = (isLoggedIn, setIsLoggedIn, setUserData, setAuthData, navigation) => {
  if (isLoggedIn) {
    API.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && originalRequest.url === "/auth/refresh-token") {
          setIsLoggedIn(false);
          setAuthData(null);
          setUserData(null);
          navigation.navigate('Login');
          return Promise.reject(error);
        }

        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const res = await API.post("/auth/refresh-token");
            await AsyncStorage.setItem("token", JSON.stringify(res.data.token));
            return API(originalRequest);
          } catch (err) {
            await AsyncStorage.removeItem("token");
            setIsLoggedIn(false);
            setAuthData(null);
            setUserData(null);
            navigation.navigate('Login');
          }
        }
        return Promise.reject(error);
      }
    );
  }
};
