import React from 'react';
import './aboutus.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
const AboutUs = () => {
  return (
    <>
      

      <div className="about-container">
        <section className="about-hero">
          <h1>About Our Company</h1>
          <p>
            We are a leading e-commerce platform dedicated to providing quality
            products and exceptional service to customers all over the world.
          </p>
        </section>

        <section className="about-mission">
          <h2>Our Mission & Vision</h2>
          <p>
            <strong>Mission:</strong> To make shopping simple, affordable and
            enjoyable for everyone.
          </p>
          <p>
            <strong>Vision:</strong> To be the most customer-centric online
            retailer where people can find anything they might want to buy online.
          </p>
        </section>

        <section className="about-features">
          <h2>Why Choose Us</h2>
          <ul>
            <li>Wide selection of trusted products</li>
            <li>Fast and reliable delivery</li>
            <li>24/7 customer support</li>
            <li>Secure payment options</li>
            <li>Easy returns and refunds</li>
          </ul>
        </section>

        <section className="about-values">
          <h2>Our Values</h2>
          <p>
            We believe in transparency, integrity, and innovation. Our team works
            tirelessly to ensure every customer can shop with confidence and
            convenience.
          </p>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;