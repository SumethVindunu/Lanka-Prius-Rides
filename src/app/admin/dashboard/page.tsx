"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock,
  Mail,
  MapPin,
  Phone,
  Users,
  Trash2,
  Eye,
  Pencil,
  CheckCircle,
  XCircle,
  ShieldCheck,
  ExternalLink,
  Copy,
  FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { downloadBookingPDF } from "@/components/BookingPdfExport";
import { toast } from "sonner";

export interface Booking {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  pickupLocation: string;
  pickupMapUrl: string | null;
  dropoffLocation: string;
  dropoffMapUrl: string | null;
  pickupDate: string;
  pickupTime: string;
  passengers: string;
  specialRequests: string | null;
  status: string;
  confirmed: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [deleting, setDeleting] = useState<Booking | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    status: "pending",
    confirmed: "false",
    specialRequests: "",
  });
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth");
    if (!auth) {
      router.push("/admin");
      return;
    }
    fetchBookings();
  }, [router]);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const openView = (b: Booking) => {
    setSelected(b);
    setForm({ status: b.status, confirmed: String(b.confirmed), specialRequests: b.specialRequests || "" });
  };

  const openEdit = (b: Booking) => {
    setEditing(b);
    setForm({ status: b.status, confirmed: String(b.confirmed), specialRequests: b.specialRequests || "" });
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/bookings/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: form.status,
          confirmed: form.confirmed === "true",
          specialRequests: form.specialRequests,
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Booking updated");
      setEditing(null);
      fetchBookings();
    } catch {
      toast.error("Failed to update booking");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      const res = await fetch(`/api/admin/bookings/${deleting.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Booking deleted");
      setDeleting(null);
      fetchBookings();
    } catch {
      toast.error("Failed to delete booking");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    router.push("/admin");
  };

  const statusColor = (s: string) => {
    if (s === "confirmed") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (s === "pending") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-red-500/10 text-red-400 border-red-500/20";
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Copied ${label} to clipboard`);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      b.id.toString().includes(query) ||
      b.fullName.toLowerCase().includes(query) ||
      b.phone.toLowerCase().includes(query) ||
      b.nationality.toLowerCase().includes(query) ||
      b.email.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white font-orbitron">ADMIN DASHBOARD</h1>
            <p className="text-gray-400 mt-1">Manage appointments and bookings</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <ShieldCheck className="w-4 h-4" /> Logout
          </Button>
        </div>

        <Card className="border-cyan-500/10 mt-4">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="font-orbitron">Appointments</CardTitle>
                <CardDescription>{filteredBookings.length} result(s) from {bookings.length} total</CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Input
                   placeholder="Search ID, name, phone, email, country"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-xs"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-400 text-center py-12">Loading...</p>
            ) : filteredBookings.length === 0 ? (
              <p className="text-gray-500 text-center py-12">No bookings match your filters.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-card-border text-gray-400">
                      <th className="py-3 px-4 font-medium">ID</th>
                      <th className="py-3 px-4 font-medium">Customer</th>
                      <th className="py-3 px-4 font-medium">Route</th>
                      <th className="py-3 px-4 font-medium">Date/Time</th>
                      <th className="py-3 px-4 font-medium">Status</th>
                      <th className="py-3 px-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="border-b border-card-border/50 hover:bg-white/[0.02]">
                        <td className="py-3 px-4 text-gray-300 font-mono">#{b.id}</td>
                        <td className="py-3 px-4">
                          <div className="text-white font-medium">{b.fullName}</div>
                          <div className="text-gray-500 text-xs">{b.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 text-gray-300">
                            <MapPin className="w-3 h-3 text-cyan-400" />
                            <span className="truncate max-w-[200px]">{b.pickupLocation}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-300 mt-1">
                            <MapPin className="w-3 h-3 text-orange-400" />
                            <span className="truncate max-w-[200px]">{b.dropoffLocation}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="w-3 h-3 text-cyan-400" />
                            {b.pickupDate}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            {b.pickupTime}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className={statusColor(b.status)}>
                            {b.confirmed ? (
                              <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Confirmed</span>
                            ) : (
                              <span className="flex items-center gap-1"><XCircle className="w-3 h-3" /> {b.status}</span>
                            )}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openView(b)} title="View">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openEdit(b)} title="Edit">
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleting(b)} title="Delete" className="text-red-400 hover:text-red-300">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-orbitron">Booking Details</DialogTitle>
            <DialogDescription>Viewing booking #{selected?.id}</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Full Name</p>
                  <p className="text-white">{selected.fullName}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Email</p>
                  <p className="text-white">{selected.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Phone</p>
                  <p className="text-white">{selected.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Nationality</p>
                  <p className="text-white">{selected.nationality}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Passengers</p>
                  <p className="text-white">{selected.passengers}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Status</p>
                  <Badge variant="outline" className={statusColor(selected.status)}>
                    {selected.status}
                  </Badge>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-gray-500 text-xs mb-1">Pickup</p>
                <p className="text-white flex items-center gap-2"><MapPin className="w-3 h-3 text-cyan-400" /> {selected.pickupLocation}</p>
                <p className="text-gray-400 text-xs mt-1">{selected.pickupDate} at {selected.pickupTime}</p>
                {selected.pickupMapUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    <a href={selected.pickupMapUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Open Map
                    </a>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => copyToClipboard(selected.pickupMapUrl!, "pickup URL")}>
                      <Copy className="w-3 h-3 mr-1" /> Copy URL
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Drop-off</p>
                <p className="text-white flex items-center gap-2"><MapPin className="w-3 h-3 text-orange-400" /> {selected.dropoffLocation}</p>
                {selected.dropoffMapUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    <a href={selected.dropoffMapUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-400 hover:underline flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Open Map
                    </a>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => copyToClipboard(selected.dropoffMapUrl!, "drop-off URL")}>
                      <Copy className="w-3 h-3 mr-1" /> Copy URL
                    </Button>
                  </div>
                )}
              </div>
              {selected.specialRequests && (
                <div>
                  <p className="text-gray-500 text-xs mb-1">Special Requests</p>
                  <p className="text-gray-300">{selected.specialRequests}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => downloadBookingPDF(selected!)} className="gap-2">
              <FileDown className="w-4 h-4" /> Download PDF
            </Button>
            <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-orbitron">Edit Booking #{editing?.id}</DialogTitle>
            <DialogDescription>Update status and notes</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Confirmed</Label>
              <Select value={form.confirmed} onValueChange={(v) => setForm({ ...form, confirmed: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Special Requests</Label>
              <Textarea
                value={form.specialRequests}
                onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="btn-shine">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-orbitron">Delete Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete booking #{deleting?.id} for {deleting?.fullName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} className="gap-2">
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
