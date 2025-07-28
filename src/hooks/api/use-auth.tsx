import { getCurrentUserQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { AxiosError } from "axios";
import { useAuthStore, isAuthenticated as checkIsAuthenticated } from "@/store/auth-store";

// Export the auth check function from our store
export const isAuthenticated = checkIsAuthenticated;

const useAuth = () => {
  console.log("Auth hook called - checking authentication");
  const { 
    user: storeUser, 
    setUser, 
    setIsLoading, 
    setError,
    isAuthenticated 
  } = useAuthStore();
  
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      console.log("Running auth query function");
      
      // If we have a user in the store, return it directly without API call
      if (storeUser && isAuthenticated) {
        console.log("Using store auth instead of API");
        return { user: storeUser, message: "Authenticated from store" };
      }
      
      try {
        const result = await getCurrentUserQueryFn();
        console.log("Auth result from API:", result);
        
        // Update the auth store with the user
        setUser(result.user);
        
        return result;
      } catch (error: unknown) {
        console.error("Auth query error:", error);
        
        // If API call fails with auth error, clear user in store
        if (error instanceof AxiosError && error.response?.status === 401) {
          setUser(null);
        }
        
        // Update error in store
        setError(error as Error);
        
        throw error;
      }
    },
    enabled: true,
    staleTime: 0,
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  
  // Update loading state in store
  useEffect(() => {
    setIsLoading(query.isLoading);
  }, [query.isLoading, setIsLoading]);
  
  console.log("Auth query status:", query.status);
  
  // Return something that matches the previous interface
  return {
    ...query,
    data: query.data || (storeUser ? { user: storeUser, message: "Authenticated from store" } : undefined)
  };
};

export default useAuth;
