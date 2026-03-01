import Footer from "../../components/Footer/Footer";
import "./ContactUs.css";
import { IoLocationSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { MdAddCall } from "react-icons/md";

function Contact() {
  const hours = [
  { day: "Monday - Friday", time: "9:00 AM - 8:00 PM" },
  { day: "Saturday", time: "10:00 AM - 6:00 PM" },
  { day: "Sunday", closed: true },
  { day: "Public Holidays", time: "10:00 AM - 4:00 PM" },
  { day: "Ramadan", time: "11:00 AM - 5:00 PM" },
  { day: "Special Events", time: "12:00 PM - 9:00 PM" },
];
  
  return (
    <>
      <main className="contact_page">
        <div className="container">
          {/* Page Header */}
          <div className="page_header">
            <h1>Get in Touch</h1>
            <p>
              We'd love to hear from you. Reach out with any questions or
              inquiries.
            </p>
          </div>

          {/* Contact Grid */}
          <div className="contact_grid">
            {/* Left Side  */}
            <div className="info_wrapper">
              {/* Visit Us */}
              <div className="info_card">
                <div className="icon">
                  <IoLocationSharp />
                </div>
                <h3>Visit Us</h3>
                <p>
                  El Gomhoria Street <br />
                  Mansoura, Dakahlia, Egypt
                </p>
                <a href="#" className="detail_link">
                  Get Directions
                </a>
              </div>

              {/* Email Us */}
              <div className="info_card">
                <div className="icon">
                  <MdEmail />
                </div>
                <h3>Email Us</h3>
                <p>
                  info@luxurystore.com <br />
                  support@luxurystore.com
                </p>
                <a href="#" className="detail_link">
                  Send Message
                </a>
              </div>

              {/* Call Us */}
              <div className="info_card">
                <div className="icon">
                  <MdAddCall />
                </div>
                <h3>Call Us</h3>
                <p>
                  +20 100 123 4567 <br />
                  +20 112 987 6543
                </p>
                <a href="#" className="detail_link">
                  Schedule a Call
                </a>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="form_wrapper">
              <h2>Send a Message</h2>
              <p>Our team typically responds within 24 hours.</p>

              <form className="contact_form">
                <div className="form_row">
                  <div className="form_group">
                    <label>First Name</label>
                    <input type="text" placeholder="Mohamed" required />
                  </div>
                  <div className="form_group">
                    <label>Last Name</label>
                    <input type="text" placeholder="Elawady" required />
                  </div>
                </div>

                <div className="form_group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="mohamed@example.com"
                    required
                  />
                </div>

                <div className="form_group">
                  <label>Subject</label>
                  <input type="text" placeholder="General Inquiry" required />
                </div>

                <div className="form_group">
                  <label>Message</label>
                  <textarea
                    placeholder="I would like to ask about..."
                    required
                  />
                </div>

                <button type="submit" className="submit_btn">
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Map */}
          <div className="map_section">
            <iframe
              title="Store Location - Mansoura"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3434.5046416626136!2d31.036495!3d31.041053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f79c8b7d6e1f5f%3A0x4b9b8c7b5b6c4b2!2sMansoura%2C%20Dakahlia%20Governorate%2C%20Egypt!5e0!3m2!1sen!2seg!4v1700000000000"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Business Hours */}
          <div className="hours_section">
            <h3>Business Hours</h3>

            <div className="hours_grid">
              {hours.map((item, index) => (
                <div className="hour_item" key={index}>
                  <div className="day">{item.day}</div>
                  {item.closed ? (
                    <div className="closed">Closed</div>
                  ) : (
                    <div className="time">{item.time}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Contact;
