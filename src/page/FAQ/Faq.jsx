import React, { useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import {
  FaQuestionCircle,
  FaHeadset,
  FaTruck,
  FaCreditCard,
  FaExchangeAlt,
} from "react-icons/fa";
import PageTransition from "../../components/PageTransition";
import Footer from "../../components/Footer/Footer";
import "./Faq.css";

const FAQ_DATA = [
  {
    category: "General Questions",
    icon: <FaQuestionCircle />,
    questions: [
      {
        id: 1,
        question: "What is your return policy?",
        answer:
          "We offer a 30-day return policy for all unused items in their original packaging. Simply contact our support team to initiate a return, and we'll provide you with a return shipping label. Refunds are processed within 5-7 business days after we receive the item.",
      },
      {
        id: 2,
        question: "Do you ship internationally?",
        answer:
          "Yes, we ship to over 50 countries worldwide! Shipping costs and delivery times vary by location. You can see the exact shipping cost at checkout. International orders may be subject to customs duties and taxes, which are the responsibility of the customer.",
      },
      {
        id: 3,
        question: "How can I track my order?",
        answer:
          "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and viewing your order history. For guest orders, use the tracking link sent to your email.",
      },
      {
        id: 4,
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and cryptocurrency (Bitcoin, Ethereum). All payments are processed securely through our payment partners.",
      },
    ],
  },
  {
    category: "Orders & Shipping",
    icon: <FaTruck />,
    questions: [
      {
        id: 5,
        question: "How long does shipping take?",
        answer:
          "Standard shipping takes 3-5 business days within the US. Express shipping (1-2 business days) is available at checkout. International shipping typically takes 7-14 business days depending on the destination.",
      },
      {
        id: 6,
        question: "Can I change my shipping address after placing an order?",
        answer:
          "Yes, you can change your shipping address within 2 hours of placing your order. Contact our customer service immediately with your order number and new address. After 2 hours, we cannot guarantee address changes as orders are processed quickly.",
      },
      {
        id: 7,
        question: "Do you offer free shipping?",
        answer:
          "Yes! We offer free standard shipping on all orders over $50 within the continental US. International orders and orders under $50 have a flat shipping rate of $5.99.",
      },
      {
        id: 8,
        question: "What happens if my package is lost or damaged?",
        answer:
          "If your package arrives damaged, please take photos and contact us within 48 hours. For lost packages, we'll work with the carrier to locate it. If it's confirmed lost, we'll issue a full refund or send a replacement immediately.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    icon: <FaExchangeAlt />,
    questions: [
      {
        id: 9,
        question: "How do I return an item?",
        answer:
          "To return an item, log into your account, go to your orders, and select 'Return Item'. Follow the instructions to print a return label. Pack the item securely in its original packaging, attach the label, and drop it off at any carrier location.",
      },
      {
        id: 10,
        question: "How long do refunds take?",
        answer:
          "Refunds are processed within 3-5 business days after we receive and inspect your return. It may take an additional 2-5 business days for the refund to appear on your credit card statement, depending on your bank.",
      },
      {
        id: 11,
        question: "Can I exchange an item instead of returning it?",
        answer:
          "Yes! We offer free exchanges for size or color variations. Select 'Exchange' when processing your return, and we'll ship the new item as soon as we receive the original. Exchanges are processed within 2-3 business days.",
      },
      {
        id: 12,
        question: "Are there any items that cannot be returned?",
        answer:
          "For hygiene reasons, we cannot accept returns on underwear, swimwear, or opened beauty products. Sale items marked 'Final Sale' are also non-returnable. All other items can be returned within 30 days.",
      },
    ],
  },
  {
    category: "Payment & Pricing",
    icon: <FaCreditCard />,
    questions: [
      {
        id: 13,
        question: "Is my payment information secure?",
        answer:
          "Absolutely! We use industry-standard SSL encryption to protect your data. We never store your full credit card details on our servers. All payments are processed through PCI-compliant payment gateways.",
      },
      {
        id: 14,
        question: "Do you offer price matching?",
        answer:
          "Yes, we offer price matching within 7 days of your purchase. If you find a lower price on an identical item from a competitor, contact us with proof and we'll refund the difference.",
      },
      {
        id: 15,
        question: "Are there any hidden fees?",
        answer:
          "No hidden fees! The price you see at checkout is exactly what you pay. International orders may be subject to customs duties, which are calculated and displayed before you complete your purchase.",
      },
      {
        id: 16,
        question: "Do you offer discounts for bulk orders?",
        answer:
          "Yes! For bulk orders of 10+ items, please contact our sales team at sales@example.com for custom pricing. We offer tiered discounts based on order volume.",
      },
    ],
  },
  {
    category: "Account & Support",
    icon: <FaHeadset />,
    questions: [
      {
        id: 17,
        question: "How do I create an account?",
        answer:
          "Click the 'Login' button at the top right and select 'Create Account'. Fill in your email address and create a password. You can also sign up using your Google or Facebook account for faster access.",
      },
      {
        id: 18,
        question: "I forgot my password. What should I do?",
        answer:
          "Click 'Login' then 'Forgot Password'. Enter your email address and we'll send you a password reset link. For security, the link expires after 24 hours.",
      },
      {
        id: 19,
        question: "How can I contact customer support?",
        answer:
          "Our support team is available 24/7 via live chat, email at support@example.com, or phone at +1 (555) 123-4567. Average response time is under 2 hours for email and instant for live chat.",
      },
      {
        id: 20,
        question: "Do you have a physical store?",
        answer:
          "Yes! Visit our flagship store at 123 Luxury Avenue, New York, NY 10001. Hours: Mon-Fri 9am-8pm, Sat 10am-6pm, Sun Closed. We'd love to see you in person!",
      },
    ],
  },
];

const ALL_CATEGORIES = ["all", ...FAQ_DATA.map((cat) => cat.category)];

function Faq() {
  const [openItems, setOpenItems] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const toggleItem = (catIndex, questionId) => {
    const key = `${catIndex}-${questionId}`;
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredData = FAQ_DATA
    .filter((cat) => activeCategory === "all" || cat.category === activeCategory)
    .map((cat, catIndex) => ({
      ...cat,
      catIndex,
      questions: cat.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm) ||
          q.answer.toLowerCase().includes(searchTerm)
      ),
    }))
    .filter((cat) => cat.questions.length > 0);

  return (
    <PageTransition>
      <div className="faq_page">
        <div className="container">

          {/* Header */}
          <div className="faq_header">
            <h1>Frequently Asked Questions</h1>
            <p>
              Find answers to common questions about our products, shipping,
              returns, and more.
            </p>
          </div>

          {/* Search */}
          <div className="faq_search">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              className="search_input"
            />
          </div>

          {/* Category Tabs */}
          <div className="faq_categories">
            {ALL_CATEGORIES.map((category, index) => (
              <button
                key={index}
                className={`category_tab ${activeCategory === category ? "active" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {category === "all" ? "All Questions" : category}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="faq_content">
            {filteredData.length > 0 ? (
              filteredData.map(({ category, icon, questions, catIndex }) => (
                <div key={catIndex} className="faq_category">

                  <div className="category_header">
                    <span className="category_icon">{icon}</span>
                    <h2>{category}</h2>
                  </div>

                  <div className="faq_items">
                    {questions.map((item) => {
                      const isOpen = openItems[`${catIndex}-${item.id}`];
                      return (
                        <div key={item.id} className="faq_item">
                          <button
                            className="faq_question"
                            onClick={() => toggleItem(catIndex, item.id)}
                          >
                            <span>{item.question}</span>
                            {isOpen ? <IoChevronUp /> : <IoChevronDown />}
                          </button>
                          <div className={`faq_answer ${isOpen ? "open" : ""}`}>
                            <p>{item.answer}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              ))
            ) : (
              <div className="no_results">
                <p>No questions found matching your search.</p>
              </div>
            )}
          </div>

          {/* Still Have Questions */}
          <div className="faq_contact">
            <div className="contact_card">
              <FaHeadset className="contact_icon" />
              <h3>Still Have Questions?</h3>
              <p>
                Can't find the answer you're looking for? Our support team is
                here to help 24/7.
              </p>
              <div className="contact_buttons">
                <a href="/contact" className="contact_btn primary">
                  Contact Us
                </a>
                <a
                  href="mailto:support@example.com"
                  className="contact_btn secondary"
                >
                  Email Support
                </a>
              </div>
            </div>
          </div>

        </div>
        <Footer />
      </div>
    </PageTransition>
  );
}

export default Faq;