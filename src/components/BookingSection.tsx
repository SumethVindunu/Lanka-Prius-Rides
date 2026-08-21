"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { format } from "date-fns";
import {
  CalendarDays,
  Clock,
  User,
  Mail,
  Phone,
  Globe,
  Users,
  MessageSquare,
  CheckCircle,
  Loader2,
  Sparkles,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { toast } from "sonner";
import MapPickerWrapper from "@/components/MapPickerWrapper";
import type { LocationData } from "@/components/MapPickerWrapper";

interface BookingFormState {
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  passengers: string;
  specialRequests: string;
}

const initialForm: BookingFormState = {
  fullName: "",
  email: "",
  phone: "",
  nationality: "",
  passengers: "1",
  specialRequests: "",
};

export default function BookingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<BookingFormState>(initialForm);
  const [pickupLocation, setPickupLocation] = useState<LocationData | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<LocationData | null>(null);
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined);
  const [pickupTime, setPickupTime] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pickupLocation) {
      toast.error("Please select a pickup location on the map");
      return;
    }
    if (!dropoffLocation) {
      toast.error("Please select a drop-off location on the map");
      return;
    }
    if (!pickupDate) {
      toast.error("Please select a pickup date");
      return;
    }
    if (!pickupTime) {
      toast.error("Please select a pickup time");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        pickupLocation: pickupLocation.address,
        pickupLat: pickupLocation.lat,
        pickupLng: pickupLocation.lng,
        pickupMapUrl: pickupLocation.mapUrl,
        dropoffLocation: dropoffLocation.address,
        dropoffLat: dropoffLocation.lat,
        dropoffLng: dropoffLocation.lng,
        dropoffMapUrl: dropoffLocation.mapUrl,
        pickupDate: format(pickupDate, "yyyy-MM-dd"),
        pickupTime,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit booking");
      }

      setSubmitted(true);
      toast.success("Booking submitted successfully!", {
        description: "We'll contact you within 24 hours to confirm.",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      toast.error("Booking failed", { description: message });
    } finally {
      setLoading(false);
    }
  };

  // Format time for display in confirmation
  const formatTimeDisplay = (t: string) => {
    if (!t) return "";
    const [h, m] = t.split(":").map(Number);
    const hour = h % 12 || 12;
    const period = h >= 12 ? "PM" : "AM";
    return `${hour}:${String(m).padStart(2, "0")} ${period}`;
  };

  if (submitted) {
    return (
      <section id="booking" className="relative py-24 overflow-hidden">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-8 sm:p-12 text-center border-cyan-500/20">
              <CardContent className="p-0">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cyan-500/10 flex items-center justify-center animate-pulse-glow">
                  <CheckCircle className="w-10 h-10 text-cyan-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4 font-orbitron">
                  BOOKING CONFIRMED!
                </h2>
                <Separator className="w-20 mx-auto mb-6" />
                <p className="text-gray-400 text-lg mb-2">
                  Thank you, <span className="text-cyan-400 font-semibold">{form.fullName}</span>!
                </p>
                <p className="text-gray-400 mb-6">
                  Your booking request has been received. We&apos;ll contact you at{" "}
                  <span className="text-cyan-400">{form.email}</span> to confirm.
                </p>

                {/* Date & Time summary */}
                <div className="flex justify-center gap-4 mb-6">
                  {pickupDate && (
                    <Badge className="px-3 py-1.5 text-sm">
                      <CalendarDays className="w-3.5 h-3.5 mr-1.5" />
                      {format(pickupDate, "MMM d, yyyy")}
                    </Badge>
                  )}
                  {pickupTime && (
                    <Badge variant="orange" className="px-3 py-1.5 text-sm">
                      <Clock className="w-3.5 h-3.5 mr-1.5" />
                      {formatTimeDisplay(pickupTime)}
                    </Badge>
                  )}
                </div>

                {/* Location summaries */}
                <div className="grid sm:grid-cols-2 gap-3 mb-8 text-left">
                  {pickupLocation && (
                    <Card className="p-3 border-cyan-500/20">
                      <CardContent className="p-0">
                        <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-cyan-400" /> Pickup
                        </div>
                        <p className="text-sm text-gray-300 line-clamp-2 mb-1">
                          {pickupLocation.address}
                        </p>
                        <a
                          href={pickupLocation.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" /> View Map
                        </a>
                      </CardContent>
                    </Card>
                  )}
                  {dropoffLocation && (
                    <Card className="p-3 border-orange-500/20">
                      <CardContent className="p-0">
                        <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-orange-400" /> Drop-off
                        </div>
                        <p className="text-sm text-gray-300 line-clamp-2 mb-1">
                          {dropoffLocation.address}
                        </p>
                        <a
                          href={dropoffLocation.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-orange-400 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" /> View Map
                        </a>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmitted(false);
                    setForm(initialForm);
                    setPickupLocation(null);
                    setDropoffLocation(null);
                    setPickupDate(undefined);
                    setPickupTime("");
                  }}
                >
                  Make Another Booking
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="relative py-24 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 font-orbitron">
            <span className="text-white">BOOK YOUR </span>
            <span className="gradient-text">RIDE</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Select your locations on the map and fill in the details below.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="border-cyan-500/10 hover:border-cyan-500/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <CardTitle className="font-orbitron">Booking Form</CardTitle>
                  <CardDescription>
                    No payment required now. We&apos;ll confirm availability first.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* ===== LOCATION SELECTION ===== */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-medium text-gray-300">Route Selection</span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      Select on map
                    </Badge>
                  </div>

                  {/* Pickup map */}
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-400">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      Pickup Location
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-1">Required</Badge>
                    </Label>
                    <MapPickerWrapper
                      type="pickup"
                      value={pickupLocation}
                      onChange={setPickupLocation}
                    />
                  </div>

                  {/* Route line connector */}
                  {(pickupLocation || dropoffLocation) && (
                    <div className="flex items-center gap-3 px-4">
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-400/50 to-orange-400/50" />
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                      </div>
                       <span className="text-xs text-gray-500">Your route</span>
                    </div>
                  )}

                  {/* Dropoff map */}
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-400">
                      <MapPin className="w-3.5 h-3.5 text-orange-400" />
                      Drop-off Location
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-1">Required</Badge>
                    </Label>
                    <MapPickerWrapper
                      type="dropoff"
                      value={dropoffLocation}
                      onChange={setDropoffLocation}
                    />
                  </div>
                </div>

                <Separator />

                {/* ===== DATE & TIME ===== */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarDays className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-medium text-gray-300">Schedule</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    {/* Date Picker */}
                    <div className="space-y-2">
                      <Label>
                        <CalendarDays className="w-4 h-4 text-cyan-400" />
                        Pickup Date
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-1">Required</Badge>
                      </Label>
                      <DatePicker
                        value={pickupDate}
                        onChange={setPickupDate}
                        placeholder="Select pickup date"
                        minDate={new Date()}
                      />
                    </div>

                    {/* Time Picker */}
                    <div className="space-y-2">
                      <Label>
                        <Clock className="w-4 h-4 text-cyan-400" />
                        Pickup Time
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-1">Required</Badge>
                      </Label>
                      <TimePicker
                        value={pickupTime}
                        onChange={setPickupTime}
                        placeholder="Select pickup time"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* ===== PERSONAL DETAILS ===== */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-medium text-gray-300">Personal Details</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label>
                        <User className="w-4 h-4 text-cyan-400" />
                        Full Name
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-1">Required</Badge>
                      </Label>
                      <Input
                        name="fullName"
                        required
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="John Smith"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label>
                        <Mail className="w-4 h-4 text-cyan-400" />
                        Email
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-1">Required</Badge>
                      </Label>
                      <Input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label>
                        <Phone className="w-4 h-4 text-cyan-400" />
                        Phone / WhatsApp
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-1">Required</Badge>
                      </Label>
                      <Input
                        type="tel"
                        name="phone"
                        required
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+1 234 567 8900"
                      />
                    </div>

                    {/* Nationality */}
                    <div className="space-y-2">
                      <Label>
                        <Globe className="w-4 h-4 text-cyan-400" />
                        Nationality
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-1">Required</Badge>
                      </Label>
                      <Input
                        name="nationality"
                        required
                        value={form.nationality}
                        onChange={handleChange}
                        placeholder="United States"
                      />
                    </div>

                    {/* Passengers */}
                    <div className="space-y-2">
                      <Label>
                        <Users className="w-4 h-4 text-cyan-400" />
                        Passengers
                      </Label>
                      <Select
                        value={form.passengers}
                        onValueChange={(val) =>
                          setForm({ ...form, passengers: val })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select passengers" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Passenger</SelectItem>
                          <SelectItem value="2">2 Passengers</SelectItem>
                          <SelectItem value="3">3 Passengers</SelectItem>
                          <SelectItem value="4">4 Passengers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div className="space-y-2">
                  <Label>
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    Special Requests
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-1">Optional</Badge>
                  </Label>
                  <Textarea
                    name="specialRequests"
                    value={form.specialRequests}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Child seat needed, extra luggage, specific stops..."
                  />
                </div>

                <Separator />

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  size="xl"
                  className="w-full btn-shine"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Confirm Booking
                    </>
                  )}
                </Button>

                <p className="text-gray-500 text-xs text-center">
                  No payment required now. We&apos;ll confirm availability and pricing via email.
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
