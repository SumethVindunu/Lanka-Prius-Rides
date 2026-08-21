"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Plane, Mountain, Building2, Camera, Map, Compass } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const services = [
  {
    icon: Plane,
    title: "Airport Transfers",
    desc: "Hassle-free pickup & drop-off at Bandaranaike International Airport (CMB). Flight tracking included.",
    price: "From $25",
    color: "cyan" as const,
    category: "transfers",
  },
  {
    icon: Mountain,
    title: "Hill Country Tours",
    desc: "Explore Kandy, Nuwara Eliya, Ella, and the stunning tea plantations in the misty highlands.",
    price: "From $60/day",
    color: "orange" as const,
    category: "tours",
  },
  {
    icon: Building2,
    title: "City Tours",
    desc: "Discover Colombo, Galle Fort, and other historic cities with a knowledgeable local guide.",
    price: "From $40/day",
    color: "cyan" as const,
    category: "tours",
  },
  {
    icon: Camera,
    title: "Safari & Wildlife",
    desc: "Visit Yala, Udawalawe, or Minneriya for unforgettable wildlife safari experiences.",
    price: "From $70/day",
    color: "orange" as const,
    category: "tours",
  },
  {
    icon: Map,
    title: "Multi-Day Tours",
    desc: "Customized 3-14 day island tours covering all major attractions at your own pace.",
    price: "Custom Quote",
    color: "cyan" as const,
    category: "custom",
  },
  {
    icon: Compass,
    title: "Custom Itineraries",
    desc: "Tell us your interests, and we'll create the perfect Sri Lanka adventure just for you.",
    price: "Custom Quote",
    color: "orange" as const,
    category: "custom",
  },
];

function ServiceCard({ service, i, isInView }: { service: typeof services[0]; i: number; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: 15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.1 }}
    >
      <Card className="h-full group cursor-default hover:border-cyan-500/30 relative overflow-hidden">
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
            service.color === "cyan"
              ? "bg-gradient-to-br from-cyan-500/5 to-transparent"
              : "bg-gradient-to-br from-orange-500/5 to-transparent"
          }`}
        />
        <CardHeader className="relative z-10">
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center mb-2 ${
              service.color === "cyan"
                ? "bg-cyan-500/10 group-hover:bg-cyan-500/20"
                : "bg-orange-500/10 group-hover:bg-orange-500/20"
            } transition-colors`}
          >
            <service.icon
              className={`w-7 h-7 ${
                service.color === "cyan" ? "text-cyan-400" : "text-orange-400"
              }`}
            />
          </div>
          <CardTitle className="font-orbitron text-lg">{service.title}</CardTitle>
          <CardDescription>{service.desc}</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <Badge variant={service.color === "cyan" ? "default" : "orange"} className="font-orbitron">
            {service.price}
          </Badge>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="relative py-24 overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 font-orbitron">
            <span className="text-white">OUR </span>
            <span className="gradient-text">SERVICES</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            From airport pickups to multi-day island tours, we&apos;ve got your
            Sri Lanka journey covered.
          </p>
        </motion.div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="all">All Services</TabsTrigger>
              <TabsTrigger value="transfers">Transfers</TabsTrigger>
              <TabsTrigger value="tours">Tours</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <ServiceCard key={service.title} service={service} i={i} isInView={isInView} />
              ))}
            </div>
          </TabsContent>

          {["transfers", "tours", "custom"].map((cat) => (
            <TabsContent key={cat} value={cat}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services
                  .filter((s) => s.category === cat)
                  .map((service, i) => (
                    <ServiceCard key={service.title} service={service} i={i} isInView={isInView} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
