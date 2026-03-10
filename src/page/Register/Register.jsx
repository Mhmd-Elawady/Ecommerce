import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaGoogle, 
  FaFacebook, 
  FaApple,
  FaPhone,
  FaCheckCircle
} from "react-icons/fa";
import PageTransition from "../../components/PageTransition";
import Footer from "../../components/Footer/Footer";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all required fields");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (!agreeTerms) {
      setError("You must agree to the Terms & Conditions");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) return;

    setLoading(true);


    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
  
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <PageTransition>
      <div className="register-page">
        {/* Decorative gradients */}
        <div className="register-gradient register-gradient-1"></div>
        <div className="register-gradient register-gradient-2"></div>
        
        <div className="register-container">
          <div className="register-card">
            {/* Success Message */}
            {success && (
              <div className="register-success">
                <FaCheckCircle className="success-icon" />
                <h3>Registration Successful!</h3>
                <p>Redirecting you to login...</p>
              </div>
            )}

            {!success && (
              <>
                {/* Header */}
                <div className="register-header">
                  <h1>Create Account</h1>
                  <p>Join StoreHub today</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="register-error">
                    <span>{error}</span>
                  </div>
                )}

                {/* Register Form */}
                <form onSubmit={handleSubmit} className="register-form">
                  {/* Full Name */}
                  <div className="form-group">
                    <label htmlFor="name">
                      <FaUser className="input-icon" />
                      Full Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label htmlFor="email">
                      <FaEnvelope className="input-icon" />
                      Email Address <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Phone (Optional) */}
                  <div className="form-group">
                    <label htmlFor="phone">
                      <FaPhone className="input-icon" />
                      Phone Number <span className="optional">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Password */}
                  <div className="form-group">
                    <label htmlFor="password">
                      <FaLock className="input-icon" />
                      Password <span className="required">*</span>
                    </label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <p className="password-hint">Minimum 6 characters</p>
                  </div>

                  {/* Confirm Password */}
                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      <FaLock className="input-icon" />
                      Confirm Password <span className="required">*</span>
                    </label>
                    <div className="password-input-wrapper">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                      />
                      <span>
                        I agree to the <Link to="/terms">Terms & Conditions</Link> and <Link to="/privacy">Privacy Policy</Link>
                      </span>
                    </label>
                  </div>

                  {/* Register Button */}
                  <button 
                    type="submit" 
                    className="register-button"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="loading-spinner"></span>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                {/* Social Register */}
                <div className="social-register">
                  <p className="divider">
                    <span>Or sign up with</span>
                  </p>
                  
                  <div className="social-buttons">
                    <button className="social-btn google">
                      <FaGoogle />
                      <span>Google</span>
                    </button>
                    <button className="social-btn facebook">
                      <FaFacebook />
                      <span>Facebook</span>
                    </button>
                    <button className="social-btn apple">
                      <FaApple />
                      <span>Apple</span>
                    </button>
                  </div>
                </div>

                {/* Login Link */}
                <div className="login-link">
                  <p>
                    Already have an account?{" "}
                    <Link to="/login">Sign In</Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
}

export default Register;