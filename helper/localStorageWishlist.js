import AsyncStorage from '@react-native-async-storage/async-storage';

class LocalWishlist {
  isExist = async (id) => !!(await this.getItem(id));

  getItems = async () => {
    const items = await AsyncStorage.getItem("__wishlist");
    return items ? JSON.parse(items) : [];
  };

  getItem = async (id) => {
    const items = await this.getItems();
    return items.find((product) => product.product_id == id);
  };

  saveItems = async (data) => {
    await AsyncStorage.setItem("__wishlist", JSON.stringify(data));
  };

  removeItem = async (id) => {
    const items = await this.getItems();
    const filteredItems = items.filter((product) => product.product_id != id);
    await this.saveItems(filteredItems);
  };
  
  clearWishlist = async () => {
    await AsyncStorage.removeItem("__wishlist");
  };

  addItem = async (product) => {
    const items = await this.getItems();
    if (items.some((prod) => prod.product_id === product.product_id)) {
      return;
    } else {
      await this.saveItems([...items, product]);
    }
  };
}

export default new LocalWishlist();
