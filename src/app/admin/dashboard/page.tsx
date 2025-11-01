
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Car, Users, Settings, User as UserIcon, Loader2, BadgeCheck, TrendingDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import type { Vehicle } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";


export default function AdminDashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const firestore = useFirestore();
  const { theme } = useTheme();

  // State for vehicle stats
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  
  const [logoSrc, setLogoSrc] = useState("https://delhi.motorkhan.com/images/motorkhanlighttheme.png");

  useEffect(() => {
    setLogoSrc(theme === 'dark' 
      ? "https://delhi.motorkhan.com/images/motorkhandarktheme.png" 
      : "https://delhi.motorkhan.com/images/motorkhanlighttheme.png");
  }, [theme]);


  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/admin");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!firestore || !user) return;

     setLoadingVehicles(true);
    const vehiclesCollection = collection(firestore, "vehicles");
    const vehiclesUnsubscribe = onSnapshot(vehiclesCollection, 
        (snapshot) => {
            const vehiclesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle));
            setVehicles(vehiclesData);
            setLoadingVehicles(false);
        },
        async (error) => {
            const permissionError = new FirestorePermissionError({
                path: vehiclesCollection.path,
                operation: 'list',
            });
            errorEmitter.emit('permission-error', permissionError);
            setLoadingVehicles(false);
        }
    );
    
    return () => {
        vehiclesUnsubscribe();
    };
  }, [firestore, user]);

  const inventoryStats = useMemo(() => {
    const total = vehicles.length;
    const sold = vehicles.filter(v => v.status === 'sold').length;
    const available = total - sold;
    return { total, sold, available };
  }, [vehicles]);


  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "you have been successfully logged out.",
        variant: "destructive"
      })
      router.push('/admin');
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "could not log out. please try again.",
        variant: "destructive"
      })
    }
  }

  if (authLoading || !user || !firestore) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-black">
      <header className="bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/10 sticky top-0 z-30">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 relative">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 hidden sm:block uppercase">Admin Dashboard</h1>
            </div>
            
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Link href="/">
                <Image 
                    src={logoSrc}
                    alt="Motor Khan Logo"
                    width={150}
                    height={150}
                    className="w-16 md:w-20 h-auto"
                />
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatarUrl} alt={user.displayName || 'Admin'} />
                      <AvatarFallback>{user.displayName?.substring(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
        </div>
      </header>
      <main className="flex-grow p-4 md:p-8">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:px-8">
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="uppercase">Welcome, {user.displayName}</CardTitle>
                    <CardDescription>select a section below to manage your website content.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                         <Button
                            variant={'outline'}
                            onClick={() => router.push('/admin/inventory')}
                            className="flex-1 w-full"
                        >
                            <Car className="mr-2 h-4 w-4" />
                            Manage Inventory
                        </Button>
                         <Button
                            variant={'default'}
                            className="flex-1 w-full"
                             onClick={() => router.push('/admin/gallery')}
                        >
                            <Users className="mr-2 h-4 w-4" />
                            Manage Customer Gallery
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <section>
              <h2 className="text-2xl font-bold mb-4 uppercase">Inventory Stats</h2>
                {loadingVehicles ? (
                    <div className="flex justify-center items-center h-24">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card onClick={() => router.push('/admin/inventory')} className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium uppercase">Total Vehicles</CardTitle>
                                <Car className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{inventoryStats.total}</div>
                            </CardContent>
                        </Card>
                         <Card onClick={() => router.push('/admin/inventory?status=available')} className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium uppercase">Available</CardTitle>
                                <BadgeCheck className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{inventoryStats.available}</div>
                            </CardContent>
                        </Card>
                         <Card onClick={() => router.push('/admin/inventory?status=sold')} className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium uppercase">Sold</CardTitle>
                                <TrendingDown className="h-4 w-4 text-red-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{inventoryStats.sold}</div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </section>
        </div>
      </main>
    </div>
  );
}
