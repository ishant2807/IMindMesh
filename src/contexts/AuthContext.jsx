import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await loadUserProfile(session.user);
      } else {
        setUser(null);
        setUserRole(null);
        sessionStorage.removeItem('user');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await loadUserProfile(session.user);
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (authUser) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, username')
        .eq('id', authUser.id)
        .single();

      const userData = {
        id: authUser.id,
        email: authUser.email,
        role: profile?.role || 'user',
        username: profile?.username || authUser.email.split('@')[0]
      };

      setUser(authUser);
      setUserRole(profile?.role || 'user');
      sessionStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Profile load error:', error);
      setUser(authUser);
      setUserRole('user');
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserRole(null);
      sessionStorage.removeItem('user');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const value = {
    user,
    userRole,
    loading,
    signOut,
    isAuthenticated: !!user,
    isAdmin: userRole === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
