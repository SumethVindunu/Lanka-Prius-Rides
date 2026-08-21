import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { desc } from "drizzle-orm";
import { sendBookingEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      fullName,
      email,
      phone,
      nationality,
      pickupLocation,
      pickupLat,
      pickupLng,
      pickupMapUrl,
      dropoffLocation,
      dropoffLat,
      dropoffLng,
      dropoffMapUrl,
      pickupDate,
      pickupTime,
      passengers,
      specialRequests,
    } = body;

    // Validation
    if (
      !fullName ||
      !email ||
      !phone ||
      !nationality ||
      !pickupLocation ||
      !dropoffLocation ||
      !pickupDate ||
      !pickupTime ||
      !passengers
    ) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    const [booking] = await db
      .insert(bookings)
      .values({
        fullName,
        email,
        phone,
        nationality,
        pickupLocation,
        pickupLat: pickupLat ? String(pickupLat) : null,
        pickupLng: pickupLng ? String(pickupLng) : null,
        pickupMapUrl: pickupMapUrl || null,
        dropoffLocation,
        dropoffLat: dropoffLat ? String(dropoffLat) : null,
        dropoffLng: dropoffLng ? String(dropoffLng) : null,
        dropoffMapUrl: dropoffMapUrl || null,
        pickupDate,
        pickupTime,
        passengers: String(passengers),
        specialRequests: specialRequests || null,
      })
      .returning();

    sendBookingEmail(booking).catch((err) =>
      console.error("Booking email notification error:", err)
    );

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allBookings = await db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.createdAt));

    return NextResponse.json({ bookings: allBookings });
  } catch (error) {
    console.error("Fetch bookings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
