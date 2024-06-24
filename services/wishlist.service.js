import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api/axios.config';
class WishlistService {
    getWishlist() {
        return API.get('/wishlist');
    }

    async addToWishlist(product_id) {
        try {
            return await API.post('/wishlist/add', { product_id });
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            throw error;
        }
    }

    async removeFromWishlist(product_id) {
        try {
            return await API.delete('/wishlist/delete', {
                data: { product_id: Number(product_id) },
            });
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            throw error;
        }
    }

    async isInWishlist(product_id) {
        try {
            return await API.get('/wishlist/check', {
                params: { product_id: Number(product_id) },
            });
        } catch (error) {
            console.error('Error checking wishlist status:', error);
            throw error;
        }
    }
}

export default new WishlistService();