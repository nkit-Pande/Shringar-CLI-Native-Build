import API from "../api/axios.config";
// import { ToastAndroid } from 'react-native'; // Use ToastAndroid for logging

class ProductService {
    getProducts(page) {
        return API.get(`/products/?page=${page}`);
    }

    getProduct(id) {
        return API.get(`/products/${id}`);
    }

    getProductByName(name) {
        // ToastAndroid.show("In getProductByName service", ToastAndroid.SHORT);
        return API.get(`/products/name/${name}`);
    }

    getProductsByCategory(category) {
        return API.get(`/products/category/${category}`);
    }

    getProductsByMaterialType(materialType) {
        return API.get(`/products/material/${materialType}`);
    }

    filterProducts(filters) {
        const filteredFilters = Object.fromEntries(
            Object.entries(filters).filter(([key, value]) => value !== undefined && value !== '')
        );

        const queryString = Object.keys(filteredFilters)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(filteredFilters[key])}`)
            .join('&');

        // ToastAndroid.show(`In filterServices: /products/filter?${queryString}`, ToastAndroid.SHORT);

        return API.get(`/products/filter?${queryString}`);
    }
}

export default new ProductService();