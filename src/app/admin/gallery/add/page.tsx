
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Upload, X, Check } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { uploadToCloudinary } from "@/lib/actions";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { motion } from "framer-motion";

export default function AddGalleryItemPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const firestore = useFirestore();

    const [caption, setCaption] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/admin");
        }
    }, [user, authLoading, router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImageFile(file);
        if (file) {
            setImageUrl(URL.createObjectURL(file));
        } else {
            setImageUrl(null);
        }
    };
    
    const handleFileUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const result = await uploadToCloudinary(formData);
        if (!result.success) {
            toast({ title: "Upload Failed", description: result.error || "Could not upload image.", variant: "destructive" });
            return null;
        }
        return result.url;
    };

    const handleAddGalleryItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore || !user || !imageFile) {
            toast({ title: "Image required", description: "Please upload a customer image.", variant: "destructive" });
            return;
        }

        setIsUploading(true);
        const uploadedUrl = await handleFileUpload(imageFile);
        
        if (!uploadedUrl) {
            setIsUploading(false);
            return;
        }

        const galleryData = {
            caption: caption,
            imageUrl: uploadedUrl,
            createdAt: serverTimestamp(),
        };

        const galleryCollection = collection(firestore, "gallery");
        addDoc(galleryCollection, galleryData)
            .then(() => {
                toast({ title: "Gallery Item Added", description: "A new photo has been added to the gallery." });
                setIsSuccess(true);
                setTimeout(() => {
                    router.push('/admin/dashboard');
                }, 2000);
            })
            .catch(async (serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: galleryCollection.path,
                    operation: 'create',
                    requestResourceData: galleryData,
                });
                errorEmitter.emit('permission-error', permissionError);
            })
            .finally(() => {
                setIsUploading(false);
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
        <div className="min-h-screen bg-gray-100 dark:bg-black">
            <header className="bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/10 sticky top-0 z-30">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                     <Button variant="outline" size="icon" onClick={() => router.push('/admin/dashboard')}>
                        <ArrowLeft className="h-4 w-4" />
                     </Button>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Add to Gallery</h1>
                    <div className="w-8"></div>
                </div>
            </header>
            <main className="flex-grow p-4 md:p-8">
                 <div className="mx-auto max-w-xl relative">
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
                            <p className="mt-4 text-lg font-semibold">Photo Added Successfully!</p>
                        </motion.div>
                    )}
                     <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Add New Customer Photo</CardTitle>
                            <CardDescription>
                                Upload a photo and add a caption for the customer gallery.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddGalleryItem} className="grid gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="caption">Caption</Label>
                                    <Input id="caption" placeholder="e.g., Mr. Khan with his new Honda City" value={caption} onChange={e => setCaption(e.target.value)} required/>
                                </div>
                                <div className="space-y-2">
                                    <Label>Customer Photo</Label>
                                    <div className="flex items-center gap-4">
                                        {imageUrl && !isUploading && <Image src={imageUrl} alt="Uploaded customer" width={120} height={90} className="rounded-lg object-cover" />}
                                        {isUploading && (
                                            <div className="flex w-32 h-[90px] items-center justify-center rounded-lg bg-muted">
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            </div>
                                        )}
                                        <div className="flex-1 space-y-2">
                                            <Label htmlFor="customer-image-upload" className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 text-center text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <Upload className="h-5 w-5" />
                                                <span>{imageFile ? "Change file" : "Click to upload"}</span>
                                            </Label>
                                            <Input id="customer-image-upload" type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
                                            <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP (MAX. 10MB).</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                     <Button type="button" variant="secondary" onClick={() => router.push('/admin/dashboard')}>Cancel</Button>
                                     <Button type="submit" disabled={isUploading}>
                                        {isUploading ? 'Please wait...' : 'Add to Gallery'}
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
    