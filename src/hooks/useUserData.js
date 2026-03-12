import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../supabaseClient";
import { useAuth } from "./useAuth";

// ─── Shared helpers ───────────────────────────────────────────────────────────

/**
 * Generic Supabase fetch with abort-signal support.
 * Returns { data, error } — never throws.
 */
const safeFetch = async (queryFn, signal) => {
  try {
    const result = await queryFn();
    if (signal?.aborted) return { data: null, error: null, aborted: true };
    return result;
  } catch (err) {
    return { data: null, error: err };
  }
};

// ─── useUserProfile ───────────────────────────────────────────────────────────

export const useUserProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setProfile(null);
      return;
    }

    const controller = new AbortController();

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      // Try to fetch existing profile
      const { data, error: fetchError, aborted } = await safeFetch(
        () =>
          supabase
            .from("user_profiles")
            .select("*")
            .eq("user_id", user.id)
            .single(),
        controller.signal
      );

      if (aborted) return;

      // Profile found
      if (!fetchError) {
        setProfile(data);
        setLoading(false);
        return;
      }

      // Profile doesn't exist yet → create it
      if (fetchError.code === "PGRST116") {
        const { data: newProfile, error: createError, aborted: createAborted } =
          await safeFetch(
            () =>
              supabase
                .from("user_profiles")
                .insert([
                  {
                    user_id:   user.id,
                    full_name: user.user_metadata?.full_name || user.email,
                    phone:     user.user_metadata?.phone     || null,
                    email:     user.email,
                  },
                ])
                .select()
                .single(),
            controller.signal
          );

        if (createAborted) return;
        if (createError) {
          setError(createError.message);
          console.error("Error creating profile:", createError);
        } else {
          setProfile(newProfile);
        }
      } else {
        setError(fetchError.message);
        console.error("Error fetching profile:", fetchError);
      }

      setLoading(false);
    };

    fetchProfile();
    return () => controller.abort();
  }, [user, isAuthenticated]);

  /**
   * Update profile fields. Returns true on success, false on failure.
   * Caller is responsible for showing success/error UI (no toast here).
   */
  const updateProfile = useCallback(
    async (updates) => {
      if (!user) return false;

      setLoading(true);
      const { error: updateError } = await safeFetch(() =>
        supabase
          .from("user_profiles")
          .update(updates)
          .eq("user_id", user.id)
      );

      setLoading(false);

      if (updateError) {
        setError(updateError.message);
        console.error("Error updating profile:", updateError);
        throw updateError; // let the caller handle UX
      }

      // Optimistic local update
      setProfile((prev) => ({ ...prev, ...updates }));
      return true;
    },
    [user]
  );

  return { profile, loading, error, updateProfile };
};

// ─── useUserWishlist ──────────────────────────────────────────────────────────

export const useUserWishlist = () => {
  const { user, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setWishlist([]);
      return;
    }

    const controller = new AbortController();

    const fetchWishlist = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError, aborted } = await safeFetch(
        () =>
          supabase
            .from("user_wishlist")
            .select("*")
            .eq("user_id", user.id),
        controller.signal
      );

      if (aborted) return;
      if (fetchError) {
        setError(fetchError.message);
        console.error("Error fetching wishlist:", fetchError);
      } else {
        setWishlist(data ?? []);
      }
      setLoading(false);
    };

    fetchWishlist();
    return () => controller.abort();
  }, [user, isAuthenticated]);

  // Track in-flight product IDs to prevent double-clicks
  const pendingRef = useRef(new Set());

  const isInWishlist = useCallback(
    (productId) => wishlist.some((item) => item.product_id === productId),
    [wishlist]
  );

  const addToWishlist = useCallback(
    async (productId, productData) => {
      if (!user) { toast.error("Please login first!"); return; }
      if (isInWishlist(productId))  { toast("Already in wishlist"); return; }
      if (pendingRef.current.has(productId)) return;

      pendingRef.current.add(productId);

     
      const optimistic = { user_id: user.id, product_id: productId, product_data: productData };
      setWishlist((prev) => [...prev, optimistic]);

      const { error: insertError } = await safeFetch(() =>
        supabase.from("user_wishlist").insert([optimistic])
      );

      pendingRef.current.delete(productId);

      if (insertError) {
        // Roll back
        setWishlist((prev) => prev.filter((i) => i.product_id !== productId));
        console.error("Error adding to wishlist:", insertError);
        toast.error("Failed to add to wishlist");
      } else {
        toast.success("Added to wishlist!");
      }
    },
    [user, isInWishlist]
  );

  const removeFromWishlist = useCallback(
    async (productId) => {
      if (!user) return;
      if (pendingRef.current.has(productId)) return;

      pendingRef.current.add(productId);

      // Optimistic update
      const previous = wishlist.find((i) => i.product_id === productId);
      setWishlist((prev) => prev.filter((i) => i.product_id !== productId));

      const { error: deleteError } = await safeFetch(() =>
        supabase
          .from("user_wishlist")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId)
      );

      pendingRef.current.delete(productId);

      if (deleteError) {
        // Roll back
        if (previous) setWishlist((prev) => [...prev, previous]);
        console.error("Error removing from wishlist:", deleteError);
        toast.error("Failed to remove from wishlist");
      } else {
        toast.success("Removed from wishlist!");
      }
    },
    [user, wishlist]
  );

  const toggleWishlist = useCallback(
    (productId, productData) =>
      isInWishlist(productId)
        ? removeFromWishlist(productId)
        : addToWishlist(productId, productData),
    [isInWishlist, addToWishlist, removeFromWishlist]
  );

  return {
    wishlist,
    loading,
    error,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,     // convenience helper
  };
};

// ─── useUserOrders ────────────────────────────────────────────────────────────

export const useUserOrders = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setOrders([]);
      return;
    }

    const controller = new AbortController();

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError, aborted } = await safeFetch(
        () =>
          supabase
            .from("user_orders")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
        controller.signal
      );

      if (aborted) return;
      if (fetchError) {
        setError(fetchError.message);
        console.error("Error fetching orders:", fetchError);
      } else {
        setOrders(data ?? []);
      }
      setLoading(false);
    };

    fetchOrders();
    return () => controller.abort();
  }, [user, isAuthenticated]);

  const createOrder = useCallback(
    async (orderData) => {
      if (!user) { toast.error("Please login first!"); return null; }

      const { data, error: insertError } = await safeFetch(() =>
        supabase
          .from("user_orders")
          .insert([{ user_id: user.id, ...orderData }])
          .select()
          .single()
      );

      if (insertError) {
        console.error("Error creating order:", insertError);
        toast.error("Failed to create order");
        return null;
      }

      setOrders((prev) => [data, ...prev]);
      toast.success("Order created successfully!");
      return data;
    },
    [user]
  );

  return { orders, loading, error, createOrder };
};