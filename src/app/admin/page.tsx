
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
import { AlertTriangle } from "lucide-react";


export default function AdminLoginPage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/admin/dashboard");
    }
  }, [user, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (email === "shahbazkhan19111@gmail.com" && password === "Dream@7866") {
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      login({
        name: "Admin User",
        email: "shahbazkhan19111@gmail.com",
        avatarUrl: "https://picsum.photos/seed/admin/100/100",
      });
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-black p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4">
                 <Image 
                    src="https://armanautoxperts-in.vercel.app/armanautoxperts/arman.png"
                    alt="Arman Autoxperts Logo"
                    width={150}
                    height={150}
                    className="w-36 h-auto"
                />
            </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Sign in to manage your vehicle inventory.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Login Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </div>
                <Button
                    type="submit"
                    className="w-full"
                >
                    Sign In
                </Button>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
