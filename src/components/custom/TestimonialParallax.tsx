
"use client";
import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";
import placeholderImages from "@/lib/placeholder-images.json";

export function TestimonialParallax() {
  const products = [
    {
      name: "Ayesha Khan",
      title: "Luxury Car Enthusiast",
      link: "#",
      thumbnail: placeholderImages.testimonial1.url,
      quote: "Motor Khan provided an unparalleled buying experience. Their attention to detail and customer service is top-notch. I found my dream car!",
      rating: 5,
    },
    {
      name: "Rohan Sharma",
      title: "First Time Buyer",
      link: "#",
      thumbnail: placeholderImages.testimonial2.url,
      quote: "The team at Motor Khan made my first luxury car purchase seamless and enjoyable. Highly knowledgeable and no pressure.",
      rating: 5,
    },
    {
      name: "Fatima Ali",
      title: "Collector",
      link: "#",
      thumbnail: placeholderImages.testimonial3.url,
      quote: "As a collector, I appreciate Motor Khan's curated selection of rare and high-performance vehicles. A trusted partner.",
      rating: 5,
    },
    {
      name: "Arjun Kumar",
      title: "Repeat Customer",
      link: "#",
      thumbnail: "https://picsum.photos/seed/testimonial4/100/100",
      quote: "My third car from Motor Khan, and they continue to exceed my expectations. The best in the business, period.",
      rating: 5,
    },
    {
      name: "Zoya Ahmed",
      title: "Performance Driving Fan",
      link: "#",
      thumbnail: "https://picsum.photos/seed/testimonial5/100/100",
      quote: "They sourced the exact high-performance model I was looking for. The entire process was flawless.",
      rating: 5,
    },
    {
      name: "Vikram Singh",
      title: "Sports Car Owner",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1517524206127-48bbd363f357?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      quote: "The attention to detail on my classic car restoration was incredible. It looks better than new!",
      rating: 5,
    },
    {
      name: "Imran Khan",
      title: "Truck Enthusiast",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1606152421802-db97b8c1a521?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      quote: "I trust them with all my truck's maintenance. Fair pricing and honest work every time.",
      rating: 5,
    },
    {
      name: "Sunita Gupta",
      title: "Daily Commuter",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      quote: "Quick, efficient, and friendly service. My car always feels great after a visit to Motor Khan.",
      rating: 5,
    },
    {
      name: "The Mehra Family",
      title: "Family Van Owners",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1571980099688-6955a64a7810?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      quote: "They helped us find the perfect, safe, and reliable van for our growing family. A wonderful experience.",
      rating: 5,
    },
    {
      name: "Rohan Verma",
      title: "Another Happy Customer",
      link: "#",
      thumbnail: placeholderImages.customer6.url,
      quote: "Great selection of certified pre-owned cars. The whole process was transparent and stress-free.",
      rating: 5,
    },
    {
      name: "Priya Singh",
      title: "Happy with their new ride",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1610496434054-6278d5573424?q=80&w=1949&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      quote: "Found a fantastic deal on a low-mileage car. The team was super helpful and not pushy at all.",
      rating: 5,
    },
    {
      name: "Deepak Chauhan",
      title: "A fresh new look",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1549399542-7e69c8195443?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      quote: "The paint and detailing work they did on my car was flawless. It looks absolutely stunning!",
      rating: 5,
    },
    {
      name: "Aditya Mehta",
      title: "Ready for the road",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1503720769255-88e6a578a149?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      quote: "Excellent service from start to finish. I'm so happy with my purchase and will be back for servicing.",
      rating: 5,
    },
    {
      name: "Sneha Reddy",
      title: "Quality service",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1582806954284-c013844a42b9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      quote: "Honest, reliable, and professional. The best car workshop in Delhi, without a doubt.",
      rating: 5,
    },
    {
      name: "Karan Malhotra",
      title: "Thrilled with the result",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      quote: "I came in for a major repair and they handled it perfectly. My bike runs better than ever.",
      rating: 5,
    },
  ].map(t => ({...t, title: t.name, link: '#'}));
  
  return <HeroParallax products={products as any} />;
}
    
