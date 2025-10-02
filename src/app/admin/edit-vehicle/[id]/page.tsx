
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
import { Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import type { Vehicle } from "@/types";
import { uploadToCloudinary } from "@/lib/actions";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function EditVehiclePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const { toast } = useToast();

    const firestore = useFirestore();

    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

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
                    features: Array.isArray(data.features) ? data.features.join('\n') : data.features,
                });
                setImageUrl(data.imageUrl);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImageFile(file);
        if (file) {
            const tempUrl = URL.createObjectURL(file);
            setImageUrl(tempUrl);
        }
    };
    
    const handleUpdateVehicle = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore || !vehicle || !user) return;

        let uploadedImageUrl = vehicle.imageUrl;
        if (imageFile) {
            setIsUploading(true);
            try {
                const formData = new FormData();
                formData.append('file', imageFile);
                const result = await uploadToCloudinary(formData);
                if (result.success && result.url) {
                    uploadedImageUrl = result.url;
                } else {
                    throw new Error(result.error || "Cloudinary upload failed.");
                }
            } catch (error) {
                console.error("Upload failed:", error);
                const errorMessage = error instanceof Error ? error.message : "Could not upload the image.";
                toast({ title: "Upload Failed", description: errorMessage, variant: "destructive" });
                setIsUploading(false);
                return;
            } finally {
                setIsUploading(false);
            }
        }
        
        const vehicleData = {
            ...vehicle,
            year: Number(vehicle.year),
            price: Number(vehicle.price),
            features: typeof vehicle.features === 'string' ? vehicle.features.split('\n').filter(f => f.trim() !== "") : vehicle.features,
            imageUrl: uploadedImageUrl,
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
        // This will be rendered briefly before redirection if vehicle is not found.
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-make">Make</Label>
                                        <Input id="edit-make" value={vehicle.make} onChange={e => setVehicle({...vehicle, make: e.target.value})} required/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-model">Model</Label>
                                        <Input id="edit-model" value={vehicle.model} onChange={e => setVehicle({...vehicle, model: e.target.value})} required/>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-year">Year</Label>
                                        <Input id="edit-year" type="number" value={vehicle.year} onChange={e => setVehicle({...vehicle, year: Number(e.target.value)})} required/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-price">Price ($)</Label>
                                        <Input id="edit-price" type="number" value={vehicle.price} onChange={e => setVehicle({...vehicle, price: Number(e.target.value)})} required/>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-status">Status</Label>
                                    <Select value={vehicle.status} onValueChange={value => setVehicle({...vehicle, status: value as 'available' | 'sold'})}>
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
                                    <Textarea id="edit-description" value={vehicle.description} onChange={e => setVehicle({...vehicle, description: e.target.value})} required/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-features">Features (one per line)</Label>
                                    <Textarea id="edit-features" value={vehicle.features} onChange={e => setVehicle({...vehicle, features: e.target.value})} required/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-car-image">Car Image</Label>
                                    {imageUrl && !isUploading && <div className="mt-2"><Image src={imageUrl} alt="Current vehicle" width={150} height={100} className="rounded-lg object-cover" /></div>}
                                    {isUploading && <div className="flex items-center gap-2 mt-2"><Loader2 className="h-5 w-5 animate-spin" /><span>Uploading...</span></div>}
                                    <Input id="edit-car-image-upload" type="file" accept="image/*" onChange={handleFileChange} className="mt-2" />
                                    <p className="text-xs text-muted-foreground">Select a new file to replace the existing image.</p>
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

