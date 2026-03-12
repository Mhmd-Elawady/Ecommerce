import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

const LogoutButton = ({ className = "logout-btn", showLabel = true }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleClick = () => {
    if (!confirming) {
      
      setConfirming(true);
  
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    handleLogout();
  };

  const handleLogout = async () => {
    setConfirming(false);
    setLoading(true);
    try {
      await logout();
      toast.success("Logged out successfully!");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const label = loading ? "Logging out…" : confirming ? "Sure?" : "Logout";

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`${className}${confirming ? " confirming" : ""}`}
      title={confirming ? "Click again to confirm logout" : "Logout"}
      aria-label={label}
      aria-busy={loading}
    >
      <FaSignOutAlt aria-hidden="true" />
      {showLabel && <span>{label}</span>}
    </button>
  );
};

export default LogoutButton;