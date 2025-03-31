import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.tsx";
import { CartItem } from "../types/CartItem";
import { useEffect, useState } from "react";

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    // Calculate the total once, whenever the cart changes
    let runningTotal = 0;
    cart.forEach((item: CartItem) => {
      runningTotal += Number(item.price) * Number(item.quantity);
    });
    setTotal(runningTotal); // Update the state after calculating the total
  }, [cart]);

  return (
    <div>
      <h2>Your cart</h2>
      <div>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cart.map((item: CartItem) => (
              <li key={item.bookId}>
                {item.title} - Price: {item.price} Quantity: {item.quantity},
                Subtotal: $
                {(Number(item.price) * Number(item.quantity)).toFixed(2)}
                <button onClick={() => removeFromCart(item.bookId)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <h3>Total: ${total.toFixed(2)}</h3>
      <button>Checkout</button>
      <button onClick={() => navigate("/books")}>Continue Browsing</button>
    </div>
  );
}

export default CartPage;
