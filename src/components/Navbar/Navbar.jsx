import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaSearch, FaUser, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { CartContext } from "../Context/CartContext";
import "./navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const { cartItems, favorites } = useContext(CartContext);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    console.log("Searching for:", searchQuery);
    setIsSearchOpen(false);
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
      
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Store<span className="logo-accent">Hub</span></span>
        </Link>

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

       
        <div className="nav-icons">
          
          <div className="icon search-icon" onClick={toggleSearch}>
            <FaSearch />
          </div>

          
          <Link to="/profile" className="icon">
            <FaUser />
          </Link>

        
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

       
        <div className={`search-overlay ${isSearchOpen ? "active" : ""}`}>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button type="submit">
              <FaSearch />
            </button>
            <button type="button" className="close-search" onClick={toggleSearch}>
              <FaTimes />
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;