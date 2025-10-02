
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
import { UploadCloud, LogOut, Trash2, Edit, Car, Users } from "lucide-react";
import Image from "next/image";
import placeholderImages from "@/lib/placeholder-images.json";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("inventory");

  useEffect(() => {
    if (!user) {
      router.push("/admin");
    }
  }, [user, router]);

  if (!user) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }

  // Placeholder for customer gallery items
  const galleryItems = [
    {
        id: "1",
        imageUrl: placeholderImages.customer1.url,
        caption: "Mr. Johnson with his new sports car."
    },
    {
        id: "2",
        imageUrl: placeholderImages.customer2.url,
        caption: "Ms. Garcia enjoying her brand new SUV."
    }
  ];
  
  const renderContent = () => {
    switch (activeSection) {
      case 'inventory':
        return (
            <>
                <Card>
                    <CardHeader>
                        <CardTitle>Manage Inventory</CardTitle>
                        <CardDescription>
                            Here you can add, edit, and delete vehicle listings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Your vehicle listings will appear here. You can edit or delete them as needed.</p>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Add New Vehicle</CardTitle>
                        <CardDescription>
                            Fill out the form below to add a new car to your inventory.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="grid gap-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="car-name">Car Name</Label>
                                    <Input id="car-name" placeholder="e.g., Audi R8 Spyder" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price ($)</Label>
                                    <Input id="price" type="number" placeholder="e.g., 180000" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" placeholder="Enter a brief description of the vehicle..." />
                            </div>
                            
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select>
                                        <SelectTrigger id="status">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="available">Available</SelectItem>
                                            <SelectItem value="sold">Sold</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="car-image">Car Image</Label>
                                    <div className="flex items-center justify-center w-full">
                                        <Label htmlFor="car-image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-accent">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
                                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP (MAX. 5MB)</p>
                                            </div>
                                            <Input id="car-image-upload" type="file" className="hidden" />
                                        </Label>
                                    </div> 
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit">
                                    Add Vehicle
                                </Button>
                            </div>
                        </form>
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
                    <form className="grid gap-6 mb-8 border-b pb-8">
                        <div className="space-y-2">
                            <Label htmlFor="caption">Caption</Label>
                            <Input id="caption" placeholder="e.g., Mr. Khan with his new Honda City" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="customer-image">Customer Photo</Label>
                                <div className="flex items-center justify-center w-full">
                                <Label htmlFor="customer-image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-accent">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP (MAX. 5MB)</p>
                                    </div>
                                    <Input id="customer-image-upload" type="file" className="hidden" />
                                </Label>
                            </div> 
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit">Add to Gallery</Button>
                        </div>
                    </form>
                    
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Existing Gallery Photos</h3>
                        {galleryItems.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {galleryItems.map(item => (
                                    <Card key={item.id} className="overflow-hidden">
                                        <div className="relative h-48 w-full">
                                            <Image src={item.imageUrl} alt={item.caption} layout="fill" objectFit="cover" />
                                        </div>
                                        <CardContent className="p-4">
                                            <p className="text-sm text-muted-foreground truncate">{item.caption}</p>
                                            <div className="flex justify-end gap-2 mt-4">
                                                <Button variant="outline" size="icon">
                                                    <Edit className="h-4 w-4" />
                                                    <span className="sr-only">Edit</span>
                                                </Button>
                                                <Button variant="destructive" size="icon">
                                                    <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">Delete</span>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-center">No gallery photos have been uploaded yet.</p>
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
      <header className="bg-white dark:bg-gray-900/50 backdrop-blur-lg border-b border-gray-200 dark:border-white/10 sticky top-0 z-30">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
                <span>Welcome, {user.name}</span>
                <Button onClick={logout} variant="outline" size="sm">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                </Button>
            </div>
        </div>
      </header>
      <main className="flex-grow p-4 md:p-8">
        <div className="mx-auto grid max-w-6xl gap-8">
            <Card className="mb-4">
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                         <Button
                            variant={activeSection === 'inventory' ? 'default' : 'outline'}
                            onClick={() => setActiveSection('inventory')}
                            className="flex-1"
                        >
                            <Car className="mr-2 h-4 w-4" />
                            Manage Inventory
                        </Button>
                         <Button
                            variant={activeSection === 'customers' ? 'default' : 'outline'}
                            onClick={() => setActiveSection('customers')}
                            className="flex-1"
                        >
                            <Users className="mr-2 h-4 w-4" />
                            Manage Customer Gallery
                        </Button>
                    </div>
                </CardContent>
            </Card>
           
           {renderContent()}
           
        </div>
      </main>
    </div>
  );
}
