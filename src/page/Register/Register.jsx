import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaPhone,
  FaCheckCircle,
} from "react-icons/fa";
import PageTransition from "../../components/PageTransition";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../hooks/useAuth";
import "./Register.css";

const blockedDomains = [
  "mailinator.com", "tempmail.com", "guerrillamail.com", "10minutemail.com",
  "throwam.com", "yopmail.com", "trashmail.com", "fakeinbox.com",
  "sharklasers.com", "guerrillamailblock.com", "grr.la", "guerrillamail.info",
  "spam4.me", "dispostable.com", "mailnull.com", "spamgourmet.com",
];

const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),

  email: Yup.string()
    .required("Email is required")
    .min(6, "Email must be at least 6 characters") 
    .max(50, "Email must not exceed 50 characters")
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

  phone: Yup.string().matches(
    /^01[0125][0-9]{8}$/,
    "Please enter a valid Egyptian phone number"
  ),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(64, "Password must not exceed 64 characters")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),

  terms: Yup.boolean().oneOf(
    [true],
    "You must agree to the Terms & Conditions"
  ),
});

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

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
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      setApiError("");
      setLoading(true);

      try {
        const { error: authError } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: { full_name: values.name, phone: values.phone },
          },
        });

        if (authError) {
          setApiError(authError.message);
        } else {
          setSuccess(true);
          setTimeout(() => navigate("/login"), 2000);
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
        setApiError(`${provider} signup failed: ${socialError.message}`);
      }
    } catch (err) {
      setApiError(`${provider} signup error: ${err.message}`);
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

            {/* API Error Message */}
            {apiError && (
              <div className="register-error">
                <span>{apiError}</span>
              </div>
            )}

            {/* Register Form */}
            <form onSubmit={formik.handleSubmit} className="register-form">

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
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.name && formik.errors.name ? "input-error" : ""}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="field-error">{formik.errors.name}</p>
                )}
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
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.email && formik.errors.email ? "input-error" : ""}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="field-error">{formik.errors.email}</p>
                )}
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
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.phone && formik.errors.phone ? "input-error" : ""}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="field-error">{formik.errors.phone}</p>
                )}
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
                {formik.touched.password && formik.errors.password ? (
                  <p className="field-error">{formik.errors.password}</p>
                ) : (
                  <p className="password-hint">Between 6 and 64 characters</p>
                )}
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
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.confirmPassword && formik.errors.confirmPassword ? "input-error" : ""}
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
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p className="field-error">{formik.errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={formik.values.terms}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <span>
                    I agree to the <Link to="/terms">Terms & Conditions</Link>{" "}
                    and <Link to="/privacy">Privacy Policy</Link>
                  </span>
                </label>
                {formik.touched.terms && formik.errors.terms && (
                  <p className="field-error">{formik.errors.terms}</p>
                )}
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