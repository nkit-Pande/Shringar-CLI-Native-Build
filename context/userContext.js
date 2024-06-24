import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../api/axios.config";
import authService from "../services/auth.service";
import { setupAxiosInterceptors } from '../helper/setupAxios';

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [authData, setAuthData] = useState({
        token: "",
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            authService.getCurrentUser().then((res) => setUserData(res?.data));
        }
    }, [isLoggedIn]);

    useEffect(() => {
        const loadToken = async () => {
            const storedToken = await AsyncStorage.getItem("token");
            if (storedToken) {
                try {
                    const parsedToken = JSON.parse(storedToken);
                    setAuthData(parsedToken);
                    setIsLoggedIn(true);
                } catch (error) {
                    console.error("Error parsing token:", error);
                    await AsyncStorage.removeItem("token");
                }
            }
        };
        loadToken();
    }, []);

    const updateUserData = async ({ fullname, email, username, address, city, state, country }) => {
        try {
            const res = await API.put(`user/${userData.user_id}`, {
                fullname,
                email,
                username,
                address,
                city,
                state,
                country,
            });
            setUserData(res.data);
            console.log(res);
        } catch (error) {
            console.error("Error updating user data:", error);
        }
    };

    const setUserInfo = (data) => {
        const { user, token } = data;
        setIsLoggedIn(true);
        setUserData(user);
        setAuthData({
            token,
        });
        AsyncStorage.setItem("token", JSON.stringify(token));
    };

    const logout = async () => {
        setUserData(null);
        setAuthData({
            token: "",
        });
        setIsLoggedIn(false);
        await AsyncStorage.removeItem("token");
        authService.logout();
    };

    useEffect(() => {
        setupAxiosInterceptors(isLoggedIn, setIsLoggedIn, setUserData, setAuthData);
    }, [isLoggedIn, setAuthData, setIsLoggedIn, setUserData]);

    return (
        <UserContext.Provider
            value={{
                userData,
                setUserData,
                setUserState: (data) => setUserInfo(data),
                logout,
                isLoggedIn,
                setIsLoggedIn,
                authData,
                setAuthData,
                updateUserData,
                setUserInfo
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

const useUser = () => {
    const context = useContext(UserContext);

    if (context === undefined) {
        throw new Error("useUser must be used within UserProvider");
    }
    return context;
};

export { UserProvider, useUser };
