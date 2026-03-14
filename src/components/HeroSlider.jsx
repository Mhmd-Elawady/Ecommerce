import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import '../page/home/home.css';

function HeroSlider() {
  const [products, setProducts] = useState([]);

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
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            modules={[Pagination, Autoplay]}
            className="mySwiper"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="content">
                  <h4>Introducing the new</h4>
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <Link to={`/products/${product.id}?source=fakestore`} className="btn">
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