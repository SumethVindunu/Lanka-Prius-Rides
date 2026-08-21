"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Fuel,
  Users,
  Snowflake,
  Wifi,
  BatteryCharging,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const specs = [
  { icon: Fuel, label: "Hybrid Engine", detail: "Fuel-efficient" },
  { icon: Users, label: "4 Passengers", detail: "Comfortable seats" },
  { icon: Snowflake, label: "Air Conditioned", detail: "Climate control" },
  { icon: Wifi, label: "Free Wi-Fi", detail: "Stay connected" },
  { icon: BatteryCharging, label: "Phone Charging", detail: "USB ports" },
  { icon: ShieldCheck, label: "Full Insurance", detail: "Total coverage" },
];

export default function FleetSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="fleet" className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 font-orbitron">
            <span className="text-white">THE </span>
            <span className="gradient-text">FLEET</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Travel in our well-maintained Toyota Prius — the perfect blend of
            comfort, efficiency, and style.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Car showcase */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <Card className="overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-orange-500/10 blur-3xl" />
              <CardContent className="p-0 relative">
                <img
                  src="/images/hero-car.svg"
                  alt="Toyota Prius Fleet"
                  className="w-full rounded-2xl"
                />
                {/* Price badge */}
                <div className="absolute top-4 right-4 z-20">
                  <Card className="px-4 py-2 bg-card/90 backdrop-blur-sm">
                    <CardContent className="p-0">
                      <div className="text-cyan-400 text-xs font-medium">Starting from</div>
                      <div className="text-white text-xl font-bold font-orbitron">
                        $25<span className="text-sm text-gray-400">/trip</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Specs */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-white mb-2 font-orbitron">
              TOYOTA PRIUS
            </h3>
            <Separator className="w-20 mb-4" />
            <p className="text-gray-400 mb-8">
              The world&apos;s most popular hybrid car — spacious trunk for
              luggage, smooth ride quality, and exceptional fuel economy for
              those long scenic drives.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {specs.map((spec, i) => (
                <motion.div
                  key={spec.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                >
                  <Card className="p-4 hover:border-cyan-500/30">
                    <CardContent className="p-0 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                        <spec.icon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">
                          {spec.label}
                        </div>
                        <div className="text-gray-500 text-xs">{spec.detail}</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex gap-2">
              <Badge>Hybrid</Badge>
              <Badge variant="orange">Eco-Friendly</Badge>
              <Badge variant="success">Well-Maintained</Badge>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
