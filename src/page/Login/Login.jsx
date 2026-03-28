import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import PageTransition from "../../components/PageTransition";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../hooks/useAuth";
import "./Login.css";

const blockedDomains = [
  "mailinator.com", "tempmail.com", "guerrillamail.com", "10minutemail.com",
  "throwam.com", "yopmail.com", "trashmail.com", "fakeinbox.com",
  "sharklasers.com", "guerrillamailblock.com", "grr.la", "guerrillamail.info",
  "spam4.me", "dispostable.com", "mailnull.com", "spamgourmet.com",
];

const validationSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .max(254, "Email must not exceed 254 characters")
    .test("no-spaces", "Email must not contain spaces", (value) => {
      return value ? !/\s/.test(value) : true;
    })
    .test("valid-tld", "Email must have a valid domain extension (.com, .net, etc.)", (value) => {
      if (!value) return true;
      const tldRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
      return tldRegex.test(value);
    })
    .test("no-special-chars", "Email contains invalid characters", (value) => {
      if (!value) return true;
      const validEmailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
      return validEmailRegex.test(value);
    })
    .test("no-blocked-domain", "This email domain is not allowed", (value) => {
      if (!value) return true;
      const domain = value.split("@")[1]?.toLowerCase();
      return !blockedDomains.includes(domain);
    })
    .email("Please enter a valid email address"),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(64, "Password must not exceed 64 characters"),
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect to home if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      setApiError("");
      setLoading(true);

      try {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (authError) {
          setApiError(authError.message);
        } else {
          navigate("/");
        }
      } catch (err) {
        setApiError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  // Social login handlers
  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setApiError("");
    try {
      const { error: socialError } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (socialError) {
        setApiError(`${provider} login failed: ${socialError.message}`);
      }
    } catch (err) {
      setApiError(`${provider} login error: ${err.message}`);
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

            {/* API Error Message */}
            {apiError && (
              <div className="login-error">
                <span>{apiError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={formik.handleSubmit} className="login-form">

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">
                  <FaEnvelope className="input-icon" />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.email && formik.errors.email ? "input-error" : ""}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="field-error">{formik.errors.email}</p>
                )}
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
                    name="password"
                    placeholder="Enter your password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.password && formik.errors.password ? "input-error" : ""}
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
                {formik.touched.password && formik.errors.password && (
                  <p className="field-error">{formik.errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formik.values.rememberMe}
                    onChange={formik.handleChange}
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