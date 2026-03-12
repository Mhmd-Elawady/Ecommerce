/**
 * QUICK REFERENCE - COPY & PASTE CODE SNIPPETS
 * Ready-to-use code for common authentication tasks
 */

// ============================================================================
// 1. CHECK IF USER IS LOGGED IN
// ============================================================================
import { useAuth } from "./hooks/useAuth";

function MyComponent() {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;
  
  return <div>Welcome, {user.email}!</div>;
}

// ============================================================================
// 2. ADD LOGOUT BUTTON TO NAVBAR
// ============================================================================
import LogoutButton from "./components/LogoutButton";

function Navbar() {
  return (
    <nav>
      <h1>My App</h1>
      <LogoutButton />
    </nav>
  );
}

// ============================================================================
// 3. PROTECT A PAGE FROM UNAUTHORIZED ACCESS
// ============================================================================
// Already set up in App.jsx - just wrap with <PrivateRoute>
<Route
  path="/my-page"
  element={
    <PrivateRoute>
      <MyPage />
    </PrivateRoute>
  }
/>

// ============================================================================
// 4. GET USER ID FOR DATABASE QUERIES
// ============================================================================
import { useAuth } from "./hooks/useAuth";
import { supabase } from "./supabaseClient";

function GetUserData() {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState(null);
  
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    
    const fetchData = async () => {
      const { data: result } = await supabase
        .from("my_table")
        .select("*")
        .eq("user_id", user.id);  // ← Use user.id here!
      
      setData(result);
    };
    
    fetchData();
  }, [user, isAuthenticated]);
  
  return <div>{/* render data */}</div>;
}

// ============================================================================
// 5. ADD TO WISHLIST
// ============================================================================
import { useUserWishlist } from "./hooks/useUserData";

function ProductCard({ product }) {
  const { addToWishlist } = useUserWishlist();
  
  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={() => addToWishlist(product.id, product)}>
        ❤️ Add to Wishlist
      </button>
    </div>
  );
}

// ============================================================================
// 6. GET USER WISHLIST
// ============================================================================
import { useUserWishlist } from "./hooks/useUserData";

function Wishlist() {
  const { wishlist, loading, removeFromWishlist } = useUserWishlist();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {wishlist.map((item) => (
        <div key={item.id}>
          <h4>{item.product_data?.name}</h4>
          <button onClick={() => removeFromWishlist(item.product_id)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// 7. GET USER ORDERS
// ============================================================================
import { useUserOrders } from "./hooks/useUserData";

function MyOrders() {
  const { orders, loading, createOrder } = useUserOrders();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {orders.map((order) => (
        <div key={order.id}>
          <p>Order #{order.id}</p>
          <p>Status: {order.status}</p>
          <p>Total: ${order.total_price}</p>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// 8. GET USER PROFILE
// ============================================================================
import { useUserProfile } from "./hooks/useUserData";

function UserDetails() {
  const { profile, loading, updateProfile } = useUserProfile();
  
  if (loading) return <div>Loading...</div>;
  
  const handleUpdate = () => {
    updateProfile({
      full_name: "New Name",
      phone: "123-456-7890"
    });
  };
  
  return (
    <div>
      <p>{profile?.full_name}</p>
      <p>{profile?.phone}</p>
      <button onClick={handleUpdate}>Update Profile</button>
    </div>
  );
}

// ============================================================================
// 9. SAVE CART TO LOGGED-IN USER
// ============================================================================
import { useAuth } from "./hooks/useAuth";
import { supabase } from "./supabaseClient";

function Cart() {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  
  // Load cart from Supabase
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    
    const loadCart = async () => {
      const { data } = await supabase
        .from("user_cart")
        .select("items")
        .eq("user_id", user.id)
        .single();
      
      if (data) setCartItems(data.items);
    };
    
    loadCart();
  }, [isAuthenticated, user]);
  
  // Save cart to Supabase
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    
    const saveCart = async () => {
      await supabase.from("user_cart").upsert({
        user_id: user.id,
        items: cartItems,
        updated_at: new Date(),
      });
    };
    
    const timer = setTimeout(saveCart, 500); // Debounce
    return () => clearTimeout(timer);
  }, [cartItems, isAuthenticated, user]);
  
  return <div>{/* render cart */}</div>;
}

// ============================================================================
// 10. CREATE ORDER AFTER CHECKOUT
// ============================================================================
import { useUserOrders } from "./hooks/useUserData";
import { useAuth } from "./hooks/useAuth";

function Checkout() {
  const { user } = useAuth();
  const { createOrder } = useUserOrders();
  
  const handlePlaceOrder = async (cartItems, totalPrice) => {
    const order = await createOrder({
      order_items: cartItems,
      total_price: totalPrice,
      status: "pending",
    });
    
    if (order) {
      console.log("Order created:", order.id);
      // Redirect to order confirmation
    }
  };
  
  return (
    <button onClick={() => handlePlaceOrder(items, total)}>
      Place Order
    </button>
  );
}

// ============================================================================
// 11. CONDITIONAL RENDERING BASED ON AUTH STATUS
// ============================================================================
import { useAuth } from "./hooks/useAuth";

function Header() {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <header>
      {isAuthenticated ? (
        <div>
          <span>Welcome, {user.email}</span>
          <a href="/profile">My Profile</a>
          <LogoutButton />
        </div>
      ) : (
        <div>
          <a href="/login">Login</a>
          <a href="/register">Sign Up</a>
        </div>
      )}
    </header>
  );
}

// ============================================================================
// 12. AUTO-SYNC DATA ACROSS DEVICES
// ============================================================================
import { useAuth } from "./hooks/useAuth";
import { supabase } from "./supabaseClient";
import { useEffect } from "react";

function SyncData() {
  const { user, isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    
    // Listen for real-time changes
    const subscription = supabase
      .from("user_data")
      .on("*", payload => {
        console.log("Change received!", payload);
        // Update your component state here
      })
      .subscribe();
    
    return () => subscription.unsubscribe();
  }, [isAuthenticated, user]);
  
  return <div>Syncing...</div>;
}

// ============================================================================
// 13. HANDLE AUTHENTICATION ERRORS
// ============================================================================
import { useAuth } from "./hooks/useAuth";
import toast from "react-hot-toast";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (authError) {
      if (authError.message.includes("Invalid")) {
        setError("Wrong email or password");
      } else if (authError.message.includes("Email not confirmed")) {
        setError("Please verify your email first");
      } else {
        setError(authError.message);
      }
      toast.error(error);
    } else {
      toast.success("Login successful!");
      navigate("/");
    }
  };
  
  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}

// ============================================================================
// 14. REDIRECT UNAUTHENTICATED USERS
// ============================================================================
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedPage() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);
  
  if (loading || !isAuthenticated) return null;
  
  return <div>This page is protected!</div>;
}

// ============================================================================
// 15. GET ALL USER META DATA
// ============================================================================
import { useAuth } from "./hooks/useAuth";

function ShowUserData() {
  const { user } = useAuth();
  
  return (
    <div>
      <p>Email: {user?.email}</p>
      <p>ID: {user?.id}</p>
      <p>Name: {user?.user_metadata?.full_name}</p>
      <p>Phone: {user?.user_metadata?.phone}</p>
      <p>Created: {new Date(user?.created_at).toLocaleDateString()}</p>
      <p>Email Confirmed: {user?.email_confirmed_at ? "Yes" : "No"}</p>
    </div>
  );
}

// ============================================================================
// EXPORTS - USE IN YOUR COMPONENTS
// ============================================================================

export {
  // Hooks
  useAuth,           // Get auth status and user
  useUserProfile,    // Get/update user profile
  useUserWishlist,   // Get/manage wishlist
  useUserOrders,     // Get/create orders
  
  // Components
  LogoutButton,      // Logout button
  PrivateRoute,      // Protected route wrapper
  AuthContext,       // Auth state context
  
  // Pages
  Login,             // Login page
  Register,          // Register page
  ForgotPassword,    // Forgot password page
  ResetPassword,     // Reset password page
  UserProfile,       // User profile page
};
