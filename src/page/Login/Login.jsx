import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebook,
  FaApple,
} from "react-icons/fa";
import PageTransition from "../../components/PageTransition";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../hooks/useAuth";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect to home if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else {
        navigate("/");
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
        setError(`${provider} login failed: ${socialError.message}`);
      }
    } catch (err) {
      setError(`${provider} login error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="login-page">
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

              {/* Email */}
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

              {/* Password */}
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
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
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

              {/* Submit Button */}
              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? <span className="loading-spinner"></span> : "Sign In"}
              </button>

            </form>

            {/* Social Login */}
            <div className="social-login">
              <p className="divider">
                <span>Or continue with</span>
              </p>
              <div className="social-buttons">
                <button
                  className="social-btn google"
                  type="button"
                  onClick={() => handleSocialLogin("google")}
                  disabled={loading}
                >
                  <FaGoogle />
                  <span>Google</span>
                </button>
                <button
                  className="social-btn facebook"
                  type="button"
                  onClick={() => handleSocialLogin("facebook")}
                  disabled={loading}
                >
                  <FaFacebook />
                  <span>Facebook</span>
                </button>
                <button
                  className="social-btn apple"
                  type="button"
                  onClick={() => handleSocialLogin("apple")}
                  disabled={loading}
                >
                  <FaApple />
                  <span>Apple</span>
                </button>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="signup-link">
              <p>
                Don't have an account?{" "}
                <Link to="/register">Create Account</Link>
              </p>
            </div>

          </div>
        </div>
   
      </div>
    </PageTransition>
  );
}

export default Login;