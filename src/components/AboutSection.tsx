"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { User, Award, Clock, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const features = [
  {
    icon: User,
    title: "Personal Driver",
    desc: "Friendly, English-speaking local driver who knows every corner of Sri Lanka.",
  },
  {
    icon: Award,
    title: "Licensed & Insured",
    desc: "Fully licensed with comprehensive insurance for your peace of mind.",
  },
  {
    icon: Clock,
    title: "24/7 Available",
    desc: "Available round the clock for airport pickups, tours, and emergency rides.",
  },
  {
    icon: Heart,
    title: "Eco-Friendly",
    desc: "Toyota Prius hybrid — comfortable, fuel-efficient, and eco-conscious.",
  },
];

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 font-orbitron">
            <span className="text-white">WHY CHOOSE </span>
            <span className="gradient-text">US</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            More than just a ride — it&apos;s your personal gateway to experiencing
            the beauty of Sri Lanka with comfort and safety.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <Card className="h-full p-6 group cursor-default hover:border-primary/30">
                <CardContent className="p-0">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-7 h-7 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 font-orbitron">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bio card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16"
        >
          <Card className="p-8 lg:p-12">
            <CardContent className="p-0 flex flex-col lg:flex-row gap-8 items-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-orange-500/30 flex items-center justify-center shrink-0 ring-2 ring-primary/20 ring-offset-4 ring-offset-background">
                <span className="text-5xl">🧑‍✈️</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 font-orbitron">
                  YOUR TRUSTED DRIVER
                </h3>
                <Separator className="mb-4 w-20" />
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Hi! I&apos;m your dedicated driver based in Sri Lanka. With years of
                  experience driving tourists across the island, I offer a safe,
                  comfortable, and personalized travel experience. My well-maintained
                  Toyota Prius is air-conditioned, spacious, and perfect for
                  exploring everything from Colombo&apos;s bustling streets to the
                  serene hills of Ella and the golden beaches of the south coast.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["English Speaking", "Local Expert", "Flexible Schedule", "Best Rates"].map((tag) => (
                    <Badge key={tag} variant="default">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
