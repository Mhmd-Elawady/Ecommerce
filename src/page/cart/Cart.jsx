import React, { useContext } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { CartContext } from "../../components/Context/CartContext";
import PageTransition from "../../components/PageTransition";
import Footer from "../../components/Footer/Footer";
import "./cart.css";

function Cart() {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } =
    useContext(CartContext);

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <PageTransition>
      <div className="checkout">
        <div className="ordersummary">

          <h1>Order Summary</h1>

          <div className="items">
            {cartItems.length === 0 ? (
              <p className="empty-cart">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div className="item_cart" key={item.id}>

                  <div className="image_name">
                    <div className="img_item">
                      <img src={item.images[0]} alt={item.title} />
                    </div>

                    <div className="content">
                      <h4>{item.title}</h4>
                      <p className="price_item">${item.price}</p>

                      <div className="quantity_control">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          onClick={() => increaseQuantity(item.id)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="delete_item"
                    aria-label={`Remove ${item.title} from cart`}
                  >
                    <FaTrashAlt />
                  </button>

                </div>
              ))
            )}
          </div>

          <div className="bottom_summary">
            <div className="shop_table">
              <p>Total:</p>
              <span className="total_checkout">${total.toFixed(2)}</span>
            </div>
            <div className="button_div">
              <button type="button">Place Order</button>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </PageTransition>
  );
}

export default Cart;