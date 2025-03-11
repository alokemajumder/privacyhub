/*
  # Initial Schema Setup

  1. New Tables
    - `analyses`
      - `id` (integer, primary key, auto-increment)
      - `brand_name` (text, not null)
      - `site_name` (text, not null)
      - `site_url` (text, not null)
      - `logo_url` (text, not null)
      - `screenshot_url` (text, not null)
      - `summary` (text)
      - `scores` (text, not null, JSON string)
      - `total_score` (integer, not null)
      - `max_total_score` (integer, not null)
      - `analysis_date` (text, not null)
      - `last_updated` (integer, not null)
      - `created_at` (integer, not null, default CURRENT_TIMESTAMP)

  2. Indexes
    - `brand_name_idx` on `brand_name`
    - `site_url_idx` on `site_url`
    - `last_updated_idx` on `last_updated`
*/

CREATE TABLE IF NOT EXISTS analyses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  brand_name TEXT NOT NULL,
  site_name TEXT NOT NULL,
  site_url TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  screenshot_url TEXT NOT NULL,
  summary TEXT,
  scores TEXT NOT NULL,
  total_score INTEGER NOT NULL,
  max_total_score INTEGER NOT NULL,
  analysis_date TEXT NOT NULL,
  last_updated INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS brand_name_idx ON analyses (brand_name);
CREATE INDEX IF NOT EXISTS site_url_idx ON analyses (site_url);
CREATE INDEX IF NOT EXISTS last_updated_idx ON analyses (last_updated);