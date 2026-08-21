"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const testimonials = [
  {
    name: "Sarah Williams",
    country: "🇬🇧 United Kingdom",
    text: "Absolutely amazing service! The driver was punctual, friendly, and knew all the best spots. The Prius was super comfortable for our 5-day tour. Highly recommend!",
    rating: 5,
    avatar: "SW",
  },
  {
    name: "Michael Chen",
    country: "🇺🇸 United States",
    text: "Best decision we made for our Sri Lanka trip. Safe driving, great local knowledge, and the car was spotless. Will definitely book again on our next visit.",
    rating: 5,
    avatar: "MC",
  },
  {
    name: "Emma Schmidt",
    country: "🇩🇪 Germany",
    text: "From airport pickup to our final destination, everything was perfect. The driver went above and beyond to make our honeymoon trip special. Thank you!",
    rating: 5,
    avatar: "ES",
  },
  {
    name: "James Anderson",
    country: "🇦🇺 Australia",
    text: "Great value for money. The Prius was comfortable even on long drives through the hill country. Free Wi-Fi and cold water bottles were a nice touch!",
    rating: 5,
    avatar: "JA",
  },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 font-orbitron">
            <span className="text-white">WHAT TOURISTS </span>
            <span className="gradient-text">SAY</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Don&apos;t just take our word for it — hear from travelers who
            explored Sri Lanka with us.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Card className="h-full hover:border-cyan-500/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/30 to-orange-500/30 flex items-center justify-center shrink-0 font-bold text-white text-sm font-orbitron">
                      {t.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-semibold text-sm">
                            {t.name}
                          </div>
                          <div className="text-gray-500 text-xs">{t.country}</div>
                        </div>
                        <Quote className="w-5 h-5 text-cyan-500/20" />
                      </div>
                      <div className="flex gap-0.5 mt-1">
                        {Array.from({ length: t.rating }).map((_, j) => (
                          <Star
                            key={j}
                            className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <Separator className="mb-4" />
                  <p className="text-gray-300 text-sm leading-relaxed italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
