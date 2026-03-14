import React, { useContext } from "react";
import { FaRegHeart, FaRegStarHalfStroke, FaShare, FaStar } from "react-icons/fa6";
import { TiShoppingCart } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CartContext } from "../../components/Context/CartContext";

function ProductInfo({ product }) {
  const { cartItems, addToCart, addToFavorites, favorites, removeFromFavorites } =
    useContext(CartContext);
  const navigate = useNavigate();

  const productImage = Array.isArray(product.images) ? product.images[0] : product.image;

  const isInCart = cartItems.some((i) => i.id === product.id);
  const isInFav = favorites.some((i) => i.id === product.id);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(
      <div className="toast-wrapper">
        <img src={productImage} alt={product.title} className="toast-img" />
        <div className="toast-content">
          <strong>{product.title}</strong> added to Cart
          <div>
            <button className="btn" onClick={() => navigate("/cart")}>
              View Cart
            </button>
          </div>
        </div>
      </div>,
      { duration: 3500 }
    );
  };

  const handleAddToFav = () => {
    if (isInFav) {
      removeFromFavorites(product.id);
      toast.error(`${product.title} removed from favorites.`);
    } else {
      addToFavorites(product);
      toast.success(`${product.title} added to favorites.`);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: `Check out this product: ${product.title}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Product link copied to clipboard");
      }
    } catch (error) {
      console.log("Share failed:", error);
    }
  };

  return (
    <div className="details_item">
      <h1 className="name">{product.title}</h1>
      <div className="stars">
        <FaStar /><FaStar /><FaStar /><FaStar /><FaRegStarHalfStroke />
      </div>
      <p className="price">${product.price}</p>
      <h5>Availability: <span>{product.availabilityStatus}</span></h5>
      <h5>Brand: <span>{product.brand}</span></h5>
      <p className="desc">{product.description}</p>
      <h5 className="stock">
        <span>Hurry Up! Only {product.stock} products left in stock.</span>
      </h5>
      <button
        onClick={handleAddToCart}
        className={`btn ${isInCart ? "in-cart" : ""}`}
      >
        {isInCart ? "Item in Cart" : "Add to Cart"}
        <TiShoppingCart />
      </button>
      <div className="icons">
        <span
          className={isInFav ? "in-fav" : ""}
          onClick={handleAddToFav}
          title={isInFav ? "Remove from favorites" : "Add to favorites"}
        >
          <FaRegHeart />
        </span>
        <span onClick={handleShare} title="Share">
          <FaShare />
        </span>
      </div>
    </div>
  );
}

export default ProductInfo;
