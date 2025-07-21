import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cameras = pgTable("cameras", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
});

export const incidents = pgTable("incidents", {
  id: serial("id").primaryKey(),
  cameraId: integer("camera_id").references(() => cameras.id).notNull(),
  type: text("type").notNull(), // 'Unauthorised Access', 'Gun Threat', 'Face Recognised', etc.
  tsStart: timestamp("ts_start").notNull(),
  tsEnd: timestamp("ts_end").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  resolved: boolean("resolved").default(false).notNull(),
});

export const insertCameraSchema = createInsertSchema(cameras).omit({
  id: true,
});

export const insertIncidentSchema = createInsertSchema(incidents).omit({
  id: true,
});

export type InsertCamera = z.infer<typeof insertCameraSchema>;
export type Camera = typeof cameras.$inferSelect;
export type InsertIncident = z.infer<typeof insertIncidentSchema>;
export type Incident = typeof incidents.$inferSelect;

// Extended type for incidents with camera info
export type IncidentWithCamera = Incident & {
  camera: Camera;
};
