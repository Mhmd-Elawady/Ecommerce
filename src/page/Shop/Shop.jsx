import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./shop.css";
import PageTransition from "../../components/PageTransition";
import Footer from "../../components/Footer/Footer";
import Product from "../../components/slideProducts/Product";
import SlideProductLoading from "../../components/slideproducts/SlideProductLoading";

const categories = [
  "smartphones",
  "laptops",
  "tablets",
  "mobile-accessories",
  "fragrances",
  "skincare",
  "groceries",
  "home-decoration",
  "furniture",
  "tops",
  "womens-dresses",
  "womens-shoes",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "womens-watches",
  "womens-bags",
  "womens-jewellery",
  "sunglasses",
  "automotive",
  "motorcycle",
  "lighting"
];

function Shop() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 12;

  const navigate = useNavigate();

  // Fetch all products on mount
  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Filter and sort whenever dependencies change
  useEffect(() => {
    filterAndSortProducts();
  }, [allProducts, selectedCategory, sortBy]);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch first 100 products from DummyJSON
      const response = await fetch("https://dummyjson.com/products?limit=500");
      const data = await response.json();
      
      setAllProducts(data.products);
      setTotalProducts(data.total);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...allProducts];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Sort products
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
        // Default sorting - keep as is
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page on filter/sort change
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const formatCategoryName = (cat) => {
    if (cat === "all") return "All Products";
    return cat.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="shop_page">
          <div className="container">
            <div className="shop_header">
              <h1>Shop</h1>
              <p>Browse our collection of amazing products</p>
            </div>
            <div className="products_grid loading_grid">
              {[...Array(8)].map((_, i) => (
                <SlideProductLoading key={i} />
              ))}
            </div>
          </div>
          <Footer />
        </div>
      </PageTransition>
    );
  }

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
                onChange={handleCategoryChange}
                className="filter_select"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {formatCategoryName(cat)}
                  </option>
                ))}
              </select>

              <select 
                value={sortBy} 
                onChange={handleSortChange}
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
          <div className="products_grid">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <Product key={product.id} item={product} />
              ))
            ) : (
              <div className="no_products">
                <p>No products found in this category.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page_btn prev"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ←
              </button>
              
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                ) {
                  return (
                    <button
                      key={pageNum}
                      className={`page_btn ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                  return <span key={pageNum} className="page_dots">...</span>;
                }
                return null;
              })}
              
              <button
                className="page_btn next"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
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