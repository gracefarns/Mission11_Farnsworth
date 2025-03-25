import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.tsx";
import { CartItem } from "../types/CartItem.ts";

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();

  // Group items by title
  const groupedCart = cart.reduce(
    (acc, item) => {
      const existingItem = acc.find((i) => i.title === item.title);
      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.subtotal += item.price;
      } else {
        acc.push({ ...item, quantity: 1, subtotal: item.price });
      }
      return acc;
    },
    [] as Array<CartItem & { quantity: number; subtotal: number }>
  );

  return (
    <div>
      <h2>Your cart</h2>
      <div>
        {groupedCart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {groupedCart.map((item) => (
              <li key={item.bookId}>
                {item.title} - Price: {item.price} Quantity: {item.quantity}, Subtotal: $
                {item.subtotal.toFixed(2)}
                <button onClick={() => removeFromCart(item.bookId)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <h3>
        Total: $
        {groupedCart
          .reduce((total, item) => total + item.subtotal, 0)
          .toFixed(2)}
      </h3>
      <button>Checkout</button>
      <button onClick={() => navigate("/books")}>Continue Browsing</button>
    </div>
  );
}

export default CartPage;
