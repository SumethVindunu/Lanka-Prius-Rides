"use client";

import jsPDF from "jspdf";
import { toast } from "sonner";
import type { Booking } from "@/app/admin/dashboard/page";

interface BookingPdfExportProps {
  booking: Booking;
}

export function downloadBookingPDF(b: Booking) {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 12;
    const contentWidth = pageWidth - margin * 2;

    const COLORS = {
      primary: [6, 182, 212] as [number, number, number],
      secondary: [249, 115, 22] as [number, number, number],
      dark: [31, 41, 55] as [number, number, number],
      text: [55, 65, 81] as [number, number, number],
      muted: [107, 114, 128] as [number, number, number],
      light: [248, 250, 252] as [number, number, number],
      border: [229, 231, 235] as [number, number, number],
      white: [255, 255, 255] as [number, number, number],
      success: [22, 163, 74] as [number, number, number],
      warning: [234, 88, 12] as [number, number, number],
    };

    const formatTime = (time: string) => {
      if (!time) return "-";
      const [hours, minutes] = time.split(":").map(Number);
      const period = hours >= 12 ? "PM" : "AM";
      const hour = hours % 12 || 12;
      return `${hour}:${String(minutes).padStart(2, "0")} ${period}`;
    };

    const formatDate = (date: string) => {
      if (!date) return "-";
      const d = new Date(date);
      if (Number.isNaN(d.getTime())) return date;
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const formatDateTime = (iso: string) => {
      if (!iso) return "-";
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return iso;
      const dateStr = d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      const timeStr = formatTime(
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
      );
      return `${dateStr} at ${timeStr}`;
    };

    const safeFileName = (name: string) => {
      return name
        .trim()
        .replace(/[^a-zA-Z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase();
    };

    const drawBox = (x: number, y: number, width: number, height: number, fill?: [number, number, number]) => {
      if (fill) {
        doc.setFillColor(...fill);
        doc.roundedRect(x, y, width, height, 2, 2, "F");
      }
      doc.setDrawColor(...COLORS.border);
      doc.setLineWidth(0.3);
      doc.roundedRect(x, y, width, height, 2, 2, "S");
    };

    // =========================================================
    // HEADER
    // =========================================================

    doc.setFillColor(...COLORS.primary);
    doc.rect(0, 0, pageWidth, 26, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(...COLORS.white);
    doc.text("LANKA", margin, 14);

    doc.setTextColor(...COLORS.secondary);
    doc.text("RIDES", margin + 36, 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(230, 250, 252);
    doc.text("Premium Car Hire Service in Sri Lanka", margin, 21);
    doc.text("www.lankarides.lk  •  info@lankarides.lk  •  +94 77 123 4567", margin, 26);

    // =========================================================
    // BOOKING REFERENCE
    // =========================================================

    let y = 31;

    drawBox(margin, y, contentWidth, 14, COLORS.light);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(...COLORS.muted);
    doc.text("BOOKING REFERENCE", margin + 5, y + 5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.dark);
    doc.text(`LR-${String(b.id).padStart(5, "0")}`, margin + 5, y + 12);

    const statusText = b.confirmed ? "CONFIRMED" : "PENDING";
    const statusFill = b.confirmed ? COLORS.success : COLORS.warning;

    doc.setFillColor(...statusFill);
    doc.roundedRect(pageWidth - margin - 28, y + 3, 24, 8, 4, 4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(...COLORS.white);
    doc.text(statusText, pageWidth - margin - 16, y + 8, { align: "center" });

    y += 19;

    // =========================================================
    // CUSTOMER + BOOKING INFO (two columns)
    // =========================================================

    const leftCol = margin + 4;
    const rightCol = margin + contentWidth / 2 + 2;

    drawBox(margin, y, contentWidth, 36, COLORS.light);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.primary);
    doc.text("CUSTOMER INFORMATION", leftCol, y + 5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(...COLORS.muted);
    doc.text("Full Name:", leftCol, y + 11);
    doc.text("Email:", leftCol, y + 16);
    doc.text("Phone:", leftCol, y + 21);
    doc.text("Nationality:", leftCol, y + 26);
    doc.text("Passengers:", leftCol, y + 31);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.dark);
    doc.text(b.fullName || "-", leftCol + 22, y + 11);
    doc.text(b.email || "-", leftCol + 22, y + 16);
    doc.text(b.phone || "-", leftCol + 22, y + 21);
    doc.text(b.nationality || "-", leftCol + 22, y + 26);
    doc.text(String(b.passengers || "-"), leftCol + 22, y + 31);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.secondary);
    doc.text("BOOKING DETAILS", rightCol, y + 5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(...COLORS.muted);
    doc.text("Created:", rightCol, y + 11);
    doc.text("Status:", rightCol, y + 16);
    doc.text("Confirmed:", rightCol, y + 21);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.dark);
    doc.text(formatDateTime(b.createdAt), rightCol + 18, y + 11);
    doc.text(b.status.toUpperCase(), rightCol + 18, y + 16);
    doc.text(b.confirmed ? "YES" : "NO", rightCol + 18, y + 21);

    y += 40;

    // =========================================================
    // TRIP DETAILS
    // =========================================================

    const tripBoxHeight = 48;

    drawBox(margin, y, contentWidth, tripBoxHeight);

    doc.setFillColor(...COLORS.primary);
    doc.circle(margin + 8, y + 10, 2.2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.primary);
    doc.text("PICKUP", margin + 14, y + 9);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.dark);
    const pickupLines = doc.splitTextToSize(b.pickupLocation || "-", contentWidth - 30);
    doc.text(pickupLines, margin + 14, y + 16);

    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.6);
    doc.line(margin + 8, y + 19, margin + 8, y + 28);

    doc.setFillColor(...COLORS.secondary);
    doc.circle(margin + 8, y + 32, 2.2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.secondary);
    doc.text("DROP-OFF", margin + 14, y + 31);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.dark);
    const dropoffLines = doc.splitTextToSize(b.dropoffLocation || "-", contentWidth - 30);
    doc.text(dropoffLines, margin + 14, y + 38);

    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.3);
    doc.line(margin + 7, y + 42, pageWidth - margin - 7, y + 42);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(...COLORS.muted);
    doc.text("DATE", margin + 7, y + 47);
    doc.text("TIME", margin + 60, y + 47);
    doc.text("PAX", margin + 105, y + 47);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.dark);
    doc.text(formatDate(b.pickupDate), margin + 7, y + 52);
    doc.text(formatTime(b.pickupTime), margin + 60, y + 52);
    doc.text(String(b.passengers || "-"), margin + 105, y + 52);

    y += tripBoxHeight + 6;

    // =========================================================
    // SPECIAL REQUESTS
    // =========================================================

    if (b.specialRequests) {
      const reqLines = doc.splitTextToSize(b.specialRequests, contentWidth - 16);
      const reqHeight = Math.max(12, reqLines.length * 3.5 + 6);

      drawBox(margin, y, contentWidth, reqHeight, [255, 247, 237]);

      doc.setFillColor(...COLORS.secondary);
      doc.roundedRect(margin, y, 2.5, reqHeight, 1, 1, "F");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...COLORS.text);
      doc.text(reqLines, margin + 6, y + 6);

      y += reqHeight + 5;
    }

    // =========================================================
    // FOOTER
    // =========================================================

    const footerY = pageHeight - 10;

    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(...COLORS.muted);
    doc.text("Lanka Rides • Premium Car Hire Service in Sri Lanka", margin, footerY);
    doc.text("info@lankarides.lk • +94 77 123 4567", pageWidth / 2, footerY, { align: "center" });
    doc.text(`LR-${String(b.id).padStart(5, "0")}`, pageWidth - margin, footerY, { align: "right" });

    // =========================================================
    // SAVE
    // =========================================================

    const customerName = safeFileName(b.fullName || "customer");

    doc.save(
      `Lanka-Rides-Booking-LR-${String(b.id).padStart(5, "0")}-${customerName}.pdf`
    );

    toast.success("Booking confirmation PDF downloaded");
  } catch (error) {
    console.error("PDF generation error:", error);
    toast.error("Failed to generate PDF");
  }
}
