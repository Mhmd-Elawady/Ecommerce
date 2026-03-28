import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  FaEnvelope, FaArrowLeft, FaCheckCircle, FaTimesCircle, FaPaperPlane,
} from "react-icons/fa";
import PageTransition from "../../components/PageTransition";
import Footer from "../../components/Footer/Footer";
import { supabase } from "../../supabaseClient";
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
});

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema,
    onSubmit: async (values) => {
      setApiError("");
      setLoading(true);

      try {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          values.email.trim(),
          { redirectTo: `${window.location.origin}/reset-password` }
        );
        if (resetError) throw resetError;
        setSentEmail(values.email);
        setSuccess(true);
      } catch (err) {
        setApiError(err?.message || "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  // ── Success screen ───────────────────────────────────────────────────────────
  if (success) {
    return (
      <PageTransition>
        <div className="login-page">
          <div className="login-gradient login-gradient-1" />
          <div className="login-gradient login-gradient-2" />
          <div className="login-container">
            <div className="login-card">
              <div className="register-success">
                <FaCheckCircle className="success-icon" />
                <h3>Check Your Email</h3>
                <p>
                  We sent a password reset link to{" "}
                  <strong className="success-email">{sentEmail}</strong>.
                  <br />
                  Check your inbox (and spam folder, just in case).
                </p>
                <button
                  className="login-button"
                  style={{ marginTop: 8 }}
                  onClick={() => { setSuccess(false); formik.resetForm(); }}
                >
                  Try a different email
                </button>
                <Link to="/login" className="back-link" style={{ marginTop: 12 }}>
                  <FaArrowLeft /> Back to Login
                </Link>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────
  return (
    <PageTransition>
      <div className="login-page">
        <div className="login-gradient login-gradient-1" />
        <div className="login-gradient login-gradient-2" />

        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h1>Reset Password</h1>
              <p>Enter your email to receive reset instructions</p>
            </div>

            {apiError && (
              <div className="login-error" role="alert" aria-live="assertive">
                <FaTimesCircle style={{ flexShrink: 0 }} />
                <span>{apiError}</span>
              </div>
            )}

            <form onSubmit={formik.handleSubmit} className="login-form" noValidate>
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
                  disabled={loading}
                  autoComplete="email"
                  autoFocus
                  className={formik.touched.email && formik.errors.email ? "input-error" : ""}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="field-error">{formik.errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={loading || !formik.values.email.trim()}
                aria-busy={loading}
              >
                {loading ? (
                  <><span className="loading-spinner" /> Sending…</>
                ) : (
                  <><FaPaperPlane style={{ fontSize: 13 }} /> Send Reset Link</>
                )}
              </button>
            </form>

            <div className="signup-link">
              <Link to="/login" className="back-link">
                <FaArrowLeft /> Back to Login
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
}

export default ForgotPassword;