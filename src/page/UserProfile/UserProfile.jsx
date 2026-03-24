import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser, FaEnvelope, FaPhone, FaEdit, FaSave,
  FaTimes, FaShoppingBag, FaShieldAlt,
  FaCheckCircle, FaTimesCircle,
  FaCamera, FaLock, FaEye, FaEyeSlash, FaKey,
  FaShoppingCart, FaPlus, FaMinus, FaTrash
} from "react-icons/fa";
import PageTransition from "../../components/PageTransition";
import Footer from "../../components/Footer/Footer";
import LogoutButton from "../../components/LogoutButton";
import { useAuth } from "../../hooks/useAuth";
import { useUserProfile } from "../../hooks/useUserData";
import { CartContext } from "../../components/Context/CartContext"; 
import "./UserProfile.css";
import toast from "react-hot-toast";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (name) =>
  name ? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "?";

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ name, src, size = 80, onUpload }) {
  const fileRef = useRef();
  const [preview, setPreview] = useState(src || null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5 MB"); return; }
    setPreview(URL.createObjectURL(file));
    if (onUpload) {
      setUploading(true);
      try { await onUpload(file); toast.success("Profile photo updated!"); }
      catch { toast.error("Failed to upload photo"); setPreview(src || null); }
      finally { setUploading(false); }
    }
  };

  return (
    <div
      className={`profile-avatar${onUpload ? " clickable" : ""}${uploading ? " uploading" : ""}`}
      style={{ width: size, height: size }}
      onClick={() => onUpload && fileRef.current?.click()}
      title={onUpload ? "Change profile photo" : undefined}
    >
      {preview
        ? <img src={preview} alt={name || "avatar"} className="avatar-img" />
        : <span className="avatar-initials">{getInitials(name)}</span>}
      {onUpload && (
        <div className="avatar-overlay">
          {uploading ? <span className="avatar-spinner" /> : <FaCamera className="avatar-camera-icon" />}
        </div>
      )}
      {onUpload && <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />}
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

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

// ─── Info Row ─────────────────────────────────────────────────────────────────

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

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ rows = 3 }) {
  return (
    <div className="skeleton-wrapper">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-row" style={{ width: `${70 + (i % 3) * 10}%` }} />
      ))}
    </div>
  );
}

// ─── Password Input ───────────────────────────────────────────────────────────

function PasswordInput({ id, name, value, onChange, placeholder, disabled }) {
  const [show, setShow] = useState(false);
  return (
    <div className="password-input-wrap">
      <input id={id} type={show ? "text" : "password"} name={name}
        value={value} onChange={onChange} placeholder={placeholder}
        disabled={disabled} autoComplete="new-password" />
      <button type="button" className="toggle-pw" onClick={() => setShow(s => !s)} tabIndex={-1}>
        {show ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
}

// ─── Password Strength ────────────────────────────────────────────────────────

function PasswordStrength({ password }) {
  const score = [
    password.length >= 8, /[A-Z]/.test(password),
    /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;
  const colors = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  if (!password) return null;
  return (
    <div className="pw-strength">
      <div className="pw-bars">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="pw-bar"
            style={{ background: n <= score ? colors[score] : "rgba(255,255,255,0.1)" }} />
        ))}
      </div>
      <span className="pw-label" style={{ color: colors[score] }}>{labels[score]}</span>
    </div>
  );
}

// ─── Change Password Form ─────────────────────────────────────────────────────

function ChangePasswordForm({ onClose }) {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const handle = useCallback((e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }, []);
  const submit = async (e) => {
    e.preventDefault();
    if (!form.current) { toast.error("Enter your current password"); return; }
    if (form.next.length < 8) { toast.error("New password must be at least 8 characters"); return; }
    if (form.next !== form.confirm) { toast.error("Passwords do not match"); return; }
    setSaving(true);
    try {
      // 🔌 await supabase.auth.updateUser({ password: form.next })
      await new Promise(r => setTimeout(r, 1200));
      toast.success("Password changed successfully!");
      onClose?.();
    } catch (err) {
      toast.error(err?.message || "Failed to change password");
    } finally { setSaving(false); }
  };
  return (
    <form className="edit-form" onSubmit={submit} noValidate>
      <div className="form-group">
        <label htmlFor="pw-current"><FaLock /> Current Password</label>
        <PasswordInput id="pw-current" name="current" value={form.current} onChange={handle}
          placeholder="Enter current password" disabled={saving} />
      </div>
      <div className="form-group">
        <label htmlFor="pw-next"><FaKey /> New Password</label>
        <PasswordInput id="pw-next" name="next" value={form.next} onChange={handle}
          placeholder="At least 8 characters" disabled={saving} />
        <PasswordStrength password={form.next} />
      </div>
      <div className="form-group">
        <label htmlFor="pw-confirm"><FaKey /> Confirm New Password</label>
        <PasswordInput id="pw-confirm" name="confirm" value={form.confirm} onChange={handle}
          placeholder="Repeat new password" disabled={saving} />
        {form.confirm && form.next !== form.confirm && (
          <p className="field-error"><FaTimesCircle /> Passwords do not match</p>
        )}
        {form.confirm && form.next === form.confirm && form.confirm.length > 0 && (
          <p className="field-ok"><FaCheckCircle /> Passwords match</p>
        )}
      </div>
      <div className="edit-buttons">
        <button type="submit" className="save-btn" disabled={saving}>
          {saving ? <><span className="btn-spinner" /> Saving…</> : <><FaSave /> Change Password</>}
        </button>
        <button type="button" className="cancel-btn" onClick={onClose} disabled={saving}>
          <FaTimes /> Cancel
        </button>
      </div>
    </form>
  );
}



// ─── Cart Tab ─────────────────────────────────────────────────────────────────

function CartTab() {
  const navigate = useNavigate();
  const {
    cartItems, removeFromCart,
    increaseQuantity, decreaseQuantity
  } = useContext(CartContext);

  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="empty-state">
        <FaShoppingCart className="empty-icon" />
        <p>Your cart is empty.</p>
        <button className="cta-btn" onClick={() => navigate("/shop")}>Start Shopping</button>
      </div>
    );
  }

  return (
    <div className="cart-list">
      {cartItems.map((item) => (
        <div key={item.id} className="cart-item">
          <img
            src={item.thumbnail || item.image || "/placeholder.jpg"}
            alt={item.title || item.name}
            className="cart-item-img"
            onClick={() => navigate(`/product/${item.id}`)}
            onError={(e) => { e.target.src = "/placeholder.jpg"; }}
          />

          {/* بيانات */}
          <div className="cart-item-info">
            <p className="cart-item-name" onClick={() => navigate(`/product/${item.id}`)}>
              {item.title || item.name}
            </p>
            <p className="cart-item-price">${Number(item.price).toFixed(2)}</p>
          </div>

          {/* Quantity */}
          <div className="cart-qty">
            <button onClick={() => decreaseQuantity(item.id)}><FaMinus /></button>
            <span>{item.quantity}</span>
            <button onClick={() => increaseQuantity(item.id)}><FaPlus /></button>
          </div>

          {/* Subtotal */}
          <p className="cart-subtotal">${(item.price * item.quantity).toFixed(2)}</p>

          {/* Remove */}
          <button className="btn-remove-cart" onClick={() => removeFromCart(item.id)}>
            <FaTrash />
          </button>
        </div>
      ))}

      {/* Total */}
      <div className="cart-total-row">
        <span>Total</span>
        <span className="cart-total-price">${total.toFixed(2)}</span>
      </div>

      <button className="cta-btn" onClick={() => navigate("/cart")}>
        Go to Checkout
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function UserProfile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile, uploadAvatar } = useUserProfile();

  // ← بنجيب الأرقام من CartContext للـ badges
  const { cartItems } = useContext(CartContext);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({ full_name: "", phone: "" });
  const [activeTab, setActiveTab] = useState("info");
  const [showPwForm, setShowPwForm] = useState(false);

  useEffect(() => {
    if (profile) setEditData({ full_name: profile.full_name || "", phone: profile.phone || "" });
  }, [profile]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate("/login", { replace: true });
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => { setShowPwForm(false); }, [activeTab]);

  const handleEditChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditData(p => ({ ...p, [name]: value }));
  }, []);

  const handleSaveProfile = async () => {
    const trimmed = { full_name: editData.full_name.trim(), phone: editData.phone.trim() };
    if (!trimmed.full_name) { toast.error("Full name is required"); return; }
    setIsSaving(true);
    try {
      await updateProfile(trimmed);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err?.message || "Failed to update profile");
    } finally { setIsSaving(false); }
  };

  const handleCancelEdit = () => {
    setEditData({ full_name: profile?.full_name || "", phone: profile?.phone || "" });
    setIsEditing(false);
  };

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
  if (!isAuthenticated) return null;

  const tabs = [
    { id: "info", label: "Profile", icon: <FaUser />, count: null },
    { id: "cart", label: "Cart", icon: <FaShoppingCart />, count: cartItems.length },
    { id: "security", label: "Security", icon: <FaShieldAlt />, count: null },
  ];

  return (
    <PageTransition>
      <div className="user-profile-page">
        <div className="profile-container">

          {/* ── Header ─────────────────────────────────────────────────── */}
          <header className="profile-header">
            <Avatar name={profile?.full_name} src={profile?.avatar_url} size={90} onUpload={uploadAvatar} />
            <div className="profile-title">
              <h1>{profile?.full_name || "Welcome!"}</h1>
              <p className="profile-email"><FaEnvelope className="inline-icon" /> {user?.email}</p>
              <p className="profile-since">
                Member since {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long" })
                  : "—"}
              </p>
            </div>

            {/* Stats من CartContext مباشرة */}
            <div className="header-stats">
              <div className="stat-pill" onClick={() => setActiveTab("cart")} style={{ cursor: "pointer" }}>
                <span className="stat-num">{cartItems.length}</span>
                <span className="stat-label">Cart</span>
              </div>
            </div>

            <LogoutButton className="profile-logout-btn" />
          </header>

          {/* ── Tabs ───────────────────────────────────────────────────── */}
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

            {/* ══ PROFILE TAB ════════════════════════════════════════════ */}
            {activeTab === "info" && (
              <>
                <SectionCard
                  title="Personal Information" icon={<FaUser />}
                  action={
                    !isEditing && (
                      <button className="edit-btn" onClick={() => setIsEditing(true)}>
                        <FaEdit /> Edit
                      </button>
                    )
                  }
                >
                  {isEditing ? (
                    <div className="edit-form">
                      <div className="form-group">
                        <label htmlFor="full_name"><FaUser /> Full Name <span className="required">*</span></label>
                        <input id="full_name" type="text" name="full_name" value={editData.full_name}
                          onChange={handleEditChange} placeholder="Your full name" disabled={isSaving} autoFocus />
                      </div>
                      <div className="form-group">
                        <label htmlFor="phone"><FaPhone /> Phone Number</label>
                        <input id="phone" type="tel" name="phone" value={editData.phone}
                          onChange={handleEditChange} placeholder="e.g. +20 100 000 0000" disabled={isSaving} />
                      </div>
                      <div className="edit-buttons">
                        <button className="save-btn" onClick={handleSaveProfile} disabled={isSaving}>
                          {isSaving ? <><span className="btn-spinner" /> Saving…</> : <><FaSave /> Save Changes</>}
                        </button>
                        <button className="cancel-btn" onClick={handleCancelEdit} disabled={isSaving}>
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="profile-info">
                      <InfoRow icon={<FaUser />} label="Full Name" value={profile?.full_name} />
                      <InfoRow icon={<FaEnvelope />} label="Email" value={user?.email} />
                      <InfoRow icon={<FaPhone />} label="Phone" value={profile?.phone} />
                    </div>
                  )}
                </SectionCard>

                <SectionCard title="Account Information" icon={<FaShieldAlt />}>
                  <div className="profile-info">
                    <InfoRow
                      label="Member Since"
                      value={user?.created_at
                        ? new Date(user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
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



            {/* ══ CART TAB — من CartContext ══════════════════════════════ */}
            {activeTab === "cart" && (
              <SectionCard title="My Cart" icon={<FaShoppingCart />}>
                <CartTab />
              </SectionCard>
            )}

            {/* ══ SECURITY TAB ═══════════════════════════════════════════ */}
            {activeTab === "security" && (
              <>
                <SectionCard
                  title="Change Password" icon={<FaLock />}
                  action={
                    !showPwForm && (
                      <button className="edit-btn" onClick={() => setShowPwForm(true)}>
                        <FaEdit /> Change
                      </button>
                    )
                  }
                >
                  {showPwForm ? (
                    <ChangePasswordForm onClose={() => setShowPwForm(false)} />
                  ) : (
                    <div className="security-info">
                      <div className="security-row">
                        <div className="security-icon-wrap"><FaKey /></div>
                        <div>
                          <p className="security-label">Password</p>
                          <p className="security-value">••••••••••••</p>
                        </div>
                      </div>
                      <p className="security-hint">
                        Use a strong password with a mix of letters, numbers, and symbols.
                      </p>
                    </div>
                  )}
                </SectionCard>

                <SectionCard title="Session Information" icon={<FaShieldAlt />}>
                  <div className="profile-info">
                    <div className="info-item">
                      <span className="info-label">Email Verified</span>
                      <span className="info-value">
                        {user?.email_confirmed_at
                          ? <><FaCheckCircle className="icon-green" /> Verified</>
                          : <><FaTimesCircle className="icon-red" /> Not verified</>}
                      </span>
                    </div>
                    <InfoRow
                      label="Last Sign In"
                      value={user?.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleString("en-US")
                        : "Unknown"}
                    />
                  </div>
                </SectionCard>
              </>
            )}

          </div>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
}

export default UserProfile;