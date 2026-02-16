import React from 'react';
import Slider from 'react-slick';
import Product from './Product';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './slideProduct.css';

function SlideProduct({ data, title }) {
  if (!data || data.length === 0) return null;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ]
  };

  return (
    <div className="slide_products slide">
      <div className="container">
        <div className="top_slide">
          <h2>{title}</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>

        <Slider {...settings}>
          {data.map(item => (
            <div key={item.id}>
              <Product item={item} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default SlideProduct;