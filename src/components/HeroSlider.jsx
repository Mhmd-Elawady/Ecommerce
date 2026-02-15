import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/pagination";

function HeroSlider() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products/category/electronics")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);

  const slides = products.length < 2 ? [...products, ...products] : products;

  return (
    <div className="hero">
      <div className="container">
        {products.length > 0 ? (
          <Swiper
            loop={slides.length > 1}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            modules={[Pagination, Autoplay]}
            className="mySwiper"
          >
            {slides.map((product, index) => (
              <SwiperSlide key={index}>
                <div className="content">
                  <h4>Introducing the new</h4>
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <Link to="/" className="btn">
                    Shop Now
                  </Link>
                </div>
                <img src={product.image} alt={product.title} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}

export default HeroSlider;