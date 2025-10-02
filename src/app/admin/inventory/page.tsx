
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Trash2, Edit, Car, Settings, User as UserIcon, Loader2, PlusCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import type { Vehicle } from "@/types";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

export default function InventoryPage() {
    const { user, logout, loading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    
    const firestore = useFirestore();

    useEffect(() => {
        if (!authLoading && !user) {
        router.push("/admin");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (!firestore || !user) return;

        setLoading(true);
        const vehiclesCollection = collection(firestore, "vehicles");
        const vehiclesUnsubscribe = onSnapshot(vehiclesCollection, 
            (snapshot) => {
                const vehiclesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle));
                setVehicles(vehiclesData);
                setLoading(false);
            },
            async (error) => {
                const permissionError = new FirestorePermissionError({
                    path: vehiclesCollection.path,
                    operation: 'list',
                });
                errorEmitter.emit('permission-error', permissionError);
                setLoading(false);
            }
        );
        
        return () => vehiclesUnsubscribe();
    }, [firestore, user]);

    const handleLogout = async () => {
        try {
        await logout();
        router.push('/admin');
        } catch (error) {
        toast({
            title: "Logout Failed",
            description: "Could not log out. Please try again.",
            variant: "destructive"
        })
        }
    }

    const handleDelete = async (id: string) => {
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
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Current Inventory</CardTitle>
                        <CardDescription>
                            Manage your existing vehicle listings.
                        </CardDescription>
                    </div>
                    <Button onClick={() => router.push('/admin/inventory/add')}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Vehicle
                    </Button>
                </CardHeader>
                <CardContent>
                    {loading ? (
                         <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : vehicles.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {vehicles.map(vehicle => (
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
                                            <Badge variant={vehicle.status === 'available' ? "secondary" : "destructive"} className="capitalize">
                                                {vehicle.status || 'N/A'}
                                            </Badge>
                                            </div>
                                        <p className="font-semibold text-lg mt-2">₹{vehicle.price.toLocaleString()}</p>
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
                            <h3 className="mt-4 text-lg font-medium">No vehicles in inventory</h3>
                            <p className="mt-1 text-sm text-muted-foreground">Get started by adding a new vehicle.</p>
                            <Button className="mt-6" onClick={() => router.push('/admin/inventory/add')}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add New Vehicle
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  )
}

    