import React, { useState, useContext } from "react";
import { FaBars, FaTimes, FaSearch, FaUser, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../Context/CartContext";
import "./navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, favorites } = useContext(CartContext);

  // Assume user is not logged in for demo
  const isLoggedIn = false;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  // Handle search input change with debounce
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 2) {
      setIsSearching(true);
      try {
        const response = await fetch(`https://dummyjson.com/products/search?q=${query}`);
        const data = await response.json();
        setSearchResults(data.products || []);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Handle profile icon click
  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/shop", label: "Shop" },
    { path: "/about", label: "About Us" },
    { path: "/faq", label: "FAQ" },
    { path: "/contact", label: "Contact Us" },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Store<span className="logo-accent">Hub</span></span>
        </Link>

        {/* Navigation Menu */}
        <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          {navLinks.map((link) => (
            <li key={link.path} className="nav-item">
              <Link
                to={link.path}
                className={`nav-link ${isActive(link.path) ? "active" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Icons */}
        <div className="nav-icons">
          <div className="icon search-icon" onClick={toggleSearch}>
            <FaSearch />
          </div>

          {/* Profile Icon - Now opens login if not logged in */}
          <div className="icon" onClick={handleProfileClick}>
            <FaUser />
          </div>

          <Link to="/favorites" className="icon">
            <FaRegHeart />
            {favorites.length > 0 && <span className="icon-badge">{favorites.length}</span>}
          </Link>

          <Link to="/cart" className="icon cart-icon">
            <FaShoppingCart />
            {cartItems.length > 0 && <span className="icon-badge">{cartItems.length}</span>}
          </Link>

          <div className="menu-icon" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>

        {/* Search Overlay */}
        <div className={`search-overlay ${isSearchOpen ? "active" : ""}`}>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              autoFocus
            />
            <button type="submit">
              <FaSearch />
            </button>
            <button type="button" className="close-search" onClick={toggleSearch}>
              <FaTimes />
            </button>
          </form>

          {/* Search Results Dropdown */}
          {searchQuery.length > 0 && (
            <div className="search-results">
              {isSearching ? (
                <div className="search-loading">Searching...</div>
              ) : searchResults.length > 0 ? (
                <>
                  {searchResults.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className="search-result-item"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <img src={product.thumbnail} alt={product.title} />
                      <div className="result-info">
                        <h4>{product.title}</h4>
                        <p>${product.price}</p>
                      </div>
                    </div>
                  ))}
                  {searchResults.length > 5 && (
                    <div className="view-all-results" onClick={handleSearch}>
                      View all {searchResults.length} results
                    </div>
                  )}
                </>
              ) : (
                searchQuery.length > 2 && (
                  <div className="no-results">No products found</div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;