import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser, FaEnvelope, FaPhone, FaEdit, FaSave,
  FaTimes, FaShoppingBag, FaHeart, FaShieldAlt,
  FaCheckCircle, FaTimesCircle, FaBoxOpen, FaBox
} from "react-icons/fa";
import PageTransition from "../../components/PageTransition";
import Footer from "../../components/Footer/Footer";
import LogoutButton from "../../components/LogoutButton";
import { useAuth } from "../../hooks/useAuth";
import { useUserProfile, useUserOrders, useUserWishlist } from "../../hooks/useUserData";
import "./UserProfile.css";
import toast from "react-hot-toast";

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ name, size = 80 }) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";
  return (
    <div className="profile-avatar" style={{ width: size, height: size }}>
      {name ? <span className="avatar-initials">{initials}</span> : <FaUser />}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    delivered:  { color: "green",  label: "Delivered"  },
    pending:    { color: "yellow", label: "Pending"    },
    cancelled:  { color: "red",    label: "Cancelled"  },
    processing: { color: "blue",   label: "Processing" },
    shipped:    { color: "purple", label: "Shipped"    },
  };
  const { color = "gray", label = status } = map[status?.toLowerCase()] ?? {};
  return <span className={`status-badge status-${color}`}>{label}</span>;
}

function InfoRow({ icon, label, value, mono = false }) {
  return (
    <div className="info-item">
      <span className="info-label">
        {icon && <span className="info-icon">{icon}</span>}
        {label}
      </span>
      <span className={`info-value${mono ? " mono" : ""}`}>{value || "Not set"}</span>
    </div>
  );
}

function SectionCard({ title, icon, children, action }) {
  return (
    <section className="profile-section">
      <div className="section-header">
        <h2 className="section-title">
          {icon && <span className="section-icon">{icon}</span>}
          {title}
        </h2>
        {action}
      </div>
      <div className="section-body">{children}</div>
    </section>
  );
}

function Skeleton({ rows = 3 }) {
  return (
    <div className="skeleton-wrapper">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-row" style={{ width: `${70 + (i % 3) * 10}%` }} />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function UserProfile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useUserProfile();
  const { orders, loading: ordersLoading } = useUserOrders();
  const { wishlist, loading: wishlistLoading } = useUserWishlist();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({ full_name: "", phone: "" });
  const [activeTab, setActiveTab] = useState("info"); // "info" | "orders" | "wishlist"

  // Sync editData whenever profile changes
  useEffect(() => {
    if (profile) {
      setEditData({ full_name: profile.full_name || "", phone: profile.phone || "" });
    }
  }, [profile]);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleEditChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSaveProfile = async () => {
    const trimmed = {
      full_name: editData.full_name.trim(),
      phone: editData.phone.trim(),
    };

    if (!trimmed.full_name) {
      toast.error("Full name is required");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile(trimmed);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error?.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditData({ full_name: profile?.full_name || "", phone: profile?.phone || "" });
    setIsEditing(false);
  };

  // ── Loading state ────────────────────────────────────────────────────────────
  if (authLoading || profileLoading) {
    return (
      <PageTransition>
        <div className="user-profile-page">
          <div className="loading-container">
            <div className="loading-spinner" aria-label="Loading" />
            <p>Loading your profile…</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Auth guard (render-level fallback)
  if (!isAuthenticated) return null;

  const tabs = [
    { id: "info",     label: "Profile",   icon: <FaUser />,        count: null },
    { id: "orders",   label: "Orders",    icon: <FaShoppingBag />, count: orders?.length },
    { id: "wishlist", label: "Wishlist",  icon: <FaHeart />,       count: wishlist?.length },
  ];

  return (
    <PageTransition>
      <div className="user-profile-page">
        <div className="profile-container">

          {/* ── Header ─────────────────────────────────────────────────────── */}
          <header className="profile-header">
            <Avatar name={profile?.full_name} size={80} />
            <div className="profile-title">
              <h1>{profile?.full_name || "Welcome!"}</h1>
              <p className="profile-email">
                <FaEnvelope className="inline-icon" /> {user?.email}
              </p>
            </div>
            <LogoutButton className="profile-logout-btn" />
          </header>

          {/* ── Tab navigation ──────────────────────────────────────────────── */}
          <nav className="profile-tabs" aria-label="Profile sections">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn${activeTab === tab.id ? " active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
                aria-selected={activeTab === tab.id}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count != null && tab.count > 0 && (
                  <span className="tab-count">{tab.count}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="profile-content">

            {/* ── Personal Information ─────────────────────────────────────── */}
            {activeTab === "info" && (
              <>
                <SectionCard
                  title="Personal Information"
                  icon={<FaUser />}
                  action={
                    !isEditing && (
                      <button
                        className="edit-btn"
                        onClick={() => setIsEditing(true)}
                        aria-label="Edit profile"
                      >
                        <FaEdit /> Edit
                      </button>
                    )
                  }
                >
                  {isEditing ? (
                    <div className="edit-form">
                      <div className="form-group">
                        <label htmlFor="full_name">
                          <FaUser /> Full Name <span className="required">*</span>
                        </label>
                        <input
                          id="full_name"
                          type="text"
                          name="full_name"
                          value={editData.full_name}
                          onChange={handleEditChange}
                          placeholder="Your full name"
                          disabled={isSaving}
                          autoFocus
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="phone">
                          <FaPhone /> Phone Number
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          name="phone"
                          value={editData.phone}
                          onChange={handleEditChange}
                          placeholder="e.g. +20 100 000 0000"
                          disabled={isSaving}
                        />
                      </div>

                      <div className="edit-buttons">
                        <button
                          className="save-btn"
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <><span className="btn-spinner" /> Saving…</>
                          ) : (
                            <><FaSave /> Save Changes</>
                          )}
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                        >
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="profile-info">
                      <InfoRow icon={<FaUser />}    label="Full Name" value={profile?.full_name} />
                      <InfoRow icon={<FaEnvelope />} label="Email"     value={user?.email} />
                      <InfoRow icon={<FaPhone />}   label="Phone"     value={profile?.phone} />
                      <InfoRow label="User ID" value={user?.id} mono />
                    </div>
                  )}
                </SectionCard>

                {/* Account info */}
                <SectionCard title="Account Information" icon={<FaShieldAlt />}>
                  <div className="profile-info">
                    <InfoRow
                      label="Member Since"
                      value={user?.created_at
                        ? new Date(user.created_at).toLocaleDateString("en-US", {
                            year: "numeric", month: "long", day: "numeric",
                          })
                        : "Unknown"}
                    />
                    <div className="info-item">
                      <span className="info-label">Email Verified</span>
                      <span className="info-value">
                        {user?.email_confirmed_at
                          ? <><FaCheckCircle className="icon-green" /> Verified</>
                          : <><FaTimesCircle className="icon-red" /> Not verified</>}
                      </span>
                    </div>
                  </div>
                </SectionCard>
              </>
            )}

            {/* ── Orders ───────────────────────────────────────────────────── */}
            {activeTab === "orders" && (
              <SectionCard title="My Orders" icon={<FaShoppingBag />}>
                {ordersLoading ? (
                  <Skeleton rows={4} />
                ) : orders?.length > 0 ? (
                  <div className="orders-list">
                    {orders.map((order) => (
                      <div key={order.id} className="order-item">
                        <div className="order-icon-wrap">
                          {order.status?.toLowerCase() === "delivered"
                            ? <FaBox className="order-icon delivered" />
                            : <FaBoxOpen className="order-icon pending" />}
                        </div>
                        <div className="order-info">
                          <p className="order-id">#{order.id.slice(0, 8).toUpperCase()}</p>
                          <p className="order-date">
                            {new Date(order.created_at).toLocaleDateString("en-US", {
                              year: "numeric", month: "short", day: "numeric",
                            })}
                          </p>
                          <StatusBadge status={order.status} />
                        </div>
                        <div className="order-price">
                          <p className="total">${Number(order.total_price).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <FaShoppingBag className="empty-icon" />
                    <p>No orders yet.</p>
                    <button className="cta-btn" onClick={() => navigate("/shop")}>
                      Start Shopping
                    </button>
                  </div>
                )}
              </SectionCard>
            )}

            {/* ── Wishlist ──────────────────────────────────────────────────── */}
            {activeTab === "wishlist" && (
              <SectionCard title="My Wishlist" icon={<FaHeart />}>
                {wishlistLoading ? (
                  <Skeleton rows={4} />
                ) : wishlist?.length > 0 ? (
                  <div className="wishlist-grid">
                    {wishlist.map((item) => (
                      <div
                        key={item.id}
                        className="wishlist-item"
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate(`/product/${item.product_data?.id}`)}
                        onKeyDown={(e) => e.key === "Enter" && navigate(`/product/${item.product_data?.id}`)}
                        aria-label={`View ${item.product_data?.name}`}
                      >
                        <div className="wishlist-img-wrap">
                          <img
                            src={item.product_data?.image || "/placeholder.jpg"}
                            alt={item.product_data?.name || "Product"}
                            onError={(e) => { e.target.src = "/placeholder.jpg"; }}
                            loading="lazy"
                          />
                        </div>
                        <div className="wishlist-info">
                          <p className="product-name">
                            {item.product_data?.name || "Unnamed Product"}
                          </p>
                          <p className="product-price">
                            ${Number(item.product_data?.price || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <FaHeart className="empty-icon" />
                    <p>Your wishlist is empty.</p>
                    <button className="cta-btn" onClick={() => navigate("/shop")}>
                      Browse Products
                    </button>
                  </div>
                )}
              </SectionCard>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
}

export default UserProfile;