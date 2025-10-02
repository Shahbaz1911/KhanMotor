
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
import { uploadToCloudinary } from "@/lib/actions";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

type EditableVehicle = Omit<Vehicle, 'features'> & { features: string };

export default function EditVehiclePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const { toast } = useToast();

    const firestore = useFirestore();

    const [vehicle, setVehicle] = useState<EditableVehicle | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

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
            const docSnap = await getDoc(vehicleRef);

            if (docSnap.exists()) {
                const data = { id: docSnap.id, ...docSnap.data() } as Vehicle;
                setVehicle({
                    ...data,
                    features: Array.isArray(data.features) ? data.features.join('\n') : '',
                });
                setImageUrls(data.imageUrls || []);
            } else {
                toast({
                    title: "Error",
                    description: "Vehicle not found.",
                    variant: "destructive"
                });
                router.push('/admin/dashboard');
            }
            setIsLoading(false);
        };

        fetchVehicle();
    }, [firestore, id, router, toast]);

    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (imageUrls.length + imageFiles.length + files.length > 8) {
          toast({ title: "Too many files", description: "You can upload a maximum of 8 images.", variant: "destructive" });
          return;
        }
        setImageFiles(prev => [...prev, ...files]);
        const newUrls = files.map(file => URL.createObjectURL(file));
        setImageUrls(prev => [...prev, ...newUrls]);
    };
  
    const removeImage = (index: number, isExisting: boolean) => {
      if (isExisting) {
        setImageUrls(prev => prev.filter((_, i) => i !== index));
      } else {
        const fileIndex = index - (vehicle?.imageUrls?.length || 0);
        setImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
        setImageUrls(prev => prev.filter((_, i) => i !== index));
      }
    };
    
    const handleUpdateVehicle = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore || !vehicle || !user) return;

        let finalImageUrls = imageUrls.slice(0, vehicle.imageUrls?.length || 0);

        if (imageFiles.length > 0) {
            setIsUploading(true);
            const uploadedUrls = await Promise.all(
                imageFiles.map(async (file) => {
                    const formData = new FormData();
                    formData.append('file', file);
                    const result = await uploadToCloudinary(formData);
                    return result.url;
                })
            );

            if (uploadedUrls.some(url => !url)) {
                toast({ title: "Image upload failed", description: "One or more new images failed to upload.", variant: "destructive" });
                setIsUploading(false);
                return;
            }
            finalImageUrls = [...finalImageUrls, ...uploadedUrls.filter(Boolean) as string[]];
            setIsUploading(false);
        }
        
        const vehicleData = {
            ...vehicle,
            year: Number(vehicle.year),
            price: Number(vehicle.price),
            mileage: Number(vehicle.mileage),
            features: typeof vehicle.features === 'string' ? vehicle.features.split('\n').filter(f => f.trim() !== "") : [],
            imageUrls: finalImageUrls,
        };
        
        const vehicleRef = doc(firestore, "vehicles", vehicle.id);
        updateDoc(vehicleRef, vehicleData)
            .then(() => {
                toast({ title: "Vehicle Updated", description: `${vehicle.make} ${vehicle.model} has been updated.` });
                router.push('/admin/dashboard');
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

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black">
            <header className="bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/10 sticky top-0 z-30">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                     <Button variant="outline" size="icon" onClick={() => router.push('/admin/dashboard')}>
                        <ArrowLeft className="h-4 w-4" />
                     </Button>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Edit Vehicle</h1>
                    <div className="w-8"></div>
                </div>
            </header>
            <main className="flex-grow p-4 md:p-8">
                <div className="mx-auto max-w-3xl">
                     <Card>
                        <CardHeader>
                            <CardTitle>Editing: {vehicle.make} {vehicle.model}</CardTitle>
                            <CardDescription>
                                Make changes to the vehicle details below. Click save when you're done.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <form onSubmit={handleUpdateVehicle} className="grid gap-6">
                                <h3 className="text-lg font-semibold border-b pb-2">Basic Info</h3>
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
                                <h3 className="text-lg font-semibold border-b pb-2 mt-4">Pricing</h3>
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

                                <h3 className="text-lg font-semibold border-b pb-2 mt-4">Condition & Specs</h3>
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
                                
                                <h3 className="text-lg font-semibold border-b pb-2 mt-4">Other Details</h3>
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
                                      {imageUrls.map((url, index) => (
                                        <div key={index} className="relative group">
                                          <Image src={url} alt={`Uploaded vehicle ${index + 1}`} width={120} height={90} className="w-full h-auto aspect-video rounded-lg object-cover" />
                                          <Button type="button" size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100" onClick={() => removeImage(index, index < (vehicle.imageUrls?.length || 0))}>
                                            <X className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                    {isUploading && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>Uploading images... Please wait.</span>
                                        </div>
                                    )}
                                    {imageUrls.length < 8 && (
                                      <div className="flex-1 space-y-2">
                                          <Label htmlFor="edit-car-image-upload" className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 text-center text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                              <Upload className="h-5 w-5" />
                                              <span>{imageUrls.length > 0 ? "Add more files" : "Click to upload"}</span>
                                          </Label>
                                          <Input id="edit-car-image-upload" type="file" accept="image/*" multiple onChange={handleFilesChange} className="sr-only" disabled={isUploading} />
                                          <p className="text-xs text-muted-foreground">You can upload up to {8 - imageUrls.length} more images.</p>
                                      </div>
                                    )}
                                </div>
                                <div className="flex justify-end gap-2">
                                     <Button type="button" variant="secondary" onClick={() => router.push('/admin/dashboard')}>Cancel</Button>
                                     <Button type="submit" disabled={isUploading}>{isUploading ? 'Uploading...' : 'Save Changes'}</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
