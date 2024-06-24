import React, { useEffect } from 'react';
import { useUser } from '../context/userContext';
import { setupAxiosInterceptors } from '../helper/setupAxios';

const WithAxios = ({ children, navigation }) => {
  const { setIsLoggedIn, setUserData, setAuthData, isLoggedIn } = useUser();

  useEffect(() => {
    setupAxiosInterceptors(isLoggedIn, setIsLoggedIn, setUserData, setAuthData, navigation);
  }, [isLoggedIn, setAuthData, setIsLoggedIn, setUserData, navigation]);

  return children;
};

export default WithAxios;
