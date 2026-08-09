"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const DEMO_USERS = {
  founder: {
    id: 'user-001',
    email: 'founder@apextech.in',
    name: 'Swathi Solo',
    role: 'user', // 'user' = Department Collaborator / Solo Founder
    roleTitle: 'Solo Founder / Department Collaborator',
    clearance: 'Tier 1 - Prompt Intake & Task Scope',
    clearanceLevel: 1,
    company: 'Apex Technologies Pvt Ltd',
    avatar: 'SS',
    defaultView: 'intake'
  },
  compliance_head: {
    id: 'head-002',
    email: 'head@apextech.in',
    name: 'Rajesh Sharma',
    role: 'compliance_head', // 'compliance_head' = Compliance Team Head
    roleTitle: 'Compliance Head',
    clearance: 'Tier 2 - Full Executive Confidential Clearance',
    clearanceLevel: 2,
    company: 'Apex Technologies Pvt Ltd',
    avatar: 'CH',
    defaultView: 'dashboard'
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for saved session
    try {
      const savedUser = localStorage.getItem('slks_auth_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Default demo login as Compliance Head for seamless start, or keep null for login prompt
        setUser(DEMO_USERS.compliance_head);
      }
    } catch (e) {
      console.error('Failed to load auth session:', e);
      setUser(DEMO_USERS.compliance_head);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, selectedRole = 'compliance_head') => {
    setLoading(true);
    try {
      // API call to auth route
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: selectedRole })
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('slks_auth_user', JSON.stringify(data.user));
        setLoading(false);
        return { success: true, user: data.user };
      } else {
        throw new Error(data.error || 'Invalid credentials');
      }
    } catch (err) {
      // Demo fallback if API is offline
      const targetUser = selectedRole === 'user' ? DEMO_USERS.founder : DEMO_USERS.compliance_head;
      const customUser = {
        ...targetUser,
        email: email || targetUser.email,
        name: email ? email.split('@')[0] : targetUser.name
      };
      setUser(customUser);
      localStorage.setItem('slks_auth_user', JSON.stringify(customUser));
      setLoading(false);
      return { success: true, user: customUser };
    }
  };

  const loginAsDemo = (roleKey) => {
    const targetUser = DEMO_USERS[roleKey] || DEMO_USERS.compliance_head;
    setUser(targetUser);
    localStorage.setItem('slks_auth_user', JSON.stringify(targetUser));
    return targetUser;
  };

  const register = async (name, email, password, role) => {
    setLoading(true);
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      role: role || 'user',
      roleTitle: role === 'compliance_head' ? 'Compliance Head' : 'Solo Founder / Department Collaborator',
      clearance: role === 'compliance_head' ? 'Tier 2 - Full Executive Clearance' : 'Tier 1 - Intake Scope',
      clearanceLevel: role === 'compliance_head' ? 2 : 1,
      company: 'Apex Technologies Pvt Ltd',
      avatar: name.substring(0, 2).toUpperCase(),
      defaultView: role === 'compliance_head' ? 'dashboard' : 'intake'
    };

    setUser(newUser);
    localStorage.setItem('slks_auth_user', JSON.stringify(newUser));
    setLoading(false);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('slks_auth_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      loginAsDemo,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
