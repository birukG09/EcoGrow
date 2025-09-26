import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Sensor readings table
export const sensorReadings = pgTable("sensor_readings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  temperature: decimal("temperature", { precision: 5, scale: 2 }).notNull(),
  humidity: decimal("humidity", { precision: 5, scale: 2 }).notNull(),
  soilMoisture: decimal("soil_moisture", { precision: 5, scale: 2 }).notNull(),
  lightLevel: integer("light_level").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Control settings table
export const controlSettings = pgTable("control_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  irrigation: boolean("irrigation").default(false).notNull(),
  lighting: boolean("lighting").default(false).notNull(),
  ventilation: boolean("ventilation").default(false).notNull(),
  lightingIntensity: integer("lighting_intensity").default(85).notNull(),
  ventilationSpeed: varchar("ventilation_speed").default("medium").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Plant health analysis table
export const plantAnalysis = pgTable("plant_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  plantName: text("plant_name").notNull(),
  imagePath: text("image_path"),
  healthStatus: varchar("health_status").notNull(),
  analysis: text("analysis"),
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Configuration table
export const configuration = pgTable("configuration", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  plantType: varchar("plant_type").default("tomatoes").notNull(),
  tempMin: decimal("temp_min", { precision: 5, scale: 2 }).default("20.0").notNull(),
  tempMax: decimal("temp_max", { precision: 5, scale: 2 }).default("25.0").notNull(),
  humidityMin: decimal("humidity_min", { precision: 5, scale: 2 }).default("60.0").notNull(),
  humidityMax: decimal("humidity_max", { precision: 5, scale: 2 }).default("70.0").notNull(),
  emailAlerts: boolean("email_alerts").default(true).notNull(),
  pushAlerts: boolean("push_alerts").default(true).notNull(),
  smsAlerts: boolean("sms_alerts").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Activities log table
export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  message: text("message").notNull(),
  type: varchar("type").notNull(), // 'info', 'warning', 'error', 'success'
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Alerts table
export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type").notNull(), // 'temperature', 'humidity', 'soil', 'light', 'system'
  severity: varchar("severity").notNull(), // 'low', 'medium', 'high', 'critical'
  acknowledged: boolean("acknowledged").default(false).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Insert schemas
export const insertSensorReadingSchema = createInsertSchema(sensorReadings).omit({
  id: true,
  timestamp: true,
});

export const insertControlSettingsSchema = createInsertSchema(controlSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertPlantAnalysisSchema = createInsertSchema(plantAnalysis).omit({
  id: true,
  timestamp: true,
});

export const insertConfigurationSchema = createInsertSchema(configuration).omit({
  id: true,
  updatedAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  timestamp: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  timestamp: true,
});

// Types
export type SensorReading = typeof sensorReadings.$inferSelect;
export type InsertSensorReading = z.infer<typeof insertSensorReadingSchema>;

export type ControlSettings = typeof controlSettings.$inferSelect;
export type InsertControlSettings = z.infer<typeof insertControlSettingsSchema>;

export type PlantAnalysis = typeof plantAnalysis.$inferSelect;
export type InsertPlantAnalysis = z.infer<typeof insertPlantAnalysisSchema>;

export type Configuration = typeof configuration.$inferSelect;
export type InsertConfiguration = z.infer<typeof insertConfigurationSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

// User schema (keeping existing)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
