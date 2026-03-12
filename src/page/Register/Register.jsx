import  { useState, useEffect } from "react";
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
  FaCheckCircle,
} from "react-icons/fa";
import PageTransition from "../../components/PageTransition";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../hooks/useAuth";
import "./Register.css";

const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
};

function Register() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect to home if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    if (!agreeTerms) {
      setError("You must agree to the Terms & Conditions.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    const { name, email, password, phone } = formData;

    try {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name, phone },
        },
      });

      if (authError) {
        setError(authError.message);
      } else {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Social login handlers
  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setError("");
    try {
      const { error: socialError } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (socialError) {
        setError(`${provider} signup failed: ${socialError.message}`);
      }
    } catch (err) {
      setError(`${provider} signup error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Show success screen after registration
  if (success) {
    return (
      <PageTransition>
        <div className="register-page">
          <div className="register-container">
            <div className="register-card">
              <div className="register-success">
                <FaCheckCircle className="success-icon" />
                <h3>Registration Successful!</h3>
                <p>Redirecting you to login...</p>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="register-page">
        <div className="register-gradient register-gradient-1"></div>
        <div className="register-gradient register-gradient-2"></div>

        <div className="register-container">
          <div className="register-card">

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
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
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
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
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
                    I agree to the <Link to="/terms">Terms & Conditions</Link>{" "}
                    and <Link to="/privacy">Privacy Policy</Link>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="register-button"
                disabled={loading}
              >
                {loading ? <span className="loading-spinner"></span> : "Create Account"}
              </button>

            </form>

            {/* Social Register */}
            <div className="social-register">
              <p className="divider">
                <span>Or sign up with</span>
              </p>
              <div className="social-buttons">
                <button
                  type="button"
                  className="social-btn google"
                  onClick={() => handleSocialLogin("google")}
                  disabled={loading}
                >
                  <FaGoogle />
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  className="social-btn facebook"
                  onClick={() => handleSocialLogin("facebook")}
                  disabled={loading}
                >
                  <FaFacebook />
                  <span>Facebook</span>
                </button>
                <button
                  type="button"
                  className="social-btn apple"
                  onClick={() => handleSocialLogin("apple")}
                  disabled={loading}
                >
                  <FaApple />
                  <span>Apple</span>
                </button>
              </div>
            </div>

            {/* Login Link */}
            <div className="login-link">
              <p>
                Already have an account? <Link to="/login">Sign In</Link>
              </p>
            </div>

          </div>
        </div>
        
      </div>
    </PageTransition>
  );
}

export default Register;