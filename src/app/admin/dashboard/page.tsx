
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { LogOut, Trash2, Edit, Car, Users, Settings, User as UserIcon, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc, serverTimestamp } from "firebase/firestore";
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
  
  const firestore = useFirestore();

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
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'customer' | 'edit-gallery') => {
    const file = e.target.files?.[0] || null;

    if (type === 'customer') {
        setCustomerImageFile(file);
        if(file) setCustomerImageUrl(URL.createObjectURL(file));
        else setCustomerImageUrl(null)
    } else if (type === 'edit-gallery' && editingGalleryItem) {
        setCustomerImageFile(file); // reuse for edit
        if(file) setEditingGalleryItem({ ...editingGalleryItem, imageUrl: URL.createObjectURL(file) });
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) {
      toast({ title: "No file selected", description: "Please select a file to upload.", variant: "destructive" });
      return null;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const result = await uploadToCloudinary(formData);

      if (result.success && result.url) {
        return result.url;
      } else {
        throw new Error(result.error || "Cloudinary upload failed.");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Could not upload the image.";
      toast({ title: "Upload Failed", description: errorMessage, variant: "destructive" });
      return null;
    }
  };

  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !user || !customerImageFile) {
        toast({ title: "Image required", description: "Please upload a customer image.", variant: "destructive" });
        return;
    }
    setIsCustomerUploading(true);
    const uploadedImageUrl = await handleFileUpload(customerImageFile);
    setIsCustomerUploading(false);
    
    if (!uploadedImageUrl) {
        toast({ title: "Image upload failed", description: "Could not add gallery item.", variant: "destructive" });
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
        setIsCustomerUploading(true);
        const newUrl = await handleFileUpload(customerImageFile);
        setIsCustomerUploading(false);
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

  const handleDeleteGalleryItem = async (id: string) => {
    if (!firestore || !user) return;
    if (!window.confirm("Are you sure you want to delete this gallery item? This action cannot be undone.")) return;
    
    const docRef = doc(firestore, "gallery", id);
    deleteDoc(docRef)
        .then(() => {
             toast({ title: "Item Deleted", description: "The gallery item has been successfully removed." });
        })
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: docRef.path,
                operation: 'delete',
            });
            errorEmitter.emit('permission-error', permissionError);
        });
  }
  
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
                <CardHeader>
                    <CardTitle>Welcome, {user.displayName}</CardTitle>
                    <CardDescription>Select a section below to manage your website content.</CardDescription>
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
                        >
                            <Users className="mr-2 h-4 w-4" />
                            Manage Customer Gallery
                        </Button>
                    </div>
                </CardContent>
            </Card>
           
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
                            <Label>Customer Photo</Label>
                             <div className="flex items-center gap-4">
                                {customerImageUrl && !isCustomerUploading && <Image src={customerImageUrl} alt="Uploaded customer" width={120} height={90} className="rounded-lg object-cover" />}
                                {isCustomerUploading && (
                                    <div className="flex w-32 h-[90px] items-center justify-center rounded-lg bg-muted">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    </div>
                                )}
                                <div className="flex-1 space-y-2">
                                     <Label htmlFor="customer-image-upload" className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 text-center text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <Upload className="h-5 w-5" />
                                        <span>{customerImageFile ? "Change file" : "Click to upload"}</span>
                                    </Label>
                                    <Input id="customer-image-upload" type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'customer')} className="sr-only" />
                                    <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP (MAX. 10MB).</p>
                                </div>
                            </div>
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
                                                <Button variant="destructive" size="icon" onClick={() => handleDeleteGalleryItem(item.id)}>
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
                                <Label>Gallery Image</Label>
                                 <div className="flex items-center gap-4">
                                    {editingGalleryItem.imageUrl && !isCustomerUploading && <Image src={editingGalleryItem.imageUrl} alt="Current gallery item" width={120} height={90} className="rounded-lg object-cover" />}
                                    {isCustomerUploading && <div className="flex w-32 h-[90px] items-center justify-center rounded-lg bg-muted"><Loader2 className="h-5 w-5 animate-spin" /></div>}
                                     <div className="flex-1 space-y-2">
                                         <Label htmlFor="edit-gallery-image-upload" className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 text-center text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <Upload className="h-5 w-5" />
                                            <span>Replace file</span>
                                        </Label>
                                        <Input id="edit-gallery-image-upload" type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'edit-gallery')} className="sr-only" />
                                    </div>
                                </div>
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

    