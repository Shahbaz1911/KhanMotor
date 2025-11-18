
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
import { Loader2, ArrowLeft, Upload, X, Check } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getIKAuth } from "@/lib/actions";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { motion } from "framer-motion";

const initialVehicleState = {
    make: "", model: "", year: "", variant: "", color: "", 
    price: "", priceType: "negotiable", mileage: "", fuelType: "petrol", 
    transmission: "manual", ownership: "first", status: "available",
    description: "", features: ""
};

export default function AddVehiclePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const firestore = useFirestore();

    const [newVehicle, setNewVehicle] = useState(initialVehicleState);
    const [vehicleImageFiles, setVehicleImageFiles] = useState<File[]>([]);
    const [vehicleImageUrls, setVehicleImageUrls] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
        router.push("/admin");
        }
    }, [user, authLoading, router]);
    
    const handleVehicleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (vehicleImageFiles.length + files.length > 8) {
        toast({ title: "Too many files", description: "You can upload a maximum of 8 images.", variant: "destructive" });
        return;
        }
        setVehicleImageFiles(prev => [...prev, ...files]);
        const newUrls = files.map(file => URL.createObjectURL(file));
        setVehicleImageUrls(prev => [...prev, ...newUrls]);
    };
    
    const removeVehicleImage = (index: number) => {
        setVehicleImageFiles(prev => prev.filter((_, i) => i !== index));
        setVehicleImageUrls(prev => prev.filter((_, i) => i !== index));
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

    const handleAddVehicle = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore || !user) return;
        if (vehicleImageFiles.length === 0) {
            toast({ title: "Image required", description: "Please upload at least one vehicle image.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            const uploadedUrls = await Promise.all(vehicleImageFiles.map(handleFileUpload));
            
            if (uploadedUrls.some(url => url === null)) {
                throw new Error("One or more images failed to upload. Could not add vehicle.");
            }
            
            const vehicleData = {
                ...newVehicle,
                year: Number(newVehicle.year),
                price: Number(newVehicle.price),
                mileage: Number(newVehicle.mileage),
                features: newVehicle.features.split('\n').filter(f => f.trim() !== ""),
                imageUrls: uploadedUrls as string[],
                aiHint: 'new vehicle',
                createdAt: serverTimestamp(),
            };
            
            const vehiclesCollection = collection(firestore, "vehicles");
            await addDoc(vehiclesCollection, vehicleData);
            
            toast({ title: "Vehicle Added", description: `${newVehicle.make} ${newVehicle.model} has been added to inventory.` });
            setIsSuccess(true);
            setTimeout(() => {
                router.push('/admin/inventory');
            }, 2000); 

        } catch (error) {
            console.error("Add vehicle error:", error);
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
            toast({ title: "Submission Failed", description: errorMessage, variant: "destructive" });

            if (error instanceof FirestorePermissionError) {
                errorEmitter.emit('permission-error', error);
            }
        } finally {
            setIsSubmitting(false);
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
        <div className="min-h-screen bg-gray-100 dark:bg-black">
            <header className="bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/10 sticky top-0 z-30">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                     <Button variant="outline" size="icon" onClick={() => router.push('/admin/inventory')}>
                        <ArrowLeft className="h-4 w-4" />
                     </Button>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 uppercase">Add New Vehicle</h1>
                    <div className="w-8"></div>
                </div>
            </header>
            <main className="flex-grow p-4 md:p-8">
                 <div className="mx-auto max-w-3xl relative">
                    {isSuccess && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg"
                        >
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 20 } }}
                                className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500"
                            >
                                <Check className="h-16 w-16 text-white" />
                            </motion.div>
                            <p className="mt-4 text-lg font-semibold uppercase">Vehicle Added Successfully!</p>
                        </motion.div>
                    )}
                     <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="uppercase">Add New Vehicle</CardTitle>
                            <CardDescription>
                                Fill out the form below to add a new car to your inventory.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddVehicle} className="grid gap-6">
                                {/* Basic Info */}
                                <h3 className="text-lg font-semibold border-b pb-2 uppercase">Basic Info</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="make">Make</Label>
                                        <Input id="make" placeholder="e.g., Honda" value={newVehicle.make} onChange={e => setNewVehicle({...newVehicle, make: e.target.value})} required/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="model">Model</Label>
                                        <Input id="model" placeholder="e.g., City" value={newVehicle.model} onChange={e => setNewVehicle({...newVehicle, model: e.target.value})} required/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="year">Year of Manufacture</Label>
                                        <Input id="year" type="number" placeholder="e.g., 2019" value={newVehicle.year} onChange={e => setNewVehicle({...newVehicle, year: e.target.value})} required/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="variant">Variant / Trim</Label>
                                        <Input id="variant" placeholder="e.g., ZXI+" value={newVehicle.variant} onChange={e => setNewVehicle({...newVehicle, variant: e.target.value})} required/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="color">Color</Label>
                                        <Input id="color" placeholder="e.g., Red" value={newVehicle.color} onChange={e => setNewVehicle({...newVehicle, color: e.target.value})} required/>
                                    </div>
                                </div>
                                
                                {/* Pricing */}
                                <h3 className="text-lg font-semibold border-b pb-2 mt-4 uppercase">Pricing</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price (₹)</Label>
                                        <Input id="price" type="number" placeholder="e.g., 850000" value={newVehicle.price} onChange={e => setNewVehicle({...newVehicle, price: e.target.value})} required/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="priceType">Price Type</Label>
                                        <Select value={newVehicle.priceType} onValueChange={value => setNewVehicle({...newVehicle, priceType: value})}>
                                            <SelectTrigger id="priceType">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="negotiable">Negotiable</SelectItem>
                                                <SelectItem value="fixed">Fixed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Condition & Specs */}
                                <h3 className="text-lg font-semibold border-b pb-2 mt-4 uppercase">Condition & Specs</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                        <Label htmlFor="mileage">Mileage (km)</Label>
                                        <Input id="mileage" type="number" placeholder="e.g., 25000" value={newVehicle.mileage} onChange={e => setNewVehicle({...newVehicle, mileage: e.target.value})} required/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="fuelType">Fuel Type</Label>
                                        <Select value={newVehicle.fuelType} onValueChange={value => setNewVehicle({...newVehicle, fuelType: value})}>
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
                                        <Select value={newVehicle.transmission} onValueChange={value => setNewVehicle({...newVehicle, transmission: value})}>
                                            <SelectTrigger id="transmission"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="manual">Manual</SelectItem>
                                                <SelectItem value="automatic">Automatic</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ownership">Ownership</Label>
                                        <Select value={newVehicle.ownership} onValueChange={value => setNewVehicle({...newVehicle, ownership: value})}>
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

                                {/* Other Details */}
                                <h3 className="text-lg font-semibold border-b pb-2 mt-4 uppercase">Other Details</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" placeholder="Enter a brief description of the vehicle..." value={newVehicle.description} onChange={e => setNewVehicle({...newVehicle, description: e.target.value})} required/>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="features">Features (one per line)</Label>
                                    <Textarea id="features" placeholder="e.g., V10 Engine\nConvertible\nBang & Olufsen Sound" value={newVehicle.features} onChange={e => setNewVehicle({...newVehicle, features: e.target.value})} required/>
                                </div>
                                
                            <div className="space-y-2">
                                    <Label>Car Images (up to 8)</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    {vehicleImageUrls.map((url, index) => (
                                        <div key={index} className="relative group">
                                        <Image src={url} alt={`Uploaded vehicle ${index + 1}`} width={120} height={90} className="w-full h-auto aspect-video rounded-lg object-cover" />
                                        <Button type="button" size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100" onClick={() => removeVehicleImage(index)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                        </div>
                                    ))}
                                    </div>
                                    {isSubmitting && vehicleImageFiles.length > 0 && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>Uploading images... Please wait.</span>
                                        </div>
                                    )}
                                    {vehicleImageFiles.length < 8 && (
                                    <div className="flex-1 space-y-2">
                                        <Label htmlFor="car-image-upload" className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 text-center text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <Upload className="h-5 w-5" />
                                            <span>{vehicleImageFiles.length > 0 ? "Add more files" : "Click to upload"}</span>
                                        </Label>
                                        <Input id="car-image-upload" type="file" accept="image/*" multiple onChange={handleVehicleFilesChange} className="sr-only" disabled={isSubmitting} />
                                        <p className="text-xs text-muted-foreground">You can upload up to {8 - vehicleImageFiles.length} more images.</p>
                                    </div>
                                    )}
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


                                <div className="flex justify-end gap-2">
                                     <Button type="button" variant="secondary" onClick={() => router.push('/admin/inventory')}>Cancel</Button>
                                     <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Please wait...' : 'Add Vehicle'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                 </div>
            </main>
        </div>
    );
}
