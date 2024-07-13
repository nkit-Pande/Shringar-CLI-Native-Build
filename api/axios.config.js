import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://6960-1-23-231-165.ngrok-free.app/api';

const API = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

API.interceptors.request.use(
    async function(req) {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                req.headers['auth-token'] = JSON.parse(token);
            }
        } catch (error) {
            console.error('Error retrieving token', error);
        }
        return req;
    },
    function(error) {
        return Promise.reject(error);
    }
);

export default API;
