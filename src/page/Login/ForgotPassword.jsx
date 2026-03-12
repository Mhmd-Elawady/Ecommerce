import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEnvelope, FaArrowLeft, FaCheckCircle, FaTimesCircle, FaPaperPlane,
} from "react-icons/fa";
import PageTransition from "../../components/PageTransition";
import Footer from "../../components/Footer/Footer";
import { supabase } from "../../supabaseClient";
import "./Login.css";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

function ForgotPassword() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError(""); // clear error on type
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo: `${window.location.origin}/reset-password` }
      );
      if (resetError) throw resetError;
      setSuccess(true);
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
                  <strong className="success-email">{email}</strong>.
                  <br />
                  Check your inbox (and spam folder, just in case).
                </p>
                <button
                  className="login-button"
                  style={{ marginTop: 8 }}
                  onClick={() => { setSuccess(false); setEmail(""); }}
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

            {error && (
              <div className="login-error" role="alert" aria-live="assertive">
                <FaTimesCircle style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form" noValidate>
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
                  value={email}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="email"
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={loading || !email.trim()}
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