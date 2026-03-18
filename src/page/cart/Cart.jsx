import React, { useContext } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { CartContext } from "../../components/Context/CartContext";
import PageTransition from "../../components/PageTransition";
import Footer from "../../components/Footer/Footer";
import "./cart.css";

function Cart() {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } =
    useContext(CartContext);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <PageTransition>
      <div className="checkout">
        <div className="ordersummary">

          <h1>Order Summary</h1>

          <div className="items">
            {cartItems.length === 0 ? (
              <div className="empty_cart">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none">
                  <path
                    d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"
                    stroke="rgba(220,38,38,0.4)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>Your cart is empty</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div className="item_cart" key={item.id}>

                  {/* Left: image + name */}
                  <div className="image_name">
                    <div className="img_item">
                      <img src={item.images[0]} alt={item.title} />
                    </div>
                    <div>
                      <h4>{item.title}</h4>
                      <span className="unit_price">${item.price.toFixed(2)} each</span>
                    </div>
                  </div>

                  {/* Right: price + qty + delete */}
                  <div className="item_right">
                    <span className="item_price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>

                    <div className="quantity_control">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="delete_item"
                      aria-label={`Remove ${item.title} from cart`}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

          {/* Footer summary */}
          <div className="bottom_summary">

            <div className="shop_table">
              <p>Subtotal</p>
              <span className="value">${subtotal.toFixed(2)}</span>
            </div>

            <div className="shop_table">
              <p>Shipping</p>
              <span className="free_tag">FREE</span>
            </div>

            <div className="shop_table">
              <p>Tax (8%)</p>
              <span className="value">${tax.toFixed(2)}</span>
            </div>

            <div className="total_row">
              <span className="total_label">Total</span>
              <span className="total_checkout">${total.toFixed(2)}</span>
            </div>

            <div className="button_div">
              <button
                type="button"
                disabled={cartItems.length === 0}
                style={{
                  opacity: cartItems.length === 0 ? 0.5 : 1,
                  cursor: cartItems.length === 0 ? "not-allowed" : "pointer",
                }}
              >
                Place Order
              </button>
              <p className="secure_note">Secured by SSL · 256-bit encryption</p>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
}

export default Cart;