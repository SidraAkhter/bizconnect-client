import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Logo from "@/components/logo";
import GoogleOauthButton from "@/components/auth/google-oauth-button";
import { useMutation } from "@tanstack/react-query";
import { loginMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { UserType } from "@/types/api.type";

// Define a type for the workspace structure
type WorkspaceIdType = string | { _id: string; name?: string; owner?: string; inviteCode?: string };

const SignIn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const setUser = useAuthStore(state => state.setUser);

  const { mutate, isPending } = useMutation({
    mutationFn: loginMutationFn,
  });

  // Check API connectivity on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        console.log("Checking API at:", import.meta.env.VITE_API_BASE_URL);
        
        // Try different ways to connect to the API
        let response = null;
        let connected = false;
        
        // First try: the /auth/login endpoint
        try {
          response = await fetch(import.meta.env.VITE_API_BASE_URL + '/auth/login', {
            method: 'OPTIONS', // OPTIONS is often allowed for CORS preflight
            headers: {
              'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(2000),
          });
          
          if (response.ok || response.status === 405 || response.status === 204) {
            connected = true;
          }
        } catch (e) {
          console.log("First connection attempt failed:", e);
        }
        
        // Second try: without the /api prefix (if it's included in the base URL)
        if (!connected) {
          try {
            const baseWithoutApiPrefix = import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, '');
            response = await fetch(baseWithoutApiPrefix + '/auth/login', {
              method: 'OPTIONS',
              headers: {
                'Content-Type': 'application/json',
              },
              signal: AbortSignal.timeout(2000),
            });
            
            if (response.ok || response.status === 405 || response.status === 204) {
              connected = true;
            }
          } catch (e) {
            console.log("Second connection attempt failed:", e);
          }
        }
        
        // Third try: just ping the base URL
        if (!connected) {
          try {
            response = await fetch(import.meta.env.VITE_API_BASE_URL, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              signal: AbortSignal.timeout(2000),
            });
            
            if (response.ok || response.status === 404) { // 404 on base path might still mean server is up
              connected = true;
            }
          } catch (e) {
            console.log("Third connection attempt failed:", e);
          }
        }
        
        if (connected) {
          console.log('API is online');
          setApiStatus('online');
        } else {
          console.warn('API appears to be offline or unreachable');
          setApiStatus('offline');
        }
      } catch (error) {
        console.error('API connectivity check failed:', error);
        setApiStatus('offline');
      }
    };
    
    checkApiStatus();
  }, []);

  const formSchema = z.object({
    email: z.string().trim().email("Invalid email address").min(1, {
      message: "Email is required",
    }),
    password: z.string().trim().min(1, {
      message: "Password is required",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;

    mutate(values, {
      onSuccess: (data) => {
        const user = data.user;
        console.log("Login successful, user data:", user);
        console.log("Current workspace:", user.currentWorkspace);
        
        try {
          // Set the auth cookie with proper encoding
          const userJson = JSON.stringify(user);
          document.cookie = `auth_user=${userJson};path=/;max-age=86400`;
          
          // Update the auth store - safely cast user data
          // Note: We're setting auth_user cookie with original data and using it
          // for display and navigation, but the store needs the full type.
          // This is a temporary solution until backend returns full user object.
          setUser(user as unknown as UserType);
          
          // Verify cookie was set
          setTimeout(() => {
            const cookieSet = document.cookie.includes('auth_user=');
            console.log("Auth cookie verification:", cookieSet ? "Cookie set successfully" : "Failed to set cookie");
          }, 100);
          
          // Handle the workspace ID with proper type checking
          const currentWorkspace = user.currentWorkspace as WorkspaceIdType;
          const workspaceId = typeof currentWorkspace === 'object' && currentWorkspace._id 
            ? currentWorkspace._id 
            : currentWorkspace;
          
          console.log("Redirecting to workspace:", workspaceId);
          
          // Use timeout to ensure cookie is set before navigation
          setTimeout(() => {
            const decodedUrl = returnUrl ? decodeURIComponent(returnUrl) : null;
            navigate(decodedUrl || `/workspace/${workspaceId}`, { replace: true });
          }, 200);
        } catch (error) {
          console.error("Error during login process:", error);
          toast({
            title: "Login Error",
            description: "There was a problem completing your login. Please try again.",
            variant: "destructive",
          });
        }
      },
      onError: (error) => {
        console.error("Login error:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to log in. Please check your credentials.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Logo linkWrapper={false} />
          ConnectCircle.
        </Link>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>
                Login with your Email or Google account
              </CardDescription>
              {apiStatus === 'offline' && (
                <div className="mt-2 p-2 text-xs bg-red-50 text-red-500 rounded border border-red-200">
                  Warning: API server appears to be offline. Login may not work properly.
                </div>
              )}
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid gap-6">
                    <div className="flex flex-col gap-4">
                      <GoogleOauthButton label="Login" />
                    </div>
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                      <span className="relative z-10 bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                    <div className="grid gap-3">
                      <div className="grid gap-2">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="m@example.com"
                                  className="!h-[48px]"
                                  {...field}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid gap-2">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                                  Password
                                </FormLabel>
                                <a
                                  href="#"
                                  className="ml-auto text-sm underline-offset-4 hover:underline"
                                >
                                  Forgot your password?
                                </a>
                              </div>
                              <FormControl>
                                <Input
                                  type="password"
                                  className="!h-[48px]"
                                  {...field}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full"
                      >
                        {isPending && <Loader className="animate-spin" />}
                        Login
                      </Button>
                    </div>
                    <div className="text-center text-sm">
                      Don&apos;t have an account?{" "}
                      <Link
                        to="/sign-up"
                        className="underline underline-offset-4"
                      >
                        Sign up
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
