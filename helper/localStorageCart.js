import AsyncStorage from '@react-native-async-storage/async-storage';

class LocalCart {
  isExist = async (id) => !!(await this.getItem(id));

  getItems = async () => {
    const items = await AsyncStorage.getItem("__cart");
    return items ? JSON.parse(items) : [];
  };

  getItem = async (id) => {
    const items = await this.getItems();
    return items.find((product) => product.product_id == id);
  };

  saveItems = async (data) => {
    await AsyncStorage.setItem("__cart", JSON.stringify(data));
  };

  removeItem = async (id) => {
    const items = await this.getItems();
    const filteredItems = items.filter((product) => product.product_id != id);
    await this.saveItems(filteredItems);
  };

  incrementQuantity = async (id) => {
    const items = await this.getItems();
    const updatedItems = items.map((prod) => {
      if (id === prod.product_id) {
        prod.quantity += 1;
        prod.subtotal = prod.price * prod.quantity;
      }
      return prod;
    });
    await this.saveItems(updatedItems);
  };

  decrementQuantity = async (id) => {
    const items = await this.getItems();
    const updatedItems = items.map((prod) => {
      if (id === prod.product_id && prod.quantity > 0) {
        prod.quantity -= 1;
        prod.subtotal = prod.price * prod.quantity;
      }
      return prod;
    });
    await this.saveItems(updatedItems);
  };

  addItem = async (product, quantity = 1) => {
    const items = await this.getItems();
    const existingProduct = items.find((prod) => prod.product_id === product.product_id);

    if (existingProduct) {
      const updatedItems = items.map((prod) => {
        if (product.product_id === prod.product_id) {
          prod.quantity += quantity;
          prod.subtotal = prod.price * prod.quantity;
        }
        return prod;
      });
      await this.saveItems(updatedItems);
    } else {
      product.quantity = quantity;
      product.subtotal = product.price * product.quantity;
      await this.saveItems([...items, product]);
    }
  };

  clearCart = async () => {
    await AsyncStorage.removeItem("__cart");
  };
}

export default new LocalCart();