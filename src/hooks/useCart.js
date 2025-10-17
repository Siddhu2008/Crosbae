import { getCart, addToCart, updateCartItem } from "../api/cart";

export default function useCart(token) {
  const addToCartHandler = async (product, quantity = 1) => {
    try {
      // 🛒 First, fetch existing cart
      const cartData = await getCart(token);
      const cartItems = Array.isArray(cartData) ? cartData : cartData.results || [];

      // 🧭 Check if product already exists in cart
      const existingItem = cartItems.find(
        (item) => item.product === product.id || item.product.id === product.id
      );

      if (existingItem) {
        // 🛠 If exists → update quantity
        await updateCartItem(existingItem.id, {
          quantity: existingItem.quantity + quantity,
        }, token);
        alert("Cart updated!");
      } else {
        // 🆕 If not exists → add new
        await addToCart({ product: product.id, quantity }, token);
        alert("Added to cart!");
      }
    } catch (err) {
      console.error("Error adding to cart:", err?.response?.data || err);
      alert("Failed to add/update cart");
    }
  };

  return { addToCart: addToCartHandler };
}
