"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const contactMethods = [
  {
    icon: Phone,
    title: "Call Us",
    detail: "+94 77 123 4567",
    sub: "Available 24/7",
    href: "tel:+94771234567",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    detail: "+94 77 123 4567",
    sub: "Quick response",
    href: "https://wa.me/94771234567",
  },
  {
    icon: Mail,
    title: "Email",
    detail: "info@lankarides.lk",
    sub: "Reply within 24h",
    href: "mailto:info@lankarides.lk",
  },
  {
    icon: MapPin,
    title: "Based In",
    detail: "Sri Lanka",
    sub: "Island-wide service",
    href: "#",
  },
];

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 font-orbitron">
            <span className="text-white">GET IN </span>
            <span className="gradient-text">TOUCH</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Have questions? Reach out anytime — we&apos;re here to help plan your
            perfect Sri Lanka trip.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactMethods.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="h-full text-center group hover:border-cyan-500/30">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                    <c.icon className="w-7 h-7 text-cyan-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-1">{c.title}</h3>
                  <p className="text-cyan-400 text-sm font-medium">{c.detail}</p>
                  <p className="text-gray-500 text-xs mt-1 mb-4">{c.sub}</p>
                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        c.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      Connect →
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
