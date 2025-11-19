
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, Upload, X } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import type { Vehicle } from "@/types";
import { getIKAuth } from "@/lib/actions";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

type EditableVehicle = Omit<Vehicle, 'features'> & { features: string };

// This type helps distinguish between an existing URL string and a new file to be uploaded.
type ImageSource = string | { file: File; url: string };

export default function EditVehiclePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const { toast } = useToast();

    const firestore = useFirestore();

    const [vehicle, setVehicle] = useState<EditableVehicle | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Unified state for both existing image URLs (string) and new image files (object).
    const [imageSources, setImageSources] = useState<ImageSource[]>([]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/admin");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (!firestore || typeof id !== 'string') return;
        
        const fetchVehicle = async () => {
            setIsLoading(true);
            const vehicleRef = doc(firestore, "vehicles", id);
            try {
                const docSnap = await getDoc(vehicleRef);

                if (docSnap.exists()) {
                    const data = { id: docSnap.id, ...docSnap.data() } as Vehicle;
                    setVehicle({
                        ...data,
                        features: Array.isArray(data.features) ? data.features.join('\n') : '',
                    });
                    // Initialize imageSources with existing URLs from Firestore
                    setImageSources(data.imageUrls || []);
                } else {
                    toast({
                        title: "Error",
                        description: "Vehicle not found.",
                        variant: "destructive"
                    });
                    router.push('/admin/dashboard');
                }
            } catch (error) {
                 toast({
                    title: "Error",
                    description: "Failed to fetch vehicle data.",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchVehicle();
    }, [firestore, id, router, toast]);

    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (imageSources.length + files.length > 8) {
          toast({ title: "Too many files", description: "You can upload a maximum of 8 images.", variant: "destructive" });
          return;
        }
        
        // Map new files to the ImageSource object format
        const newImageSources: ImageSource[] = files.map(file => ({
          file,
          url: URL.createObjectURL(file)
        }));
        
        setImageSources(prev => [...prev, ...newImageSources]);
    };
  
    const removeImage = (index: number) => {
      setImageSources(prev => prev.filter((_, i) => i !== index));
    };

    const handleFileUpload = async (file: File) => {
        try {
          const authResult = await getIKAuth();
          if (!authResult.success) {
            throw new Error(authResult.error || "Failed to get upload authentication.");
          }
    
          const formData = new FormData();
          formData.append("file", file);
          formData.append("fileName", file.name);
          formData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!);
          formData.append("signature", authResult.signature!);
          formData.append("expire", authResult.expire!.toString());
          formData.append("token", authResult.token!);
    
          const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
            method: "POST",
            body: formData,
          });
    
          const result = await response.json();
    
          if (!response.ok) {
            throw new Error(result.message || "ImageKit upload failed");
          }
    
          return result.url;
        } catch (error) {
          console.error("Upload failed:", error);
          const errorMessage = error instanceof Error ? error.message : "Could not upload the image.";
          toast({ title: "Upload Failed", description: errorMessage, variant: "destructive" });
          return null;
        }
      };
    
    const handleUpdateVehicle = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore || !vehicle || !user) return;
        
        setIsSubmitting(true);

        try {
            const existingUrls = imageSources.filter(source => typeof source === 'string') as string[];
            const newFiles = imageSources.filter(source => typeof source === 'object') as { file: File; url: string }[];
            
            let uploadedUrls: (string | null)[] = [];

            if (newFiles.length > 0) {
                 const uploadPromises = newFiles.map(source => handleFileUpload(source.file));
                uploadedUrls = await Promise.all(uploadPromises);

                if (uploadedUrls.some(url => url === null)) {
                    const failedFile = newFiles[uploadedUrls.findIndex(url => url === null)].file.name;
                    throw new Error(`Failed to upload image: ${failedFile}`);
                }
            }
            
            const finalImageUrls = [...existingUrls, ...uploadedUrls as string[]];
            
            const vehicleData = {
                ...vehicle,
                year: Number(vehicle.year),
                price: Number(vehicle.price),
                mileage: Number(vehicle.mileage),
                features: typeof vehicle.features === 'string' ? vehicle.features.split('\n').filter(f => f.trim() !== "") : [],
                imageUrls: finalImageUrls,
            };
            
            const vehicleRef = doc(firestore, "vehicles", vehicle.id);
            await updateDoc(vehicleRef, vehicleData);
            
            toast({ title: "Vehicle Updated", description: `${vehicle.make} ${vehicle.model} has been updated.` });
            router.push('/admin/inventory');
        } catch (error) {
            console.error("Update error:", error);
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
             toast({ title: "Update Failed", description: errorMessage, variant: "destructive" });

             if (error instanceof FirestorePermissionError) {
                 errorEmitter.emit('permission-error', error);
             }
        } finally {
             setIsSubmitting(false);
        }
    }

    if (isLoading || authLoading || !user || !firestore) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    if (!vehicle) {
        return null;
    }

    const getImageUrl = (source: ImageSource) => {
      const url = typeof source === 'string' ? source : source.url;
      // This is a robust fallback for old data
      if (url && url.includes("res.cloudinary.com")) {
        const seed = vehicle?.id || `placeholder-${Math.random()}`;
        return `https://picsum.photos/seed/${seed}/120/90`;
      }
      return url || `https://picsum.photos/seed/placeholder/120/90`;
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black">
            <header className="bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/10 sticky top-0 z-30">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                     <Button variant="outline" size="icon" onClick={() => router.push('/admin/inventory')}>
                        <ArrowLeft className="h-4 w-4" />
                     </Button>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 uppercase">Edit Vehicle</h1>
                    <div className="w-8"></div>
                </div>
            </header>
            <main className="flex-grow p-4 md:p-8">
                <div className="mx-auto max-w-3xl">
                     <Card>
                        <CardHeader>
                            <CardTitle className="uppercase">Editing: {vehicle.make} {vehicle.model}</CardTitle>
                            <CardDescription>
                                Make changes to the vehicle details below. Click save when you're done.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <form onSubmit={handleUpdateVehicle} className="grid gap-6">
                                <h3 className="text-lg font-semibold border-b pb-2 uppercase">Basic Info</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="make">Make</Label>
                                        <Input id="make" value={vehicle.make} onChange={e => setVehicle({...vehicle, make: e.target.value})} required/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="model">Model</Label>
                                        <Input id="model" value={vehicle.model} onChange={e => setVehicle({...vehicle, model: e.target.value})} required/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="year">Year</Label>
                                        <Input id="year" type="number" value={vehicle.year} onChange={e => setVehicle({...vehicle, year: Number(e.target.value)})} required/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="variant">Variant / Trim</Label>
                                        <Input id="variant" value={vehicle.variant} onChange={e => setVehicle({...vehicle, variant: e.target.value})} required/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="color">Color</Label>
                                        <Input id="color" value={vehicle.color} onChange={e => setVehicle({...vehicle, color: e.target.value})} required/>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold border-b pb-2 mt-4 uppercase">Pricing</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price (₹)</Label>
                                        <Input id="price" type="number" value={vehicle.price} onChange={e => setVehicle({...vehicle, price: Number(e.target.value)})} required/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="priceType">Price Type</Label>
                                        <Select value={vehicle.priceType} onValueChange={value => setVehicle({...vehicle, priceType: value as 'negotiable' | 'fixed'})}>
                                            <SelectTrigger id="priceType"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="negotiable">Negotiable</SelectItem>
                                                <SelectItem value="fixed">Fixed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold border-b pb-2 mt-4 uppercase">Condition & Specs</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="mileage">Mileage (km)</Label>
                                        <Input id="mileage" type="number" value={vehicle.mileage} onChange={e => setVehicle({...vehicle, mileage: Number(e.target.value)})} required/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="fuelType">Fuel Type</Label>
                                        <Select value={vehicle.fuelType} onValueChange={value => setVehicle({...vehicle, fuelType: value as any})}>
                                            <SelectTrigger id="fuelType"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="petrol">Petrol</SelectItem>
                                                <SelectItem value="diesel">Diesel</SelectItem>
                                                <SelectItem value="cng">CNG</SelectItem>
                                                <SelectItem value="electric">Electric</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="transmission">Transmission</Label>
                                        <Select value={vehicle.transmission} onValueChange={value => setVehicle({...vehicle, transmission: value as any})}>
                                            <SelectTrigger id="transmission"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="manual">Manual</SelectItem>
                                                <SelectItem value="automatic">Automatic</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ownership">Ownership</Label>
                                        <Select value={vehicle.ownership} onValueChange={value => setVehicle({...vehicle, ownership: value as any})}>
                                            <SelectTrigger id="ownership"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="first">First Owner</SelectItem>
                                                <SelectItem value="second">Second Owner</SelectItem>
                                                <SelectItem value="third">Third Owner</SelectItem>
                                                <SelectItem value="fourth">Fourth Owner</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                
                                <h3 className="text-lg font-semibold border-b pb-2 mt-4 uppercase">Other Details</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={vehicle.status} onValueChange={value => setVehicle({...vehicle, status: value as 'available' | 'sold'})}>
                                        <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="available">Available</SelectItem>
                                            <SelectItem value="sold">Sold</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" value={vehicle.description} onChange={e => setVehicle({...vehicle, description: e.target.value})} required/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="features">Features (one per line)</Label>
                                    <Textarea id="features" value={vehicle.features} onChange={e => setVehicle({...vehicle, features: e.target.value})} required/>
                                </div>
                               <div className="space-y-2">
                                    <Label>Car Images (up to 8)</Label>
                                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                      {imageSources.map((source, index) => (
                                        <div key={index} className="relative group">
                                          <Image src={getImageUrl(source)} alt={`Uploaded vehicle ${index + 1}`} width={120} height={90} className="w-full h-auto aspect-video rounded-lg object-cover" />
                                          <Button type="button" size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100" onClick={() => removeImage(index)}>
                                            <X className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                    {isSubmitting && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>Uploading images... Please wait.</span>
                                        </div>
                                    )}
                                    {imageSources.length < 8 && (
                                      <div className="flex-1 space-y-2">
                                          <Label htmlFor="edit-car-image-upload" className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 text-center text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                              <Upload className="h-5 w-5" />
                                              <span>{imageSources.length > 0 ? "Add more files" : "Click to upload"}</span>
                                          </Label>
                                          <Input id="edit-car-image-upload" type="file" accept="image/*" multiple onChange={handleFilesChange} className="sr-only" disabled={isSubmitting} />
                                          <p className="text-xs text-muted-foreground">You can upload up to {8 - imageSources.length} more images.</p>
                                      </div>
                                    )}
                                </div>
                                <div className="flex justify-end gap-2">
                                     <Button type="button" variant="secondary" onClick={() => router.push('/admin/inventory')}>Cancel</Button>
                                     <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}

    
