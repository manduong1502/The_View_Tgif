"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ExperienceSection from "@/components/ExperienceSection";
import MenuSection from "@/components/MenuSection";
import NightlifeSection from "@/components/NightlifeSection";
import EventsSection from "@/components/EventsSection";
import BookingSection from "@/components/BookingSection";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";

export default function Home() {
  const [selectedPartyType, setSelectedPartyType] = useState("Bàn ăn tối");

  return (
    <main className="min-h-screen bg-[#08111c] text-slate-100 relative selection:bg-[#cba864] selection:text-[#08111c]">
      {/* Top Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Experience & Spaces Section */}
      <ExperienceSection />

      {/* Featured Menu Section */}
      <MenuSection />

      {/* Nightlife & Dragon Bridge Special Moments Section */}
      <NightlifeSection />

      {/* Private Events Section */}
      <EventsSection onSelectPartyType={setSelectedPartyType} />

      {/* Online Reservation & Direct Contact Section */}
      <BookingSection preselectedPartyType={selectedPartyType} />

      {/* Footer */}
      <Footer />

      {/* Floating Call & Fast Booking Actions */}
      <FloatingActions />
    </main>
  );
}
