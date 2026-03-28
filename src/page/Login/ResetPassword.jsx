import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import PageTransition from "../../components/PageTransition";
import Footer from "../../components/Footer/Footer";
import { supabase } from "../../supabaseClient";
import "./Login.css";

const validationSchema = Yup.object({
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(64, "Password must not exceed 64 characters"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setApiError("");
      setLoading(true);

      try {
        const { error: updateError } = await supabase.auth.updateUser({
          password: values.password,
        });

        if (updateError) {
          setApiError(updateError.message);
        } else {
          setSuccess(true);
          setTimeout(() => navigate("/login"), 3000);
        }
      } catch (err) {
        setApiError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  if (success) {
    return (
      <PageTransition>
        <div className="login-page">
          <div className="login-container">
            <div className="login-card">
              <div className="register-success">
                <FaCheckCircle className="success-icon" />
                <h3>Password Reset Successful!</h3>
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
      <div className="login-page">
        <div className="login-gradient login-gradient-1"></div>
        <div className="login-gradient login-gradient-2"></div>

        <div className="login-container">
          <div className="login-card">
            {/* Header */}
            <div className="login-header">
              <h1>Create New Password</h1>
              <p>Enter your new password below</p>
            </div>

            {/* API Error Message */}
            {apiError && (
              <div className="login-error">
                <span>{apiError}</span>
              </div>
            )}

            {/* Reset Password Form */}
            <form onSubmit={formik.handleSubmit} className="login-form">
              {/* New Password */}
              <div className="form-group">
                <label htmlFor="password">
                  <FaLock className="input-icon" />
                  New Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter new password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.password && formik.errors.password ? "input-error" : ""}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
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
                  Confirm Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.confirmPassword && formik.errors.confirmPassword ? "input-error" : ""}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p className="field-error">{formik.errors.confirmPassword}</p>
                )}
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? <span className="loading-spinner"></span> : "Reset Password"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </PageTransition>
  );
}

export default ResetPassword;
