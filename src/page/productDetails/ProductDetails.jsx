import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import "./productdetails.css";
import PageTransition from "../../components/PageTransition";
import Footer from "../../components/Footer/Footer";
import ProductImages from "./ProductImages";
import ProductInfo from "./ProductInfo";
import ProductDetailsLoading from "./ProductDetailsLoading";
import SlideProduct from "../../components/slideproducts/SlideProduct";
import SlideProductLoading from "../../components/slideproducts/SlideProductLoading";

const normalizeProduct = (data) => ({
  id: data.id,
  title: data.title,
  description: data.description,
  price: data.price,
  images: [data.image],
  brand: data.category,
  category: data.category,
  stock: 10,
  availabilityStatus: "In Stock",
   source: "fakestore", 
});

function ProductDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const source = searchParams.get("source");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setProduct(null);

    const fetchProduct = async () => {
      try {
        if (source === "fakestore") {
          const res = await fetch(`https://fakestoreapi.com/products/${id}`);
          const data = await res.json();
          data?.id ? setProduct(normalizeProduct(data)) : setNotFound(true);
        } else {
          const res = await fetch(`https://dummyjson.com/products/${id}`);
          const data = await res.json();
          data && !data.message ? setProduct(data) : setNotFound(true);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, source]);

  useEffect(() => {
    if (!product?.category) return;
    setLoadingRelated(true);

    const url = source === "fakestore"
      ? `https://fakestoreapi.com/products/category/${product.category}`
      : `https://dummyjson.com/products/category/${product.category}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const products = source === "fakestore"
          ? data.map(normalizeProduct)
          : data.products || [];
        setRelatedProducts(products);
      })
      .catch((error) => console.error("Failed to fetch related:", error))
      .finally(() => setLoadingRelated(false));
  }, [product?.category, source]);

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