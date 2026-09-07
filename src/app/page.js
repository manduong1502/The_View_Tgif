"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import AtmosphereBackground from "@/components/AtmosphereBackground";
import HeroSection from "@/components/HeroSection";
import ExperienceSection from "@/components/ExperienceSection";
import MenuSection from "@/components/MenuSection";
import NightlifeSection from "@/components/NightlifeSection";
import EventsSection from "@/components/EventsSection";
import ReviewsSection from "@/components/ReviewsSection";
import FaqSection from "@/components/FaqSection";
import BookingSection from "@/components/BookingSection";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";

export default function Home() {
  const [selectedPartyType, setSelectedPartyType] = useState("Bàn ăn tối");

  return (
    <main className="min-h-screen bg-[#08111c] text-slate-100 relative selection:bg-[#cba864] selection:text-[#08111c] overflow-hidden">
      {/* Living Atmospheric River Background (Ember Dust, Water Mesh, Mouse Aura) */}
      <AtmosphereBackground />

      {/* Top Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Experience & Spaces Section with Live Photography Switcher */}
      <ExperienceSection />

      {/* Featured Menu Section with Category Tabs & Wine Pairing */}
      <MenuSection />

      {/* Nightlife & Dragon Bridge Special Moments Section */}
      <NightlifeSection />

      {/* Private Events Section */}
      <EventsSection onSelectPartyType={setSelectedPartyType} />

      {/* Guest & Press Reviews */}
      <ReviewsSection />

      {/* FAQ Information Accordion */}
      <FaqSection />

      {/* Online Reservation & Direct Contact Section */}
      <BookingSection preselectedPartyType={selectedPartyType} />

      {/* Footer */}
      <Footer />

      {/* Floating Call & Fast Booking Actions */}
      <FloatingActions />
    </main>
  );
}
