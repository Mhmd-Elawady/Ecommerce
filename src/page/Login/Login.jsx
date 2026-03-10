import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaApple } from "react-icons/fa";
import PageTransition from "../../components/PageTransition";
import Footer from "../../components/Footer/Footer";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);


    setTimeout(() => {
      setLoading(false);
    
      navigate("/");
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <PageTransition>
      <div className="login-page">
        {/* Decorative gradients */}
        <div className="login-gradient login-gradient-1"></div>
        <div className="login-gradient login-gradient-2"></div>
        
        <div className="login-container">
          <div className="login-card">
            {/* Header */}
            <div className="login-header">
              <h1>Welcome Back</h1>
              <p>Sign in to continue to StoreHub</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="login-error">
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">
                  <FaEnvelope className="input-icon" />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <FaLock className="input-icon" />
                  Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot Password?
                </Link>
              </div>

              <button 
                type="submit" 
                className="login-button"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Social Login */}
            <div className="social-login">
              <p className="divider">
                <span>Or continue with</span>
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

            {/* Sign Up Link */}
            <div className="signup-link">
              <p>
                Don't have an account?{" "}
                <Link to="/signup">Create Account</Link>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
}

export default Login;