import { pgTable, serial, varchar, text, date, time, timestamp, boolean } from "drizzle-orm/pg-core";

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  nationality: varchar("nationality", { length: 100 }).notNull(),
  pickupLocation: varchar("pickup_location", { length: 500 }).notNull(),
  pickupLat: varchar("pickup_lat", { length: 20 }),
  pickupLng: varchar("pickup_lng", { length: 20 }),
  pickupMapUrl: text("pickup_map_url"),
  dropoffLocation: varchar("dropoff_location", { length: 500 }).notNull(),
  dropoffLat: varchar("dropoff_lat", { length: 20 }),
  dropoffLng: varchar("dropoff_lng", { length: 20 }),
  dropoffMapUrl: text("dropoff_map_url"),
  pickupDate: date("pickup_date").notNull(),
  pickupTime: time("pickup_time").notNull(),
  passengers: varchar("passengers", { length: 10 }).notNull(),
  specialRequests: text("special_requests"),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  confirmed: boolean("confirmed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
