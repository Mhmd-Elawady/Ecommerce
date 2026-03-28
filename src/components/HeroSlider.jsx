import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import "../page/home/home.css";

// Animation variants
const contentVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.15,
    },
  },
  exit: { opacity: 0, x: -40, transition: { duration: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const imageVariants = {
  hidden: { opacity: 0, x: 80, scale: 0.92 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
  exit: { opacity: 0, x: 60, scale: 0.95, transition: { duration: 0.3 } },
};

// Animated slide component
function AnimatedSlide({ product }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Small delay to trigger animation after mount
    const timer = setTimeout(() => setActive(true), 50);
    return () => {
      clearTimeout(timer);
      setActive(false);
    };
  }, [product.id]);

  return (
    <AnimatePresence mode="wait">
      {active && (
        <>
          {/* Content side */}
          <motion.div
            className="content"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key={`content-${product.id}`}
          >
            <motion.h4 variants={itemVariants}>Introducing the new</motion.h4>
            <motion.h3 variants={itemVariants}>{product.title}</motion.h3>
            <motion.p variants={itemVariants}>{product.description}</motion.p>
            <motion.div variants={itemVariants}>
              <Link
                to={`/products/${product.id}?source=fakestore`}
                className="btn"
              >
                Shop Now
              </Link>
            </motion.div>
          </motion.div>

          {/* Image side */}
          <motion.img
            key={`img-${product.id}`}
            src={product.image}
            alt={product.title}
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
          />
        </>
      )}
    </AnimatePresence>
  );
}

function HeroSlider() {
  const [products, setProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products/category/electronics")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="hero">
      <div className="container">
        {products.length > 0 ? (
          <Swiper
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            modules={[Pagination, Autoplay]}
            className="mySwiper"
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          >
            {products.map((product, index) => (
              <SwiperSlide key={product.id}>
                {/* Only animate the active slide */}
                {index === activeIndex ? (
                  <AnimatedSlide product={product} />
                ) : (
                  <>
                    <div className="content">
                      <h4>Introducing the new</h4>
                      <h3>{product.title}</h3>
                      <p>{product.description}</p>
                      <Link
                        to={`/products/${product.id}?source=fakestore`}
                        className="btn"
                      >
                        Shop Now
                      </Link>
                    </div>
                    <img src={product.image} alt={product.title} />
                  </>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          // Loading animation
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            Loading...
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default HeroSlider;