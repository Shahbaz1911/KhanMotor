
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useTheme } from "next-themes";


export default function AdminLoginPage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { theme } = useTheme();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [logoSrc, setLogoSrc] = useState("https://armanautoxperts-in.vercel.app/armanautoxperts/motokhanwhite.png");

  useEffect(() => {
    setLogoSrc(theme === 'dark' 
      ? "https://armanautoxperts-in.vercel.app/armanautoxperts/herologo.png" 
      : "https://armanautoxperts-in.vercel.app/armanautoxperts/motokhanwhite.png");
  }, [theme]);


  useEffect(() => {
    if (user) {
      router.push("/admin/dashboard");
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Login Successful",
        description: "welcome back!",
        variant: "success",
      });
      router.push("/admin/dashboard");
    } catch (err: any) {
       let errorMessage = "an unknown error occurred.";
       // Check for Firebase-specific error codes
       if (err.code) {
           switch (err.code) {
               case 'auth/user-not-found':
               case 'auth/wrong-password':
               case 'auth/invalid-credential':
                   errorMessage = 'invalid email or password. please check your credentials or create an account in the firebase console.';
                   break;
               case 'auth/invalid-email':
                   errorMessage = 'please enter a valid email address.';
                   break;
               default:
                   errorMessage = 'login failed. please try again later.';
                   break;
           }
       }
       setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-black p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4">
                 <Image 
                    src={logoSrc}
                    alt="Arman Autoxperts Logo"
                    width={150}
                    height={150}
                    className="w-36 h-auto"
                />
            </div>
          <CardTitle className="text-2xl uppercase">Admin Login</CardTitle>
          <CardDescription>
            sign in to manage your vehicle inventory.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle className="uppercase">Login Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                        id="email"
                        type="email"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign In'}
                </Button>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
