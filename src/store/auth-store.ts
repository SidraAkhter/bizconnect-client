import { create } from 'zustand';
import { UserType } from '@/types/api.type';

interface AuthState {
  user: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  
  // Actions
  setUser: (user: UserType | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
  logout: () => void;
}

// Helper to get auth cookie
const getAuthCookie = (): string | null => {
  try {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const targetCookie = cookies.find(cookie => cookie.startsWith('auth_user='));
    
    if (!targetCookie) return null;
    
    // Get the cookie value (everything after the first '=')
    return targetCookie.substring('auth_user='.length) || null;
  } catch (err) {
    console.error("Error getting auth cookie:", err);
    return null;
  }
};

// Helper to parse user from cookie
const getUserFromCookie = (): UserType | null => {
  const cookie = getAuthCookie();
  if (!cookie) return null;
  
  try {
    // Try parsing directly first
    try {
      return JSON.parse(cookie);
    } catch (e) {
      // If direct parsing fails, try decoding first
      const decodedCookie = decodeURIComponent(cookie);
      return JSON.parse(decodedCookie);
    }
  } catch (err) {
    console.error("Error parsing auth cookie:", err);
    return null;
  }
};

// Initialize the store with the user from cookie if available
const initialUser = getUserFromCookie();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  isAuthenticated: !!initialUser, 
  isLoading: false,
  error: null,
  
  // Action to set user
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user
  }),
  
  // Action to set authentication state
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  
  // Action to set loading state
  setIsLoading: (isLoading) => set({ isLoading }),
  
  // Action to set error
  setError: (error) => set({ error }),
  
  // Logout action
  logout: () => {
    // Clear cookie
    document.cookie = "auth_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // Clear localStorage item and trigger event
    localStorage.removeItem('logout');
    localStorage.setItem('logout-event', Date.now().toString());
    
    // Reset state
    set({
      user: null,
      isAuthenticated: false,
      error: null
    });
    
    // Force a page reload to clear all app state
    window.location.href = '/';
  }
}));

// Listen for storage events (cross-tab logout)
window.addEventListener('storage', (e) => {
  if (e.key === 'logout-event') {
    // If another tab triggered logout, update this tab too
    useAuthStore.getState().setUser(null);
    useAuthStore.getState().setIsAuthenticated(false);
  }
});

// Export a simple check function for convenience
export const isAuthenticated = (): boolean => {
  return useAuthStore.getState().isAuthenticated;
}; 