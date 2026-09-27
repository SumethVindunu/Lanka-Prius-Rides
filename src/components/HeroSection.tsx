"use client";

import { motion } from "framer-motion";
import { ChevronDown, MapPin, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg"
    >
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Badge className="mb-6 px-4 py-2 text-sm">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse mr-2" />
                Premium Car Hire Service
              </Badge>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6 font-orbitron">
              <span className="text-white">EXPLORE</span>
              <br />
              <span className="gradient-text">SRI LANKA</span>
              <br />
              <span className="text-white text-4xl sm:text-5xl lg:text-6xl">
                IN STYLE
              </span>
            </h1>

            <p className="text-muted-foreground text-lg max-w-lg mb-8 leading-relaxed">
              Your personal Toyota Prius chauffeur service. Safe, comfortable,
              and eco-friendly rides across the Pearl of the Indian Ocean.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Button size="xl" className="btn-shine" asChild>
                <a href="#booking">Book Your Ride</a>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="#services">Our Services</a>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              {[
                { icon: Star, value: "500+", label: "Happy Tourists" },
                { icon: MapPin, value: "50+", label: "Destinations" },
                { icon: Shield, value: "100%", label: "Safe Rides" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-center"
                >
                  <stat.icon className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-white font-orbitron">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Car Image */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            <div className="relative perspective-container">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-orange-500/20 blur-3xl rounded-full" />
              <img
                src="/images/hero-car.svg"
                alt="Toyota Prius"
                className="relative z-10 w-full animate-float drop-shadow-2xl rounded-2xl"
              />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown className="w-8 h-8 text-amber-400/50" />
      </motion.div>
    </section>
  );
}
