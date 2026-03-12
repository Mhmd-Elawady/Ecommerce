import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./productdetails.css";

import PageTransition from "../../components/PageTransition";
import Footer from "../../components/Footer/Footer";
import ProductImages from "./ProductImages";
import ProductInfo from "./ProductInfo";
import ProductDetailsLoading from "./ProductDetailsLoading";
import SlideProduct from "../../components/slideProducts/SlideProduct";
import SlideProductLoading from "../../components/slideproducts/SlideProductLoading";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Fetch main product
  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        const data = await res.json();

        if (!data || data.message) {
          setNotFound(true);
        } else {
          setProduct(data);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch related products once we know the category
  useEffect(() => {
    if (!product?.category) return;

    setLoadingRelated(true);

    fetch(`https://dummyjson.com/products/category/${product.category}`)
      .then((res) => res.json())
      .then((data) => setRelatedProducts(data.products || []))
      .catch((error) => console.error("Failed to fetch related products:", error))
      .finally(() => setLoadingRelated(false));
  }, [product?.category]);

  if (loading) {
    return (
      <PageTransition key={id}>
        <ProductDetailsLoading />
        <Footer />
      </PageTransition>
    );
  }

  if (notFound) {
    return (
      <PageTransition key={id}>
        <div className="container">
          <p>Product not found.</p>
        </div>
        <Footer />
      </PageTransition>
    );
  }

  return (
    <PageTransition key={id}>
      <div className="item_details">
        <div className="container">
          <ProductImages product={product} />
          <ProductInfo product={product} />
        </div>
      </div>

      {loadingRelated ? (
        <SlideProductLoading />
      ) : (
        <SlideProduct
          key={product.category}
          data={relatedProducts}
          title={product.category.replace(/-/g, " ")}
        />
      )}

      <Footer />
    </PageTransition>
  );
}

export default ProductDetails;