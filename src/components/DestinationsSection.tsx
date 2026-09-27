"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const destinations = [
  {
    name: "Colombo",
    desc: "Capital city, shopping, nightlife",
    time: "Airport → 45 min",
    emoji: "🏙️",
    highlights: "Gangaramaya Temple, Galle Face Green, Pettah Market",
  },
  {
    name: "Kandy",
    desc: "Temple of Tooth, cultural capital",
    time: "Airport → 3.5 hrs",
    emoji: "🏛️",
    highlights: "Temple of the Sacred Tooth Relic, Kandy Lake, Royal Botanical Gardens",
  },
  {
    name: "Ella",
    desc: "Nine Arch Bridge, hiking paradise",
    time: "Airport → 6 hrs",
    emoji: "🌄",
    highlights: "Nine Arch Bridge, Little Adam's Peak, Ravana Falls",
  },
  {
    name: "Galle",
    desc: "Dutch fort, southern charm",
    time: "Airport → 2.5 hrs",
    emoji: "🏰",
    highlights: "Galle Fort, Lighthouse, Unawatuna Beach",
  },
  {
    name: "Sigiriya",
    desc: "Lion Rock, ancient palace",
    time: "Airport → 4 hrs",
    emoji: "🦁",
    highlights: "Sigiriya Rock Fortress, Pidurangala Rock, Dambulla Cave Temple",
  },
  {
    name: "Yala",
    desc: "Wildlife safari, leopards",
    time: "Airport → 5 hrs",
    emoji: "🐆",
    highlights: "Leopard Safaris, Elephants, Bird Watching",
  },
  {
    name: "Mirissa",
    desc: "Whale watching, beaches",
    time: "Airport → 3 hrs",
    emoji: "🐋",
    highlights: "Whale Watching, Coconut Tree Hill, Secret Beach",
  },
  {
    name: "Nuwara Eliya",
    desc: "Tea country, cool climate",
    time: "Airport → 5 hrs",
    emoji: "🍵",
    highlights: "Tea Plantations, Gregory Lake, Horton Plains",
  },
];

export default function DestinationsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="destinations" className="relative py-24 overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url(/images/destinations.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 font-orbitron">
            <span className="text-white">POPULAR </span>
            <span className="gradient-text">DESTINATIONS</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Discover the most beautiful places in Sri Lanka. We&apos;ll take you
            there in comfort and style.
          </p>
        </motion.div>

        <TooltipProvider delayDuration={200}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {destinations.map((dest, i) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Card className="h-full p-5 cursor-default hover:-translate-y-1 hover:border-primary/30 transition-all duration-300">
                        <CardContent className="p-0">
                          <div className="text-4xl mb-3">{dest.emoji}</div>
                          <h3 className="text-lg font-semibold text-white mb-1 font-orbitron">
                            {dest.name}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-3">{dest.desc}</p>
                          <Badge variant="outline" className="text-xs">
                            <MapPin className="w-3 h-3 mr-1" />
                            {dest.time}
                          </Badge>
                        </CardContent>
                      </Card>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-[250px]">
                    <p className="font-semibold text-amber-400 mb-1">Highlights:</p>
                    <p className="text-xs">{dest.highlights}</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </section>
  );
}
