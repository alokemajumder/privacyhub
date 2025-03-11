import { sqliteTable, text, integer } from 'drizzle-orm/better-sqlite3';
import { sql } from 'drizzle-orm';
import { z } from 'zod';

// Validation schema for scores
export const ScoreSchema = z.object({
  category: z.string(),
  criteria: z.string(),
  score: z.number(),
  maxScore: z.number(),
  description: z.string().optional(),
  recommendations: z.string().optional()
});

// Validation schema for analysis
export const AnalysisSchema = z.object({
  brandName: z.string(),
  siteName: z.string(),
  siteUrl: z.string().url(),
  logoUrl: z.string().url(),
  screenshotUrl: z.string().url(),
  summary: z.string().optional(),
  scores: z.array(ScoreSchema),
  totalScore: z.number(),
  maxTotalScore: z.number(),
  analysisDate: z.string(),
  lastUpdated: z.number()
});

// Database schema
export const analyses = sqliteTable('analyses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  brandName: text('brand_name').notNull(),
  siteName: text('site_name').notNull(),
  siteUrl: text('site_url').notNull(),
  logoUrl: text('logo_url').notNull(),
  screenshotUrl: text('screenshot_url').notNull(),
  summary: text('summary'),
  scores: text('scores').notNull(), // JSON string
  totalScore: integer('total_score').notNull(),
  maxTotalScore: integer('max_total_score').notNull(),
  analysisDate: text('analysis_date').notNull(),
  lastUpdated: integer('last_updated').notNull(),
  createdAt: integer('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  
  // Add indexes for better performance
  indexes: {
    brandName_idx: { columns: ['brand_name'] },
    siteUrl_idx: { columns: ['site_url'] },
    lastUpdated_idx: { columns: ['last_updated'] }
  }
});