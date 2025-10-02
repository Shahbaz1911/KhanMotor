
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { LogOut, Trash2, Edit, Car, Users, Settings, User as UserIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import type { Vehicle } from "@/types";
import { uploadToCloudinary } from "@/lib/actions";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";


interface GalleryItem {
    id: string;
    imageUrl: string;
    caption: string;
}

export default function AdminDashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("inventory");
  
  const firestore = useFirestore();

  // State for vehicle form
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [newVehicle, setNewVehicle] = useState({ make: "", model: "", year: "", price: "", status: "available", description: "", features: "" });
  const [vehicleImageFile, setVehicleImageFile] = useState<File | null>(null);
  const [vehicleImageUrl, setVehicleImageUrl] = useState<string | null>(null);
  const [isVehicleUploading, setIsVehicleUploading] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // State for customer gallery form
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [newGalleryItem, setNewGalleryItem] = useState({ caption: "" });
  const [customerImageFile, setCustomerImageFile] = useState<File | null>(null);
  const [customerImageUrl, setCustomerImageUrl] = useState<string | null>(null);
  const [isCustomerUploading, setIsCustomerUploading] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [isGalleryEditDialogOpen, setIsGalleryEditDialogOpen] = useState(false);


  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/admin");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!firestore || !user) return;

    const vehiclesCollection = collection(firestore, "vehicles");
    const vehiclesUnsubscribe = onSnapshot(vehiclesCollection, 
        (snapshot) => {
            const vehiclesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle));
            setVehicles(vehiclesData);
        },
        async (error) => {
            const permissionError = new FirestorePermissionError({
                path: vehiclesCollection.path,
                operation: 'list',
            });
            errorEmitter.emit('permission-error', permissionError);
        }
    );

    const galleryCollection = collection(firestore, "gallery");
    const galleryUnsubscribe = onSnapshot(galleryCollection, 
        (snapshot) => {
            const galleryData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem));
            setGalleryItems(galleryData);
        },
        async (error) => {
            const permissionError = new FirestorePermissionError({
                path: galleryCollection.path,
                operation: 'list',
            });
            errorEmitter.emit('permission-error', permissionError);
        }
    );
    
    return () => {
        vehiclesUnsubscribe();
        galleryUnsubscribe();
    };
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'vehicle' | 'customer' | 'edit-vehicle' | 'edit-gallery') => {
    const file = e.target.files?.[0] || null;

    if (type === 'vehicle') {
        setVehicleImageFile(file);
        if (file) setVehicleImageUrl(URL.createObjectURL(file));
        else setVehicleImageUrl(null);
    } else if (type === 'customer') {
        setCustomerImageFile(file);
        if(file) setCustomerImageUrl(URL.createObjectURL(file));
        else setCustomerImageUrl(null)
    } else if (type === 'edit-vehicle' && editingVehicle) {
        setVehicleImageFile(file); // reuse for edit
        if(file) setEditingVehicle({ ...editingVehicle, imageUrl: URL.createObjectURL(file) });
    } else if (type === 'edit-gallery' && editingGalleryItem) {
        setCustomerImageFile(file); // reuse for edit
        if(file) setEditingGalleryItem({ ...editingGalleryItem, imageUrl: URL.createObjectURL(file) });
    }
  };

  const handleFileUpload = async (type: 'vehicle' | 'customer') => {
    const file = type === 'vehicle' ? vehicleImageFile : customerImageFile;
    const setIsUploading = type === 'vehicle' ? setIsVehicleUploading : setIsCustomerUploading;

    if (!file) {
      toast({ title: "No file selected", description: "Please select a file to upload.", variant: "destructive" });
      return null;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const result = await uploadToCloudinary(formData);

      if (result.success && result.url) {
        toast({ title: "Upload Successful!", description: "Image is ready to be saved." });
        return result.url;
      } else {
        throw new Error(result.error || "Cloudinary upload failed.");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Could not upload the image.";
      toast({ title: "Upload Failed", description: errorMessage, variant: "destructive" });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !user) return;
    if (!vehicleImageFile) {
        toast({ title: "Image required", description: "Please upload a vehicle image.", variant: "destructive" });
        return;
    }

    const uploadedImageUrl = await handleFileUpload('vehicle');
    
    if (!uploadedImageUrl) {
        toast({ title: "Image upload failed", description: "Could not add vehicle without a valid image URL.", variant: "destructive" });
        return;
    }
    
    const vehicleData = {
        ...newVehicle,
        year: Number(newVehicle.year),
        price: Number(newVehicle.price),
        features: newVehicle.features.split('\n').filter(f => f.trim() !== ""),
        imageUrl: uploadedImageUrl,
        aiHint: 'new vehicle',
        createdAt: serverTimestamp(),
    };
    
    const vehiclesCollection = collection(firestore, "vehicles");
    addDoc(vehiclesCollection, vehicleData)
        .then(() => {
            toast({ title: "Vehicle Added", description: `${newVehicle.make} ${newVehicle.model} has been added to inventory.` });
            setNewVehicle({ make: "", model: "", year: "", price: "", status: "available", description: "", features: "" });
            setVehicleImageFile(null);
            setVehicleImageUrl(null);
        })
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: vehiclesCollection.path,
                operation: 'create',
                requestResourceData: vehicleData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
  }

  const handleUpdateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !editingVehicle || !user) return;

    let uploadedImageUrl = editingVehicle.imageUrl;
    if (vehicleImageFile) {
        const newUrl = await handleFileUpload('vehicle');
        if (newUrl) {
            uploadedImageUrl = newUrl;
        } else {
            toast({ title: "Image upload failed", description: "Could not update vehicle image.", variant: "destructive" });
            return;
        }
    }
    
    const vehicleData = {
        ...editingVehicle,
        year: Number(editingVehicle.year),
        price: Number(editingVehicle.price),
        features: Array.isArray(editingVehicle.features) ? editingVehicle.features : editingVehicle.features.split('\n').filter(f => f.trim() !== ""),
        imageUrl: uploadedImageUrl,
    };
    
    const vehicleRef = doc(firestore, "vehicles", editingVehicle.id);
    updateDoc(vehicleRef, vehicleData)
        .then(() => {
            toast({ title: "Vehicle Updated", description: `${editingVehicle.make} ${editingVehicle.model} has been updated.` });
            setIsEditDialogOpen(false);
            setEditingVehicle(null);
            setVehicleImageFile(null);
        })
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: vehicleRef.path,
                operation: 'update',
                requestResourceData: vehicleData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
  }
  
  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !user) return;
     if (!customerImageFile) {
        toast({ title: "Image required", description: "Please upload a customer image.", variant: "destructive" });
        return;
    }

    const uploadedImageUrl = await handleFileUpload('customer');
    
    if (!uploadedImageUrl) {
        toast({ title: "Image upload failed", description: "Could not add gallery item without a valid image URL.", variant: "destructive" });
        return;
    }

    const galleryData = {
        caption: newGalleryItem.caption,
        imageUrl: uploadedImageUrl,
        createdAt: serverTimestamp(),
    };

    const galleryCollection = collection(firestore, "gallery");
    addDoc(galleryCollection, galleryData)
        .then(() => {
            toast({ title: "Gallery Item Added", description: `A new photo has been added to the gallery.` });
            setNewGalleryItem({ caption: "" });
            setCustomerImageFile(null);
            setCustomerImageUrl(null);
        })
        .catch(async (serverError) => {
             const permissionError = new FirestorePermissionError({
                path: galleryCollection.path,
                operation: 'create',
                requestResourceData: galleryData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
  }

  const handleUpdateGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !editingGalleryItem || !user) return;

    let uploadedImageUrl = editingGalleryItem.imageUrl;
    if (customerImageFile) { // Check if a new file was selected for the gallery item
        const newUrl = await handleFileUpload('customer');
        if (newUrl) {
            uploadedImageUrl = newUrl;
        } else {
            toast({ title: "Image upload failed", description: "Could not update gallery image.", variant: "destructive" });
            return;
        }
    }

    const galleryData = {
        caption: editingGalleryItem.caption,
        imageUrl: uploadedImageUrl,
    };

    const galleryRef = doc(firestore, "gallery", editingGalleryItem.id);
    updateDoc(galleryRef, galleryData)
        .then(() => {
            toast({ title: "Gallery Item Updated", description: `The gallery item has been updated.` });
            setIsGalleryEditDialogOpen(false);
            setEditingGalleryItem(null);
            setCustomerImageFile(null);
        })
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: galleryRef.path,
                operation: 'update',
                requestResourceData: galleryData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
  }

  const handleDelete = async (collectionName: string, id: string) => {
    if (!firestore || !user) return;
    if (!window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) return;
    
    const docRef = doc(firestore, collectionName, id);
    deleteDoc(docRef)
        .then(() => {
             toast({ title: "Item Deleted", description: "The item has been successfully removed from the database." });
        })
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: docRef.path,
                operation: 'delete',
            });
            errorEmitter.emit('permission-error', permissionError);
        });
  }

  const openEditDialog = (vehicle: Vehicle) => {
    setEditingVehicle({
        ...vehicle,
        features: Array.isArray(vehicle.features) ? vehicle.features.join('\n') : vehicle.features
    });
    setIsEditDialogOpen(true);
    setVehicleImageFile(null);
  };
  
  const openGalleryEditDialog = (item: GalleryItem) => {
    setEditingGalleryItem(item);
    setIsGalleryEditDialogOpen(true);
    setCustomerImageFile(null);
  };

  if (authLoading || !user || !firestore) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'inventory':
        return (
            <>
                <Card className="shadow-lg mb-8">
                    <CardHeader>
                        <CardTitle>Add New Vehicle</CardTitle>
                        <CardDescription>
                            Fill out the form below to add a new car to your inventory.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddVehicle} className="grid gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="make">Make</Label>
                                    <Input id="make" placeholder="e.g., Audi" value={newVehicle.make} onChange={e => setNewVehicle({...newVehicle, make: e.target.value})} required/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="model">Model</Label>
                                    <Input id="model" placeholder="e.g., R8 Spyder" value={newVehicle.model} onChange={e => setNewVehicle({...newVehicle, model: e.target.value})} required/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="year">Year</Label>
                                    <Input id="year" type="number" placeholder="e.g., 2023" value={newVehicle.year} onChange={e => setNewVehicle({...newVehicle, year: e.target.value})} required/>
                                </div>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price ($)</Label>
                                    <Input id="price" type="number" placeholder="e.g., 180000" value={newVehicle.price} onChange={e => setNewVehicle({...newVehicle, price: e.target.value})} required/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={newVehicle.status} onValueChange={value => setNewVehicle({...newVehicle, status: value})}>
                                        <SelectTrigger id="status">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="available">Available</SelectItem>
                                            <SelectItem value="sold">Sold</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" placeholder="Enter a brief description of the vehicle..." value={newVehicle.description} onChange={e => setNewVehicle({...newVehicle, description: e.target.value})} required/>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="features">Features (one per line)</Label>
                                <Textarea id="features" placeholder="e.g., V10 Engine\nConvertible\nBang & Olufsen Sound" value={newVehicle.features} onChange={e => setNewVehicle({...newVehicle, features: e.target.value})} required/>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="car-image">Car Image</Label>
                                {vehicleImageUrl && !isVehicleUploading && <div className="mt-4"><Image src={vehicleImageUrl} alt="Uploaded vehicle" width={200} height={150} className="rounded-lg object-cover" /></div>}
                                {isVehicleUploading && (
                                    <div className="flex items-center gap-2 mt-4">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Uploading...</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-4 mt-2">
                                    <Input id="car-image-upload" type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'vehicle')} className="flex-1" />
                                </div>
                                <p className="text-xs text-muted-foreground">Select a file. PNG, JPG, or WEBP (MAX. 10MB).</p>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={isVehicleUploading}>
                                    {isVehicleUploading ? 'Please wait...' : 'Add Vehicle'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Current Inventory</CardTitle>
                        <CardDescription>
                            Manage your existing vehicle listings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {vehicles.length > 0 ? (
                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {vehicles.map(vehicle => (
                                    <Card key={vehicle.id} className="overflow-hidden">
                                        <div className="relative h-48 w-full">
                                            <Image src={vehicle.imageUrl} alt={`${vehicle.make} ${vehicle.model}`} fill objectFit="cover" />
                                        </div>
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
                                            <p className="font-semibold text-lg mt-2">${vehicle.price.toLocaleString()}</p>
                                            <div className="flex justify-end gap-2 mt-4">
                                                <Button variant="outline" size="icon" onClick={() => openEditDialog(vehicle)}>
                                                    <Edit className="h-4 w-4" />
                                                    <span className="sr-only">Edit</span>
                                                </Button>
                                                <Button variant="destructive" size="icon" onClick={() => handleDelete('vehicles', vehicle.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">Delete</span>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                           <p className="text-muted-foreground text-center py-8">No vehicles in inventory yet.</p>
                        )}
                    </CardContent>
                </Card>
            </>
        );
      case 'customers':
        return (
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Manage Happy Customer Gallery</CardTitle>
                    <CardDescription>
                        Upload, edit, or delete photos for the customer gallery section on your homepage.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddGalleryItem} className="grid gap-6 mb-8 border-b pb-8">
                        <div className="space-y-2">
                            <Label htmlFor="caption">Caption</Label>
                            <Input id="caption" placeholder="e.g., Mr. Khan with his new Honda City" value={newGalleryItem.caption} onChange={e => setNewGalleryItem({ caption: e.target.value})} required/>
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="customer-image">Customer Photo</Label>
                             {customerImageUrl && !isCustomerUploading && <div className="mt-4"><Image src={customerImageUrl} alt="Uploaded customer" width={200} height={150} className="rounded-lg object-cover" /></div>}
                             {isCustomerUploading && (
                                <div className="flex items-center gap-2 mt-4">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Uploading...</span>
                                </div>
                            )}
                            <div className="flex items-center gap-4 mt-2">
                                <Input id="customer-image-upload" type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'customer')} className="flex-1" />
                            </div>
                             <p className="text-xs text-muted-foreground">Select a file. PNG, JPG, or WEBP (MAX. 10MB).</p>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isCustomerUploading}>
                                {isCustomerUploading ? 'Please wait...' : 'Add to Gallery'}
                            </Button>
                        </div>
                    </form>
                    
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Existing Gallery Photos</h3>
                        {galleryItems.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {galleryItems.map(item => (
                                    <Card key={item.id} className="overflow-hidden">
                                        <div className="relative h-48 w-full">
                                            <Image src={item.imageUrl} alt={item.caption} fill objectFit="cover" />
                                        </div>
                                        <CardContent className="p-4">
                                            <p className="text-sm text-muted-foreground truncate">{item.caption}</p>
                                            <div className="flex justify-end gap-2 mt-4">
                                                <Button variant="outline" size="icon" onClick={() => openGalleryEditDialog(item)}>
                                                    <Edit className="h-4 w-4" />
                                                    <span className="sr-only">Edit</span>
                                                </Button>
                                                <Button variant="destructive" size="icon" onClick={() => handleDelete('gallery', item.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">Delete</span>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-center py-8">No gallery photos have been uploaded yet.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
        default:
            return null;
    }
  }


  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-black">
      <header className="bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/10 sticky top-0 z-30">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Admin Dashboard</h1>
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
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                         <Button
                            variant={activeSection === 'inventory' ? 'default' : 'outline'}
                            onClick={() => setActiveSection('inventory')}
                            className="flex-1 w-full"
                        >
                            <Car className="mr-2 h-4 w-4" />
                            Manage Inventory
                        </Button>
                         <Button
                            variant={activeSection === 'customers' ? 'default' : 'outline'}
                            onClick={() => setActiveSection('customers')}
                            className="flex-1 w-full"
                        >
                            <Users className="mr-2 h-4 w-4" />
                            Manage Customer Gallery
                        </Button>
                    </div>
                </CardContent>
            </Card>
           
           {renderContent()}

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>Edit Vehicle</DialogTitle>
                        <DialogDescription>
                            Make changes to the vehicle details below. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    {editingVehicle && (
                        <form onSubmit={handleUpdateVehicle} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-make">Make</Label>
                                    <Input id="edit-make" value={editingVehicle.make} onChange={e => setEditingVehicle({...editingVehicle, make: e.target.value})} required/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-model">Model</Label>
                                    <Input id="edit-model" value={editingVehicle.model} onChange={e => setEditingVehicle({...editingVehicle, model: e.target.value})} required/>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-year">Year</Label>
                                    <Input id="edit-year" type="number" value={editingVehicle.year} onChange={e => setEditingVehicle({...editingVehicle, year: Number(e.target.value)})} required/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-price">Price ($)</Label>
                                    <Input id="edit-price" type="number" value={editingVehicle.price} onChange={e => setEditingVehicle({...editingVehicle, price: Number(e.target.value)})} required/>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-status">Status</Label>
                                <Select value={editingVehicle.status} onValueChange={value => setEditingVehicle({...editingVehicle, status: value as 'available' | 'sold'})}>
                                    <SelectTrigger id="edit-status">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="available">Available</SelectItem>
                                        <SelectItem value="sold">Sold</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea id="edit-description" value={editingVehicle.description} onChange={e => setEditingVehicle({...editingVehicle, description: e.target.value})} required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-features">Features (one per line)</Label>
                                <Textarea id="edit-features" value={editingVehicle.features} onChange={e => setEditingVehicle({...editingVehicle, features: e.target.value})} required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-car-image">Car Image</Label>
                                {editingVehicle.imageUrl && !isVehicleUploading && <div className="mt-2"><Image src={editingVehicle.imageUrl} alt="Current vehicle" width={150} height={100} className="rounded-lg object-cover" /></div>}
                                {isVehicleUploading && <div className="flex items-center gap-2 mt-2"><Loader2 className="h-5 w-5 animate-spin" /><span>Uploading...</span></div>}
                                <Input id="edit-car-image-upload" type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'edit-vehicle')} className="mt-2" />
                                <p className="text-xs text-muted-foreground">Select a new file to replace the existing image.</p>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={isVehicleUploading}>{isVehicleUploading ? 'Uploading...' : 'Save Changes'}</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={isGalleryEditDialogOpen} onOpenChange={setIsGalleryEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Gallery Item</DialogTitle>
                        <DialogDescription>Update the caption or image for this gallery item.</DialogDescription>
                    </DialogHeader>
                    {editingGalleryItem && (
                         <form onSubmit={handleUpdateGalleryItem} className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-caption">Caption</Label>
                                <Input id="edit-caption" value={editingGalleryItem.caption} onChange={e => setEditingGalleryItem({...editingGalleryItem, caption: e.target.value})} required/>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="edit-gallery-image">Gallery Image</Label>
                                {editingGalleryItem.imageUrl && !isCustomerUploading && <div className="mt-2"><Image src={editingGalleryItem.imageUrl} alt="Current gallery item" width={150} height={100} className="rounded-lg object-cover" /></div>}
                                {isCustomerUploading && <div className="flex items-center gap-2 mt-2"><Loader2 className="h-5 w-5 animate-spin" /><span>Uploading...</span></div>}
                                <Input id="edit-gallery-image-upload" type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'edit-gallery')} className="mt-2" />
                                <p className="text-xs text-muted-foreground">Select a new file to replace the existing image.</p>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={isCustomerUploading}>{isCustomerUploading ? 'Uploading...' : 'Save Changes'}</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
           
        </div>
      </main>
    </div>
  );
}


    