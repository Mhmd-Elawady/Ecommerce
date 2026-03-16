import React from "react";
import { Link } from "react-router-dom";
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube, 
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcApplePay,
  FaPaperPlane
} from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { RiSecurePaymentLine } from "react-icons/ri";
import { TbTruckDelivery } from "react-icons/tb";
import { HiOutlineRefresh } from "react-icons/hi";
import "./footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name: "Terms & Conditions", path: "/terms" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "FAQ", path: "/faq" },
    { name: "Blog", path: "/blog" },
  ];

  const shopLinks = [
    { name: "New Arrivals", path: "/new-arrivals" },
    { name: "Best Sellers", path: "/best-sellers" },
    { name: "Special Offers", path: "/offers" },
    { name: "Gift Cards", path: "/gift-cards" },
    { name: "Track Order", path: "/track-order" },
    { name: "Returns", path: "/returns" },
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, url: "https://facebook.com", name: "Facebook" },
    { icon: <FaTwitter />, url: "https://twitter.com", name: "Twitter" },
    { icon: <FaInstagram />, url: "https://instagram.com", name: "Instagram" },
    { icon: <FaYoutube />, url: "https://youtube.com", name: "YouTube" },
    { icon: <FaLinkedinIn />, url: "https://linkedin.com", name: "LinkedIn" },
  ];

  const paymentMethods = [
    { icon: <FaCcVisa />, name: "Visa" },
    { icon: <FaCcMastercard />, name: "Mastercard" },
    { icon: <FaCcPaypal />, name: "PayPal" },
    { icon: <FaCcApplePay />, name: "Apple Pay" },
    { icon: <MdPayment />, name: "More" },
  ];

  const features = [
    { icon: <TbTruckDelivery />, title: "Free Shipping", desc: "On orders over $100" },
    { icon: <HiOutlineRefresh />, title: "Easy Returns", desc: "30-day return policy" },
    { icon: <RiSecurePaymentLine />, title: "Secure Payment", desc: "100% secure transactions" },
  ];

  return (
    <footer className="footer">
      {/* ===== FEATURES SECTION ===== */}
      <div className="footer-features">
        <div className="container">
          {features.map((feature, index) => (
            <div key={index} className="feature-item">
              <div className="feature-icon">{feature.icon}</div>
              <div className="feature-text">
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== MAIN FOOTER ===== */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Column 1 - About & Newsletter */}
            <div className="footer-col">
              <div className="footer-logo">
                <span className="logo-text">Store<span className="logo-accent">Hub</span></span>
              </div>
              <p className="footer-description">
                Your premier destination for quality products and exceptional shopping experience. We bring you the best brands at competitive prices.
              </p>
              
              {/* Newsletter */}
              <div className="newsletter">
                <h4>Subscribe to Newsletter</h4>
                <form className="newsletter-form">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    required
                  />
                  <button type="submit">
                    <FaPaperPlane />
                  </button>
                </form>
              </div>

              {/* Social Links */}
              <div className="social-links">
                {socialLinks.map((social, index) => (
                  <a 
                    key={index} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2 - Quick Links */}
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.path}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 - Shop */}
            <div className="footer-col">
              <h4>Shop</h4>
              <ul className="footer-links">
                {shopLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.path}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 - Contact Info */}
            <div className="footer-col">
              <h4>Contact Us</h4>
              <ul className="contact-info">
                <li>
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>El Gomhoria Street Mansoura, Dakahlia, Egypt</span>
                </li>
                <li>
                  <FaPhoneAlt className="contact-icon" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li>
                  <FaEnvelope className="contact-icon" />
                  <span>support@storehub.com</span>
                </li>
                <li>
                  <FaClock className="contact-icon" />
                  <span>Mon - Sat: 9:00 AM - 8:00 PM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM FOOTER ===== */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="copyright">
              &copy; {currentYear} StoreHub. All Rights Reserved.
            </div>
            
            {/* Payment Methods */}
            <div className="payment-methods">
              {paymentMethods.map((method, index) => (
                <span key={index} className="payment-icon" title={method.name}>
                  {method.icon}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;