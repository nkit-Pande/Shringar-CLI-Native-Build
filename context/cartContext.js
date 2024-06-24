import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import cartService from "../services/cart.service";
import localCart from "../helper/localStorageCart";
import { useUser } from "./userContext";

const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cartData, setCartData] = useState({ items: [] });
    const [cartSubTotal, setCartSubTotal] = useState(0);
    const [cartTotal, setCartTotal] = useState(0);
    const { isLoggedIn } = useUser();
    const [isLoading, setIsLoading] = useState(false);

    const fetchCartData = useCallback(async () => {
        setIsLoading(true);
        try {
            if (isLoggedIn) {
                const cartItems = localCart.getItems();
                const addToCartPromises = cartItems.map(({ product_id, quantity }) => cartService.addToCart(product_id, quantity));
                await Promise.all(addToCartPromises);
                localCart.clearCart();
                const res = await cartService.getCart();
                setCartData(res.data);
            } else {
                const items = await localCart.getItems();
                setCartData({ items: items || [] });
            }
        } finally {
            setIsLoading(false);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        fetchCartData();
    }, [isLoggedIn, fetchCartData]);

    useEffect(() => {
        const updateCartTotals = () => {
            const subtotal = cartData.items.reduce((acc, cur) => acc + parseFloat(cur.subtotal || 0), 0);
            const totalQuantity = cartData.items.reduce((acc, cur) => acc + parseInt(cur.quantity || 0), 0);
            setCartSubTotal(subtotal);
            setCartTotal(totalQuantity);
        };
        updateCartTotals();
    }, [cartData]);

    const addItem = async (product, quantity) => {
        if (isLoggedIn) {
            try {
                const { data } = await cartService.addToCart(product.product_id, quantity);
                setCartData({ items: data.data });
            } catch (error) {
                console.error(error);
                return error;
            }
        } else {
            await localCart.addItem(product, quantity);
            setCartData({ items: await localCart.getItems() });
        }
    };

    const deleteItem = async (product_id) => {
        if (isLoggedIn) {
            await cartService.removeFromCart(product_id);
            setCartData({ items: cartData.items.filter(item => item.product_id !== product_id) });
        } else {
            await localCart.removeItem(product_id);
            setCartData({ items: await localCart.getItems() });
        }
    };

    const increment = async (product_id) => {
        if (isLoggedIn) {
            const res = await cartService.increment(product_id);
            setCartData({ items: res.data });
        } else {
            await localCart.incrementQuantity(product_id);
            setCartData({ items: await localCart.getItems() });
        }
    };

    const decrement = async (product_id) => {
        if (isLoggedIn) {
            const res = await cartService.decrement(product_id);
            setCartData({ items: res.data });
        } else {
            await localCart.decrementQuantity(product_id);
            setCartData({ items: await localCart.getItems() });
        }
    };

    const moveCartItemToWishlist = async (product_id, quantity = 1) => {
        try {
            if (isLoggedIn) {
                await cartService.removeFromCart(product_id);
                setCartData({ items: cartData.items.filter(item => item.product_id !== product_id) });
            } else {
                await localCart.removeItem(product_id);
                setCartData({ items: await localCart.getItems() });
            }

            if (isLoggedIn) {
                await wishlistService.addToWishlist(product_id);
            } else {
                await LocalWishlist.addItem(product_id);
            }
        } catch (error) {
            console.error("Error moving item to wishlist:", error);
        }
    };

    const value = {
        isLoading,
        cartData,
        setCartData,
        addItem,
        deleteItem,
        increment,
        decrement,
        cartTotal,
        cartSubTotal,
        moveCartItemToWishlist,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
};

export { CartProvider, useCart };
