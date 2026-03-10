import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BottomHeader from "./components/header/BottomHeader";
import TopHeader from "./components/header/TopHeader";
import Home from "./page/home/Home";
import ProductDetails from "./page/productDetails/ProductDetails";
import Cart from "./page/cart/Cart";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";
import { AnimatePresence } from "framer-motion";
import CategoryPage from "./page/CategoryPage/CategoryPage";
import SearchResults from "./page/SearchResults";
import Favorites from "./page/favorites/Favorites"
import AboutUs from "./page/About/AboutUs";
import Navbar from "./components/Navbar/Navbar";
import Contact from "./page/Contact Us/ContactUs";
import Shop from "./page/Shop/Shop"; 
import FAQ from "./page/FAQ/Faq";
import Login from "./page/Login/Login";
import Register from "./page/Register/Register";

function App() {
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
  
    const hasVisited = localStorage.getItem("hasVisited");
    
    if (hasVisited) {
      setIsFirstVisit(false);
    } else {
    
      localStorage.setItem("hasVisited", "true");
      setIsFirstVisit(true);
    }
  }, []);

  return (
    <>
      <header>
        <Navbar />
      </header>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#e9e9e9",
            borderRadius: "5px",
            padding: "14px",
          },
        }}
      />

      <ScrollToTop />

      <AnimatePresence mode="wait">
        <Routes>
       
          <Route path="/" element={isFirstVisit ? <Navigate to="/register" /> : <Home />} />
          
         
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/category/:category" element={<CategoryPage />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />  
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;