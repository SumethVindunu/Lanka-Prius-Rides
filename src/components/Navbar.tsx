"use client";

import { useState, useEffect } from "react";
import { Menu, X, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#destinations", label: "Destinations" },
  { href: "#fleet", label: "Fleet" },
  { href: "#contact", label: "Contact" },
  { href: "/admin", label: "Admin" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-darker/90 backdrop-blur-xl border-b border-cyan-500/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="relative">
              <Car className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl group-hover:bg-cyan-400/40 transition-all" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-wider text-white font-orbitron">
                LANKA
              </span>
              <span className="text-xl font-bold tracking-wider text-cyan-400 font-orbitron">
                RIDES
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Button key={link.href} variant="ghost" size="sm" asChild>
                <a href={link.href}>{link.label}</a>
              </Button>
            ))}
            <Button variant="outline" size="sm" className="ml-2" asChild>
              <a href="#booking">Book Now</a>
            </Button>
          </div>

          {/* Mobile Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="lg:hidden bg-darker/95 backdrop-blur-xl border-t border-cyan-500/10">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                className="w-full justify-start"
                asChild
              >
                <a
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                >
                  {link.label}
                </a>
              </Button>
            ))}
            <Separator className="my-2" />
            <Button variant="default" className="w-full" asChild>
              <a href="#booking" onClick={() => setIsMobileOpen(false)}>
                Book Now
              </a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
