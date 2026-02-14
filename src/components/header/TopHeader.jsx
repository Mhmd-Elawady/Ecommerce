import { Link } from "react-router-dom";
import Logo from "../../image/online-shopping.png";
import { FaSearch, FaRegHeart } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import './header.css';
function TopHeader() {
  return (
    <div className="top_header">
      <div className="container">
        <Link to="/" className="logo">
          <img src={Logo} alt="logo" />
        </Link>

        <form className="search_box">
          <input
            type="text"
            name="search"
            placeholder="Search for Product"
          />
          <button type="submit">
            <FaSearch />
          </button>
        </form>

        <div className="header_icons">
          <div className="icon">
            <FaRegHeart />
            <span className="count">0</span>
          </div>

          <div className="icon">
            <TiShoppingCart />
            <span className="count">0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopHeader;