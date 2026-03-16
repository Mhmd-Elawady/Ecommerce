import React from 'react';
import Slider from 'react-slick';
import Product from './Product';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './slideProduct.css';
import './Slider.css'
function SlideProduct({ data, title }) {
  if (!data || data.length === 0) return null;
const settings = {
  dots: true,
  infinite: true,
  speed: 300,
  slidesToShow: 5,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2500,
  responsive: [
    { breakpoint: 1200, settings: { slidesToShow: 4, slidesToScroll: 1 } },
    { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
    { breakpoint: 992,  settings: { slidesToShow: 2, slidesToScroll: 1, arrows: false } },
    { breakpoint: 768,  settings: { slidesToShow: 2, slidesToScroll: 1, arrows: false } },
    { breakpoint: 600,  settings: { slidesToShow: 1, slidesToScroll: 1, arrows: false } },
    { breakpoint: 480,  settings: { slidesToShow: 1, slidesToScroll: 1, arrows: false } },
  ]
};
  return (
    <div className="slide_products slide">
      <div className="container">
        <div className="top_slide">
          <h2>{title}</h2>
          
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