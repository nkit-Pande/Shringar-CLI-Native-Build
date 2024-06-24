import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import productService from "../services/product.service";

const ProductContext = createContext();

const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({});
    const [product, setProduct] = useState(null);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await productService.getProducts(page);
            setProducts(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [page]);

    const fetchFilteredProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await productService.filterProducts(filters);
            setProducts(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchProducts();
    }, [page, fetchProducts]);

    useEffect(() => {
        fetchFilteredProducts();
    }, [filters, fetchFilteredProducts]);

    const getProductsByName = async (name) => {
        setIsLoading(true);
        try {
            const response = await productService.getProductByName(name);
            setProducts([response.data]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getProductsById = async (id) => {
        setIsLoading(true);
        try {
            const response = await productService.getProduct(id);
            setProduct(response.data);
            
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    

    const getProductByCategory = async (category) => {
        setIsLoading(true);
        try {
            const response = await productService.getProductsByCategory(category);
            setProducts(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getProductByMaterial = async (material) => {
        setIsLoading(true);
        try {
            const response = await productService.getProductsByMaterialType(material);
            setProducts(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateFilters = (newFilters) => {
        setFilters(newFilters);
    };

    const value = {
        products,
        isLoading,
        page,
        setPage,
        filters,
        updateFilters,
        getProductsByName,
        getProductByCategory,
        getProductByMaterial,
        getProductsById
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};

const useProduct = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error("useProduct must be used within a ProductProvider");
    }
    return context;
};

export { ProductContext, ProductProvider, useProduct };
