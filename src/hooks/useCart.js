import { getCart, addToCart, updateCartItem } from "../api/cart";
import Swal from "sweetalert2";

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
      } else {
        // 🆕 If not exists → add new
        await addToCart({ product: product.id, quantity }, token);
      }
    } catch (err) {
      console.error("Error adding to cart:", err?.response?.data || err);
      Swal.fire({
        title: "Error!",
        text: "Failed to add/update cart",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };

  return { addToCart: addToCartHandler };
}
