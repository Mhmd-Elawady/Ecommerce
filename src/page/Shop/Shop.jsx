import React, { useEffect, useState } from "react";
import "./shop.css";
import PageTransition from "../../components/PageTransition";
import Footer from "../../components/Footer/Footer";
import Product from "../../components/slideProducts/Product";
import SlideProductLoading from "../../components/slideproducts/SlideProductLoading";

const categories = [
  "smartphones", "laptops", "tablets", "mobile-accessories",
  "fragrances", "skincare", "groceries", "home-decoration",
  "furniture", "tops", "womens-dresses", "womens-shoes",
  "mens-shirts", "mens-shoes", "mens-watches", "womens-watches",
  "womens-bags", "womens-jewellery", "sunglasses", "automotive",
  "motorcycle", "lighting",
];

const formatCategoryName = (cat) => {
  if (cat === "all") return "All Products";
  return cat.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

function Shop() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  const PRODUCTS_PER_PAGE = 12;

  // Fetch all products once on mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://dummyjson.com/products?limit=500");
        const data = await response.json();
        setAllProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Filter and sort whenever category, sort, or products change
  useEffect(() => {
    let filtered = [...allProducts];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        filtered.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [allProducts, selectedCategory, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const indexOfFirst = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfFirst + PRODUCTS_PER_PAGE);

  const goToPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const shouldShowPage = (pageNum) =>
    pageNum === 1 ||
    pageNum === totalPages ||
    (pageNum >= currentPage - 2 && pageNum <= currentPage + 2);

  const shouldShowDots = (pageNum) =>
    pageNum === currentPage - 3 || pageNum === currentPage + 3;

  return (
    <PageTransition>
      <div className="shop_page">
        <div className="container">

          {/* Header */}
          <div className="shop_header">
            <h1>Shop</h1>
            <p>Browse our collection of amazing products</p>
          </div>

          {/* Filters */}
          <div className="shop_filters">
            <div className="filter_group">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter_select"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {formatCategoryName(cat)}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter_select"
              >
                <option value="default">Sort by: Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>

            <div className="results_count">
              {filteredProducts.length} products found
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="products_grid loading_grid">
              {[...Array(8)].map((_, i) => (
                <SlideProductLoading key={i} />
              ))}
            </div>
          ) : currentProducts.length > 0 ? (
            <div className="products_grid">
              {currentProducts.map((product) => (
                <Product key={product.id} item={product} />
              ))}
            </div>
          ) : (
            <div className="no_products">
              <p>No products found in this category.</p>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="pagination">
              <button className="page_btn prev" onClick={goToPrev} disabled={currentPage === 1}>
                ←
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (shouldShowPage(pageNum)) {
                  return (
                    <button
                      key={pageNum}
                      className={`page_btn ${currentPage === pageNum ? "active" : ""}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (shouldShowDots(pageNum)) {
                  return <span key={pageNum} className="page_dots">...</span>;
                }
                return null;
              })}

              <button className="page_btn next" onClick={goToNext} disabled={currentPage === totalPages}>
                →
              </button>
            </div>
          )}

        </div>
        <Footer />
      </div>
    </PageTransition>
  );
}

export default Shop;