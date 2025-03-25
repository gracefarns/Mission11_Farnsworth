import { useNavigate, useParams } from "react-router-dom";
import WelcomeBand from "../components/WelcomeBand";
import { useCart } from "../context/CartContext";
import { CartItem } from "../types/CartItem";

function BuyPage() {
  const navigate = useNavigate();
  const { title, bookId, price } = useParams();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const newItem: CartItem = {
      bookId: Number(bookId),
      title: title || "No Project Found",
      price: Number(price),
      quantity: undefined
    };
    addToCart(newItem);
    navigate("/cart");
  };

  return (
    <>
      <WelcomeBand />
      <h2>Buy {title}</h2>

      <div>
        <h4>${price}</h4>
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </>
  );
}
export default BuyPage;
