import { Resend } from "resend";
import { Booking } from "@/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export async function sendBookingEmail(booking: Booking): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured. Booking email not sent.");
    return false;
  }

  const subject = `Booking Confirmed! #${booking.id} - Lanka Rides`;
  const html = buildBookingEmailHtml(booking);
  const text = buildBookingEmailText(booking);

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: booking.email,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("Resend email error:", error);
      return false;
    }

    console.log("Booking confirmation email sent:", data?.id);
    return true;
  } catch (error) {
    console.error("Failed to send booking email:", error);
    return false;
  }
}

function buildBookingEmailHtml(booking: Booking): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="background: linear-gradient(135deg, #06b6d4, #f97316); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Lanka Rides</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0;">Your Premium Transfer Service</p>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #06b6d4;">
          <h2 style="color: #06b6d4; margin: 0 0 5px;">Booking Confirmed!</h2>
          <p style="color: #64748b; margin: 0;">Booking ID: #${booking.id}</p>
        </div>
        
        <p style="font-size: 16px;">Hello <strong>${booking.fullName}</strong>,</p>
        <p>Thank you for choosing Lanka Rides! Your booking has been received successfully. We'll contact you within 24 hours to confirm your ride.</p>
        
        <h3 style="color: #334155; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Booking Details</h3>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background: #f8fafc;">
            <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; width: 40%;">Pickup Location</td>
            <td style="padding: 12px; border: 1px solid #e2e8f0;">${booking.pickupLocation}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">Drop-off Location</td>
            <td style="padding: 12px; border: 1px solid #e2e8f0;">${booking.dropoffLocation}</td>
          </tr>
          <tr style="background: #f8fafc;">
            <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">Date</td>
            <td style="padding: 12px; border: 1px solid #e2e8f0;">${formatDate(booking.pickupDate)}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">Time</td>
            <td style="padding: 12px; border: 1px solid #e2e8f0;">${formatTime(booking.pickupTime)}</td>
          </tr>
          <tr style="background: #f8fafc;">
            <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">Passengers</td>
            <td style="padding: 12px; border: 1px solid #e2e8f0;">${booking.passengers}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">Phone / WhatsApp</td>
            <td style="padding: 12px; border: 1px solid #e2e8f0;"><a href="tel:${booking.phone}">${booking.phone}</a></td>
          </tr>
          <tr style="background: #f8fafc;">
            <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">Email</td>
            <td style="padding: 12px; border: 1px solid #e2e8f0;">${booking.email}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">Nationality</td>
            <td style="padding: 12px; border: 1px solid #e2e8f0;">${booking.nationality}</td>
          </tr>
          ${booking.specialRequests ? `
          <tr style="background: #f8fafc;">
            <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">Special Requests</td>
            <td style="padding: 12px; border: 1px solid #e2e8f0;">${booking.specialRequests}</td>
          </tr>
          ` : ''}
        </table>
        
        <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
          <p style="margin: 0; color: #92400e;"><strong>Note:</strong> No payment is required now. We'll confirm availability and pricing via phone or email within 24 hours.</p>
        </div>
        
        <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; margin: 0 0 10px;">Need help? Contact us:</p>
          <p style="margin: 5px 0;"><a href="tel:+94771234567" style="color: #06b6d4; text-decoration: none;">+94 77 123 4567</a></p>
          <p style="margin: 5px 0;"><a href="mailto:info@lankarides.com" style="color: #06b6d4; text-decoration: none;">info@lankarides.com</a></p>
        </div>
      </div>
    </div>
  `;
}

function buildBookingEmailText(booking: Booking): string {
  return `
BOOKING CONFIRMED! - Lanka Rides
=====================================

Hello ${booking.fullName},

Thank you for choosing Lanka Rides! Your booking has been received successfully. We'll contact you within 24 hours to confirm your ride.

BOOKING DETAILS
---------------
Booking ID: #${booking.id}
Pickup: ${booking.pickupLocation}
Drop-off: ${booking.dropoffLocation}
Date: ${formatDate(booking.pickupDate)}
Time: ${formatTime(booking.pickupTime)}
Passengers: ${booking.passengers}
Phone: ${booking.phone}
Email: ${booking.email}
Nationality: ${booking.nationality}
${booking.specialRequests ? `Special Requests: ${booking.specialRequests}\n` : ''}

NOTE: No payment is required now. We'll confirm availability and pricing within 24 hours.

CONTACT US
----------
Phone: +94 77 123 4567
Email: info@lankarides.com

Thank you for choosing Lanka Rides!
  `.trim();
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { 
    weekday: "long", 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });
}

function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(":").map(Number);
  const hour = h % 12 || 12;
  const period = h >= 12 ? "PM" : "AM";
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}
