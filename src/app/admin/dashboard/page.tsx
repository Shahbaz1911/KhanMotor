
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/admin");
    }
  }, [user, router]);

  if (!user) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-black">
      <header className="bg-white dark:bg-gray-900 shadow-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
                <span>Welcome, {user.name}</span>
                <Button onClick={logout} variant="outline" size="sm">
                    Log Out
                </Button>
            </div>
        </div>
      </header>
      <main className="flex-grow p-8">
        <Card>
            <CardHeader>
                <CardTitle>Manage Inventory</CardTitle>
                <CardDescription>
                    Here you can add, edit, and delete vehicle listings. This is a placeholder for now.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>Car management features will be implemented here.</p>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
