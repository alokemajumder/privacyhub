import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

export function getDatabase() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'data', 'privacy-analyses.db');
    db = new Database(dbPath);
    
    // Create tables if they don't exist
    initializeDatabase();
  }
  return db;
}

function initializeDatabase() {
  if (!db) return;

  // Create analyses table
  db.exec(`
    CREATE TABLE IF NOT EXISTS analyses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      hostname TEXT NOT NULL,
      overall_score REAL NOT NULL,
      privacy_grade TEXT NOT NULL,
      risk_level TEXT NOT NULL,
      gdpr_compliance TEXT NOT NULL,
      ccpa_compliance TEXT NOT NULL,
      dpdp_act_compliance TEXT,
      analysis_data TEXT NOT NULL,
      screenshot_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Add DPDP Act compliance column to existing tables if it doesn't exist
  try {
    db.exec(`ALTER TABLE analyses ADD COLUMN dpdp_act_compliance TEXT`);
    console.log('Added dpdp_act_compliance column to existing table');
  } catch {
    // Column already exists, ignore error
  }

  // Create index on hostname for fast lookups
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_analyses_hostname ON analyses(hostname);
  `);

  // Create index on created_at for recent analyses
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);
  `);

  console.log('Database initialized successfully');
}

export interface StoredAnalysis {
  id: number;
  url: string;
  hostname: string;
  overall_score: number;
  privacy_grade: string;
  risk_level: string;
  gdpr_compliance: string;
  ccpa_compliance: string;
  dpdp_act_compliance?: string;
  analysis_data: string;
  screenshot_url: string | null;
  created_at: string;
  updated_at: string;
}

export function saveAnalysis(
  url: string,
  analysisResult: {
    overall_score: number;
    privacy_grade: string;
    risk_level: string;
    regulatory_compliance: {
      gdpr_compliance: string;
      ccpa_compliance: string;
      dpdp_act_compliance?: string;
    };
  },
  screenshotUrl?: string
): number {
  const db = getDatabase();
  
  const hostname = new URL(url).hostname;
  
  const stmt = db.prepare(`
    INSERT INTO analyses (
      url, hostname, overall_score, privacy_grade, risk_level,
      gdpr_compliance, ccpa_compliance, dpdp_act_compliance, analysis_data, screenshot_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    url,
    hostname,
    analysisResult.overall_score,
    analysisResult.privacy_grade,
    analysisResult.risk_level,
    analysisResult.regulatory_compliance.gdpr_compliance,
    analysisResult.regulatory_compliance.ccpa_compliance,
    analysisResult.regulatory_compliance.dpdp_act_compliance || null,
    JSON.stringify(analysisResult),
    screenshotUrl || null
  );

  return result.lastInsertRowid as number;
}

export function getRecentAnalyses(limit: number = 10, offset: number = 0): StoredAnalysis[] {
  const db = getDatabase();
  
  const stmt = db.prepare(`
    SELECT * FROM analyses
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `);

  return stmt.all(limit, offset) as StoredAnalysis[];
}

export function getAnalysesByHostname(hostname: string): StoredAnalysis[] {
  const db = getDatabase();
  
  const stmt = db.prepare(`
    SELECT * FROM analyses
    WHERE hostname = ?
    ORDER BY created_at DESC
  `);

  return stmt.all(hostname) as StoredAnalysis[];
}

export function getAnalysisStats() {
  const db = getDatabase();
  
  const totalAnalyses = db.prepare('SELECT COUNT(*) as count FROM analyses').get() as { count: number };
  
  const gradeDistribution = db.prepare(`
    SELECT privacy_grade, COUNT(*) as count
    FROM analyses
    GROUP BY privacy_grade
    ORDER BY privacy_grade
  `).all() as Array<{ privacy_grade: string; count: number }>;

  const riskDistribution = db.prepare(`
    SELECT risk_level, COUNT(*) as count
    FROM analyses
    GROUP BY risk_level
    ORDER BY 
      CASE risk_level
        WHEN 'HIGH' THEN 1
        WHEN 'MODERATE-HIGH' THEN 2
        WHEN 'MODERATE' THEN 3
        WHEN 'LOW' THEN 4
        WHEN 'EXEMPLARY' THEN 5
      END
  `).all() as Array<{ risk_level: string; count: number }>;

  const avgScore = db.prepare('SELECT AVG(overall_score) as avg_score FROM analyses').get() as { avg_score: number };

  return {
    totalAnalyses: totalAnalyses.count,
    averageScore: avgScore.avg_score || 0,
    gradeDistribution,
    riskDistribution
  };
}