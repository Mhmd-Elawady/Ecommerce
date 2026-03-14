import React, { useEffect, useState } from "react";
import PageTransition from "../../components/PageTransition";
import Footer from "../../components/Footer/Footer";
import HeroSlider from "../../components/HeroSlider";
import SlideProduct from "../../components/slideproducts/SlideProduct";
import SlideProductLoading from "../../components/slideproducts/SlideProductLoading";
import "./home.css";

const CATEGORIES = [
  "smartphones",
  "mobile-accessories",
  "laptops",
  "tablets",
  "sunglasses",
  "sports-accessories",
];

// Converts "mobile-accessories" → "mobile accessories"
const formatTitle = (category) => category.replace(/-/g, " ");

function Home() {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const results = await Promise.all(
          CATEGORIES.map(async (category) => {
            const res = await fetch(
              `https://dummyjson.com/products/category/${category}`
            );
            const data = await res.json();
            return { [category]: data.products };
          })
        );

        const productsData = Object.assign({}, ...results);
        setProducts(productsData);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <PageTransition>
      <div>
        <HeroSlider />

        {error ? (
          <p className="error-message">{error}</p>
        ) : loading ? (
          CATEGORIES.map((category) => (
            <SlideProductLoading key={category} />
          ))
        ) : (
          CATEGORIES.map((category) => (
            <SlideProduct
              key={category}
              data={products[category]}
              title={formatTitle(category)}
            />
          ))
        )}
      </div>
      <Footer />
    </PageTransition>
  );
}

export default Home;