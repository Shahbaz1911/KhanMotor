
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Trash2, Edit, Car, Settings, User as UserIcon, Loader2, PlusCircle, ArrowLeft, CalendarDays } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { collection, onSnapshot, doc, deleteDoc, query, orderBy, Timestamp } from "firebase/firestore";
import type { Vehicle } from "@/types";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface VehicleWithTimestamp extends Vehicle {
    createdAt?: Timestamp;
}

export default function InventoryClientPage() {
    const { user, logout, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [vehicles, setVehicles] = useState<VehicleWithTimestamp[]>([]);
    const [loading, setLoading] = useState(true);
    
    const firestore = useFirestore();

    const statusFilter = searchParams.get('status') as 'available' | 'sold' | null;

    useEffect(() => {
        if (!authLoading && !user) {
        router.push("/admin");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (!firestore || !user) return;

        setLoading(true);
        const vehiclesCollection = collection(firestore, "vehicles");
        const q = query(vehiclesCollection, orderBy("createdAt", "desc"));
        const vehiclesUnsubscribe = onSnapshot(q, 
            (snapshot) => {
                const vehiclesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VehicleWithTimestamp));
                setVehicles(vehiclesData);
                setLoading(false);
            },
            async (error) => {
                // Fallback for collections without 'createdAt' field yet
                console.warn("Could not query by 'createdAt', fetching without sorting. Add a 'createdAt' field to all vehicle documents.");
                const fallbackUnsubscribe = onSnapshot(vehiclesCollection, (snapshot) => {
                    const vehiclesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VehicleWithTimestamp));
                    setVehicles(vehiclesData);
                    setLoading(false);
                }, async (fallbackError) => {
                     const permissionError = new FirestorePermissionError({
                        path: vehiclesCollection.path,
                        operation: 'list',
                    });
                    errorEmitter.emit('permission-error', permissionError);
                    setLoading(false);
                });
                return fallbackUnsubscribe;
            }
        );
        
        return () => vehiclesUnsubscribe();
    }, [firestore, user]);

    const filteredVehicles = useMemo(() => {
        if (!statusFilter) return vehicles;
        return vehicles.filter(vehicle => vehicle.status === statusFilter);
    }, [vehicles, statusFilter]);

    const handleFilterChange = (status: 'available' | 'sold' | null) => {
        if (status) {
            router.push(`/admin/inventory?status=${status}`);
        } else {
            router.push('/admin/inventory');
        }
    };


    const handleLogout = async () => {
        try {
          await logout();
          toast({
            title: "Logged Out",
            description: "You have been successfully logged out.",
            variant: "destructive"
          })
          router.push('/admin');
        } catch (error) {
          toast({
            title: "Logout Failed",
            description: "Could not log out. Please try again.",
            variant: "destructive"
          })
        }
    }

    const handleDelete = (id: string) => {
        if (!firestore || !user) return;
        if (!window.confirm("Are you sure you want to delete this vehicle? This action cannot be undone.")) return;
        
        const docRef = doc(firestore, "vehicles", id);
        deleteDoc(docRef)
            .then(() => {
                toast({ title: "Vehicle Deleted", description: "The vehicle has been successfully removed from inventory." });
            })
            .catch(async (serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: docRef.path,
                    operation: 'delete',
                });
                errorEmitter.emit('permission-error', permissionError);
            });
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
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.push('/admin/dashboard')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Manage Inventory</h1>
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
            <Card>
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle>Current Inventory</CardTitle>
                        <CardDescription>
                            Manage your existing vehicle listings. Newest vehicles are shown first.
                        </CardDescription>
                    </div>
                    <Button onClick={() => router.push('/admin/inventory/add')} className="w-full sm:w-auto">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Vehicle
                    </Button>
                </CardHeader>
                 <CardContent>
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        <Button variant={statusFilter === null ? 'default' : 'outline'} onClick={() => handleFilterChange(null)}>All ({vehicles.length})</Button>
                        <Button variant={statusFilter === 'available' ? 'default' : 'outline'} onClick={() => handleFilterChange('available')}>Available ({vehicles.filter(v => v.status === 'available').length})</Button>
                        <Button variant={statusFilter === 'sold' ? 'default' : 'outline'} onClick={() => handleFilterChange('sold')}>Sold ({vehicles.filter(v => v.status === 'sold').length})</Button>
                    </div>
                    {loading ? (
                         <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : filteredVehicles.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredVehicles.map(vehicle => (
                                <Card key={vehicle.id} className="overflow-hidden">
                                    <Carousel>
                                        <CarouselContent>
                                        {vehicle.imageUrls?.length > 0 ? vehicle.imageUrls.map((url, i) => (
                                            <CarouselItem key={i}>
                                                <div className="relative aspect-video w-full">
                                                    <Image src={url} alt={`${vehicle.make} ${vehicle.model}`} fill objectFit="cover" />
                                                </div>
                                            </CarouselItem>
                                        )) : (
                                            <CarouselItem>
                                                <div className="relative aspect-video w-full">
                                                    <Image src="https://picsum.photos/seed/placeholder/600/400" alt="Placeholder" fill objectFit="cover" />
                                                </div>
                                            </CarouselItem>
                                        )}
                                        </CarouselContent>
                                    </Carousel>
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-lg">{vehicle.make} {vehicle.model}</h3>
                                                <p className="text-sm text-muted-foreground">{vehicle.year}</p>
                                            </div>
                                            <Badge variant={vehicle.status === 'available' ? "secondary" : "destructive"} className={cn("capitalize", vehicle.status === 'available' && "bg-green-600/90 text-white border-green-700")}>
                                                {vehicle.status || 'N/A'}
                                            </Badge>
                                        </div>
                                        <p className="font-semibold text-lg mt-2">₹{vehicle.price.toLocaleString()}</p>
                                        {vehicle.createdAt && (
                                            <div className="flex items-center text-xs text-muted-foreground mt-2">
                                                <CalendarDays className="mr-2 h-4 w-4" />
                                                <span>{format(vehicle.createdAt.toDate(), "PPP p")}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-end gap-2 mt-4">
                                            <Button variant="outline" size="icon" onClick={() => router.push(`/admin/edit-vehicle/${vehicle.id}`)}>
                                                <Edit className="h-4 w-4" />
                                                <span className="sr-only">Edit</span>
                                            </Button>
                                            <Button variant="destructive" size="icon" onClick={() => handleDelete(vehicle.id)}>
                                                <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <Car className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-medium">No vehicles match filter</h3>
                             <p className="mt-1 text-sm text-muted-foreground">
                                {statusFilter === null 
                                    ? "Get started by adding a new vehicle."
                                    : `There are no ${statusFilter} vehicles in your inventory.`
                                }
                            </p>
                            {statusFilter === null &&
                                <Button className="mt-6" onClick={() => router.push('/admin/inventory/add')}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add New Vehicle
                                </Button>
                            }
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  )
}
