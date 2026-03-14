import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Product from "../../components/slideproducts/Product";
import SlideProductLoading from "../../components/slideproducts/SlideProductLoading";
import PageTransition from "../../components/PageTransition";
import Footer from "../../components/Footer/Footer";
import "./categorypage.css";

function CategoryPage() {
  const { category } = useParams();
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    fetch(`https://dummyjson.com/products/category/${category}`)
      .then((res) => res.json())
      .then((data) => {
        setCategoryProducts(data.products || []);
      })
      .catch((err) => {
        console.error("Category fetch error:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [category]);

  // Format category name: "mens-shirts" → "Mens Shirts"
  const formattedCategory = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <PageTransition key={category}>
      <div className="category_products">
        <div className="container">

          {loading ? (
            <SlideProductLoading />
          ) : error ? (
            <p className="error-message">
              Something went wrong. Please try again later.
            </p>
          ) : (
            <>
              <div className="top_slide">
                <h2>
                  {formattedCategory}
                  <span> ({categoryProducts.length} Products)</span>
                </h2>
              </div>

              <div className="products">
                {categoryProducts.map((item) => (
                  <Product item={item} key={item.id} />
                ))}
              </div>
            </>
          )}

        </div>
      </div>
      <Footer />
    </PageTransition>
  );
}

export default CategoryPage;