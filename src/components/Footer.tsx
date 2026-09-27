"use client";

import { Car } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Car className="w-6 h-6 text-amber-400" />
            <span className="text-lg font-bold tracking-wider font-orbitron">
              <span className="text-white">LANKA</span>
              <span className="text-amber-400">RIDES</span>
            </span>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap justify-center gap-1">
            {[
              { href: "#home", label: "Home" },
              { href: "#about", label: "About" },
              { href: "#services", label: "Services" },
              { href: "#destinations", label: "Destinations" },
              { href: "#booking", label: "Book Now" },
              { href: "#contact", label: "Contact" },
            ].map((link) => (
              <Button key={link.href} variant="ghost" size="sm" asChild>
                <a href={link.href}>{link.label}</a>
              </Button>
            ))}
          </div>

          <Separator className="w-full max-w-md" />

          <p className="text-muted-foreground text-xs text-center">
            © {new Date().getFullYear()} LankaRides. Premium Car Hire Service in Sri Lanka. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
