
"use client";

import React from "react";
import StatsCount from "@/components/ui/statscount";
import { Car, Smile, Calendar } from "lucide-react";

const stats = [
  {
    value: 50000,
    label: "Cars Serviced",
    suffix: "+",
    icon: Car,
  },
  {
    value: 25000,
    label: "Happy Customers",
    suffix: "+",
    icon: Smile,
  },
  {
    value: 30,
    label: "Years in Business",
    suffix: "+",
    icon: Calendar,
  },
];

export function AchievementsSection() {

  return (
    <section id="achievements" className="py-16 md:py-24 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <StatsCount 
          stats={stats}
          title="Excellence By The Numbers"
        />
      </div>
    </section>
  );
}
