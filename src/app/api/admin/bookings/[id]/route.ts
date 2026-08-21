import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { status, confirmed, specialRequests } = body;

    const [updated] = await db
      .update(bookings)
      .set({
        status: status ?? undefined,
        confirmed: confirmed ?? undefined,
        specialRequests: specialRequests ?? undefined,
      })
      .where(eq(bookings.id, Number(id)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    console.error("Update booking error:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const [deleted] = await db.delete(bookings).where(eq(bookings.id, Number(id))).returning();
    if (!deleted) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete booking error:", error);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
