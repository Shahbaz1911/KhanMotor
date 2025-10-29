
"use client";
import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";
import placeholderImages from "@/lib/placeholder-images.json";

export function TestimonialParallax() {
  const products = [
    {
      title: "Mr. Sharma with his new sedan",
      link: "#",
      thumbnail: placeholderImages.customer1.url,
    },
    {
      title: "Priya enjoying her convertible",
      link: "#",
      thumbnail: placeholderImages.customer2.url,
    },
    {
      title: "The Singh family and their SUV",
      link: "#",
      thumbnail: placeholderImages.customer3.url,
    },
    {
      title: "Raj's classic car restoration",
      link: "#",
      thumbnail: placeholderImages.customer4.url,
    },
    {
      title: "Anjali's first car purchase",
      link: "#",
      thumbnail: placeholderImages.customer5.url,
    },
        {
      title: "Vikram's sports car",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1517524206127-48bbd363f357?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Amit's freshly detailed truck",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1606152421802-db97b8c1a521?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Sunita's reliable city car",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "The Patels' new family van",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1571980099688-6955a64a7810?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
        {
      title: "Another Happy Customer",
      link: "#",
      thumbnail: placeholderImages.customer6.url,
    },
    {
      title: "Happy with their new ride",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1610496434054-6278d5573424?q=80&w=1949&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
        {
      title: "A fresh new look",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1549399542-7e69c8195443?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Ready for the road",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1503720769255-88e6a578a149?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Quality service",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1582806954284-c013844a42b9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Thrilled with the result",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];
  return <HeroParallax products={products} />;
}

    