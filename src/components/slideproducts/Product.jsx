import React from 'react'
import { FaStar } from "react-icons/fa6";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { FaCartPlus } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaShare } from "react-icons/fa";

function Product({item}) {
  return (
    <>
      <div className='product'>
        <div className='img_product'>
            <img src={item.images[0]} alt="" />

        </div>
        <p className='name_product'>
           {item.title}
        </p>
        <div className='stars'>
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaRegStarHalfStroke />
        </div>
        <p className='price_product'><span>${item.price}</span></p>
        <div className='icons'>
            <span><FaCartPlus /></span>
            <span><FaRegHeart /></span>
            <span><FaShare /></span>
        </div>
      </div>
    </>
  )
}

export default Product
