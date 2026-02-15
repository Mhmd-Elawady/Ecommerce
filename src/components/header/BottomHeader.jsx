import React, { useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { PiSignInBold } from "react-icons/pi";
import { FaUserPlus } from "react-icons/fa6";

const Nav_links = [
  { title: "Home", path: "/" },
  { title: "About", path: "/about" },
  { title: "Accessories", path: "/accessories" },
  { title: "Contact", path: "/contact" },
  { title: "Blog", path: "/blog" },
];

function BottomHeader() {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  useEffect(() => {
    fetch("https://dummyjson.com/products/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="btm_header">
      <div className="container">
        <div className="nav">
          <div className="category_nav">
            <div
              className="category_btn"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              <IoMenu />
              <p>Browse Category</p>
              <IoMdArrowDropdown />
            </div>

            <div
              className={`category_nav_links ${isCategoryOpen ? "active" : ""}`}
            >
              {categories.map((category) => (
                <Link key={category.slug} to={`/category/${category.slug}`}>
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          <ul className="nav_links">
            {Nav_links.map((item) => (
              <li
                key={item.path}
                className={location.pathname === item.path ? "active" : ""}
              >
                <Link to={item.path}>{item.title}</Link>
              </li>
            ))}
          </ul>

          <div className="header_icon">
            <PiSignInBold />
            <FaUserPlus />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BottomHeader;
