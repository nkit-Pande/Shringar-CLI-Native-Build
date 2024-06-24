import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import wishlistService from "../services/wishlist.service";
import { useUser } from "./userContext";
import cartService from "../services/cart.service";
import { useCart } from "./cartContext";
import { ToastAndroid } from 'react-native';
import LocalWishlist from "../helper/localStorageWishlist";
import localCart from "../helper/localStorageCart";

const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
    const [wishlistData, setWishlistData] = useState([]);
    const { isLoggedIn, userData } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [wishlistTotal, setWishlistTotal] = useState(0);
    const { setCartData } = useCart();

    const fetchWishlist = useCallback(async () => {
        setIsLoading(true);
        if (isLoggedIn) {
            try {
                const response = await wishlistService.getWishlist();
                setWishlistData(response.data);
            } catch (error) {
                console.error("Failed to fetch wishlist:", error);
            } finally {
                setIsLoading(false);
            }
        } else {
            const items = await LocalWishlist.getItems();
            setWishlistData({ items });
            setIsLoading(false);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        fetchWishlist();
    }, [isLoggedIn, fetchWishlist]);

    useEffect(() => {
        const quantity = wishlistData?.items?.reduce((acc, cur) => acc + Number(cur.quant), 0) || 0;
        setWishlistTotal(quantity);
        if (wishlistData.items) {
            // ToastAndroid.show("Wishlist Updated", ToastAndroid.SHORT);
        }
    }, [wishlistData]);

    const addItemToWishlist = async (product) => {
        setIsLoading(true);
        if (isLoggedIn) {
            try {
                const { data } = await wishlistService.addToWishlist(product.product_id);
                setWishlistData(prevData => ({ items: [{ ...data.data[0], quant: 1 }, ...prevData.items] }));
            } catch (error) {
                console.error("Error adding item to wishlist:", error);
                return error;
            }
        } else {
            await LocalWishlist.addItem(product);
            setWishlistData({ items: await LocalWishlist.getItems() });
        }
        setIsLoading(false);
    };

    const deleteItemFromWishlist = async (product_id) => {
        setIsLoading(true);
        if (isLoggedIn) {
            try {
                await wishlistService.removeFromWishlist(product_id);
                setWishlistData(prevData => ({ items: prevData.items.filter(item => item.product_id !== product_id) }));
            } catch (error) {
                console.error("Error deleting item from wishlist:", error);
            }
        } else {
            await LocalWishlist.removeItem(product_id);
            setWishlistData({ items: await LocalWishlist.getItems() });
        }
        setIsLoading(false);
    };

    const isInWishlist = async (product_id) => {
        if (isLoggedIn) {
            return await wishlistService.isInWishlist(product_id);
        } else {
            const items = await LocalWishlist.getItems();
            return items.some(item => item.product_id === product_id);
        }
    };

    const moveItemToCart = async (product_id, quantity = 1) => {
        setIsLoading(true);
        try {
            if (isLoggedIn) {
                await wishlistService.removeFromWishlist(product_id);
                setWishlistData(prevData => ({ items: prevData.items.filter(item => item.product_id !== product_id) }));
                const { data } = await cartService.addToCart(product_id, quantity);
                setCartData({ items: [...data.data] });
            } else {
                await LocalWishlist.removeItem(product_id);
                setWishlistData({ items: await LocalWishlist.getItems() });
                localCart.addItem(product_id, quantity);
                setCartData({ items: await localCart.getItems() });
            }
        } catch (error) {
            console.error("Error moving item to cart:", error);
        }
        setIsLoading(false);
    };

    return (
        <WishlistContext.Provider
            value={{
                isLoading,
                wishlistData,
                setWishlistData,
                addItemToWishlist,
                deleteItemFromWishlist,
                wishlistTotal,
                isInWishlist,
                moveItemToCart
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within WishlistProvider");
    }
    return context;
};

export { WishlistProvider, useWishlist };
