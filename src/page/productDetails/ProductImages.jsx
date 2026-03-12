import React, { useState } from "react";

function ProductImages({ product }) {
  const [activeImg, setActiveImg] = useState(product.images[0]);

  return (
    <div className="imgs_item">

      {/* Main large image */}
      <div className="big_img">
        <img src={activeImg} alt={product.title} />
      </div>

      {/* Thumbnail images */}
      <div className="sm_img">
        {product.images.map((img, index) => (
          <div
            key={index}
            className={`img_div_sm ${activeImg === img ? "active" : ""}`}
            onClick={() => setActiveImg(img)}
          >
            <img src={img} alt={`${product.title} view ${index + 1}`} />
          </div>
        ))}
      </div>

    </div>
  );
}

export default ProductImages;