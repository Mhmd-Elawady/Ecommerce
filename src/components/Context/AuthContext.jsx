import React, { createContext, useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../../supabaseClient";
export const AuthContext = createContext(undefined);
export default function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);  
  const [error, setError]     = useState(null);
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);
  const applySession = useCallback((s) => {
    if (!mountedRef.current) return;
    setSession(s ?? null);
    setUser(s?.user ?? null);
  }, []);
  useEffect(() => {

    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        applySession(session);
   
        window.history.replaceState({}, document.title, window.location.pathname);
      });
    }
  }, [applySession]);
  useEffect(() => {
    let initialised = false;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, s) => {
      if (!mountedRef.current) return;
      applySession(s);
      if (initialised) setLoading(false);
      if (event === "TOKEN_REFRESHED") {
        console.debug("[Auth] Token refreshed");
      }
      if (event === "SIGNED_OUT") {
        setError(null);
      }
    });
    const bootstrap = async () => {
      try {
        const { data: { session: current }, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        applySession(current);
      } catch (err) {
        console.error("[Auth] Session check failed:", err.message);
        if (mountedRef.current) setError(err.message);
      } finally {
        initialised = true;
        if (mountedRef.current) setLoading(false);
      }
    };
    bootstrap();
    return () => subscription?.unsubscribe();
  }, [applySession]);
  const logout = useCallback(async () => {
    setError(null);
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      console.error("[Auth] Logout error:", signOutError.message);
      setError(signOutError.message);
      throw signOutError;   
    }
  }, []);
  const clearError = useCallback(() => setError(null), []);
  const value = {
    user,
    session,
    loading,
    error,
    logout,
    clearError,
    isAuthenticated: !!user,
  };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}