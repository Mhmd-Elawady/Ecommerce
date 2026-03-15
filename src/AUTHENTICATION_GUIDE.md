/**
 * AUTHENTICATION SETUP GUIDE
 * Complete guide for using the authentication system
 * 
 * ============================================
 * 1. FOLDER STRUCTURE
 * ============================================
 * 
 * src/
 * ├── components/
 * │   ├── Context/
 * │   │   └── AuthContext.jsx         ← Auth State Provider
 * │   ├── PrivateRoute.jsx            ← Protected Routes
 * │   └── LogoutButton.jsx            ← Logout Component
 * ├── hooks/
 * │   ├── useAuth.js                  ← Auth Hook
 * │   └── useUserData.js              ← User Data Hooks (Wishlist, Orders, etc)
 * ├── page/
 * │   └── Login/
 * │       ├── Login.jsx               ← Login Page
 * │       ├── ForgotPassword.jsx      ← Forgot Password
 * │       └── ResetPassword.jsx       ← Reset Password
 * │   └── Register/
 * │       └── Register.jsx            ← Registration Page
 * └── App.jsx                         ← Updated with Routes & PrivateRoute
 * 
 * ============================================
 * 2. HOW TO USE
 * ============================================
 * 
 * A) CHECK IF USER IS LOGGED IN
 * 
 *   import { useAuth } from "./hooks/useAuth";
 *   
 *   function MyComponent() {
 *     const { user, isAuthenticated, loading } = useAuth();
 *     
 *     if (loading) return <p>Loading...</p>;
 *     
 *     if (!isAuthenticated) return <p>Please login</p>;
 *     
 *     return <p>Welcome, {user.email}</p>;
 *   }
 * 
 * B) LOGOUT USER
 * 
 *   import LogoutButton from "./components/LogoutButton";
 *   
 *   function Navbar() {
 *     return <LogoutButton className="navbar-logout-btn" />;
 *   }
 * 
 * C) PROTECT A PAGE (PRIVATE ROUTE)
 * 
 *   // Already implemented in App.jsx for /cart and /favorites
 *   <Route
 *     path="/cart"
 *     element={
 *       <PrivateRoute>
 *         <Cart />
 *       </PrivateRoute>
 *     }
 *   />
 * 
 * D) USE USER DATA (Wishlist, Orders, etc)
 * 
 *   import { useUserWishlist, useUserOrders } from "./hooks/useUserData";
 *   
 *   function ProductCard({ product }) {
 *     const { addToWishlist } = useUserWishlist();
 *     
 *     return (
 *       <button onClick={() => addToWishlist(product.id, product)}>
 *         Add to Wishlist
 *       </button>
 *     );
 *   }
 * 
 * E) ACCESS USER ID FOR DATABASE QUERIES
 * 
 *   import { useAuth } from "./hooks/useAuth";
 *   import { supabase } from "./supabaseClient";
 *   
 *   function UserProfile() {
 *     const { user } = useAuth();  // Get user.id
 *     
 *     useEffect(() => {
 *       const fetchUserData = async () => {
 *         const { data } = await supabase
 *           .from("user_profiles")
 *           .select("*")
 *           .eq("user_id", user.id);  // ← Use user.id here
 *       };
 *   });
 * 
 * ============================================
 * 3. SUPABASE DATABASE SETUP
 * ============================================
 * 
 * Create these tables in your Supabase dashboard:
 * 
 * A) user_profiles table
 *   - id (UUID, primary key)
 *   - user_id (UUID, foreign key to auth.users)
 *   - full_name (text)
 *   - phone (text, nullable)
 *   - email (text)
 *   - avatar_url (text, nullable)
 *   - created_at (timestamp)
 *   - updated_at (timestamp)
 * 
 * B) user_wishlist table
 *   - id (UUID, primary key)
 *   - user_id (UUID, foreign key to auth.users)
 *   - product_id (text)
 *   - product_data (jsonb)
 *   - created_at (timestamp)
 * 
 * C) user_orders table
 *   - id (UUID, primary key)
 *   - user_id (UUID, foreign key to auth.users)
 *   - order_items (jsonb)
 *   - total_price (numeric)
 *   - status (text) - 'pending', 'confirmed', 'shipped', 'delivered'
 *   - created_at (timestamp)
 *   - updated_at (timestamp)
 * 
 * ============================================
 * 4. SESSION PERSISTENCE
 * ============================================
 * 
 * Session is automatically persisted by Supabase!
 * 
 * When user refreshes the page:
 * - AuthContext.useEffect checks for existing session
 * - User stays logged in automatically
 * - Auth state syncs across browser tabs
 * - Session expires after inactivity (configurable in Supabase)
 * 
 * ============================================
 * 5. SOCIAL LOGIN SETUP (Optional)
 * ============================================
 * 
 * In your Supabase project:
 * 1. Go to Authentication > Providers
 * 2. Enable Google, Facebook, Apple
 * 3. Add their credentials (OAuth keys)
 * 4. Social buttons are already functional in Login/Register pages
 * 
 * ============================================
 * 6. FORGOT PASSWORD FLOW
 * ============================================
 * 
 * 1. User visits /forgot-password
 * 2. Enters email → Supabase sends reset link
 * 3. Link includes redirectTo parameter pointing to /reset-password
 * 4. User clicks link in email
 * 5. Supabase session is set automatically in browser
 * 6. User enters new password at /reset-password
 * 7. Password is updated, user can login with new password
 * 
 * Note: You need to configure email templates in Supabase dashboard
 * 
 * ============================================
 * 7. CONNECT EXISTING FEATURES TO AUTH
 * ============================================
 * 
 * Example: Connect Cart to logged-in user
 * 
 *   // Old Cart (localStorage only)
 *   const [cartItems, setCartItems] = useState(() => {
 *     const saved = localStorage.getItem("cartItems");
 *     return saved ? JSON.parse(saved) : [];
 *   });
 * 
 *   // New Cart with user support
 *   import { useAuth } from "./hooks/useAuth";
 *   import { supabase } from "./supabaseClient";
 *   
 *   const [cartItems, setCartItems] = useState(() => {
 *     return localStorage.getItem("cartItems")
 *       ? JSON.parse(localStorage.getItem("cartItems"))
 *       : [];
 *   });
 *   const { user, isAuthenticated } = useAuth();
 *   
 *   // Save to Supabase if authenticated
 *   useEffect(() => {
 *     if (isAuthenticated && user) {
 *       await supabase.from("user_carts").upsert({
 *         user_id: user.id,
 *         items: cartItems,
 *       });
 *     }
 *   }, [cartItems, isAuthenticated, user]);
 *   
 *   // Load from Supabase on login
 *   useEffect(() => {
 *     if (isAuthenticated && user) {
 *       const { data } = await supabase
 *         .from("user_carts")
 *         .select("items")
 *         .eq("user_id", user.id)
 *         .single();
 *       if (data) setCartItems(data.items);
 *     }
 *   }, [isAuthenticated, user]);
 * 
 * ============================================
 * 8. USER OBJECT PROPERTIES
 * ============================================
 * 
 * const { user } = useAuth();
 * 
 * Available properties:
 * - user.id                      // UUID, use for database queries
 * - user.email                   // User email
 * - user.email_confirmed_at      // Email verification status
 * - user.user_metadata           // Custom metadata from signup
 *   - user_metadata.full_name    // Set during registration
 *   - user_metadata.phone        // Set during registration
 * - user.created_at              // Account creation timestamp
 * - user.updated_at              // Last update timestamp
 * - user.app_metadata            // Auth provider info
 * 
 * ============================================
 * 9. ERROR HANDLING
 * ============================================
 * 
 * Common errors:
 * 
 * "Invalid login credentials"
 * → User email doesn't exist or password is wrong
 * 
 * "Email not confirmed"
 * → User needs to verify email before logging in
 * 
 * "User already exists"
 * → Email is already registered
 * 
 * "Password should be 6 characters or more"
 * → Password too short (validation is frontend only, also checked at signup)
 * 
 * All errors are displayed to user in error messages
 * 
 * ============================================
 * 10. ADVANCED: LISTENING TO AUTH CHANGES
 * ============================================
 * 
 * The AuthContext already sets up listeners, but you can also:
 * 
 *   import { supabase } from "./supabaseClient";
 *   
 *   // Listen to auth changes globally
 *   supabase.auth.onAuthStateChange((event, session) => {
 *     console.log(event); // 'SIGNED_IN', 'SIGNED_OUT', 'TOKEN_REFRESHED'
 *     console.log(session?.user.id);
 *   });
 * 
 * ============================================
 */

export default "Authentication Setup Guide - See comments above";
