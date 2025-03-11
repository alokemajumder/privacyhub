import { openDB, type IDBPDatabase } from 'idb';
import { PrivacyAnalysis } from '../types';
import { toast } from 'react-toastify';

const DB_NAME = 'privacyhub';
const STORE_NAME = 'analyses';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase | null = null;

// Initialize database
const initializeDB = async () => {
  if (dbInstance) return dbInstance;

  try {
    dbInstance = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create analyses store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true
          });
          
          // Create indexes for faster querying
          store.createIndex('brandName', 'brandName');
          store.createIndex('siteUrl', 'siteUrl');
          store.createIndex('lastUpdated', 'lastUpdated');
        }
      }
    });

    return dbInstance;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    toast.error('Failed to initialize database. Some features may be limited.');
    return null;
  }
};

// Save analysis
export const saveAnalysis = async (analysis: PrivacyAnalysis): Promise<PrivacyAnalysis> => {
  const db = await initializeDB();
  if (!db) throw new Error('Database not initialized');

  try {
    // Add brandName if not present
    if (!analysis.brandName) {
      analysis.brandName = extractBrandName(analysis.siteName, analysis.siteUrl);
    }

    // Add lastUpdated timestamp
    analysis.lastUpdated = Date.now();

    const id = await db.add(STORE_NAME, analysis);
    return { ...analysis, id };
  } catch (error) {
    console.error('Error saving analysis:', error);
    throw new Error('Failed to save analysis');
  }
};

// Get all analyses
export const getAllAnalyses = async (): Promise<PrivacyAnalysis[]> => {
  const db = await initializeDB();
  if (!db) return [];

  try {
    return await db.getAll(STORE_NAME);
  } catch (error) {
    console.error('Error getting analyses:', error);
    return [];
  }
};

// Get latest analyses
export const getLatestAnalyses = async (limit = 10): Promise<PrivacyAnalysis[]> => {
  const db = await initializeDB();
  if (!db) return [];

  try {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('lastUpdated');
    
    const analyses = await index.getAll(null, limit);
    return analyses.sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0));
  } catch (error) {
    console.error('Error getting latest analyses:', error);
    return [];
  }
};

// Delete analysis
export const deleteAnalysis = async (analysis: PrivacyAnalysis): Promise<void> => {
  const db = await initializeDB();
  if (!db) return;

  try {
    if (analysis.id) {
      await db.delete(STORE_NAME, analysis.id);
    } else {
      // If no ID, try to find by URL
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const index = store.index('siteUrl');
      const key = await index.getKey(analysis.siteUrl);
      if (key) {
        await store.delete(key);
      }
    }
  } catch (error) {
    console.error('Error deleting analysis:', error);
    throw new Error('Failed to delete analysis');
  }
};

// Update analysis
export const updateAnalysis = async (analysis: PrivacyAnalysis): Promise<PrivacyAnalysis> => {
  const db = await initializeDB();
  if (!db) throw new Error('Database not initialized');

  try {
    // Update lastUpdated timestamp
    analysis.lastUpdated = Date.now();

    if (analysis.id) {
      await db.put(STORE_NAME, analysis);
      return analysis;
    } else {
      // If no ID, try to find by URL
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const index = store.index('siteUrl');
      const key = await index.getKey(analysis.siteUrl);
      
      if (key) {
        const existingAnalysis = await store.get(key);
        const updatedAnalysis = { ...existingAnalysis, ...analysis };
        await store.put(updatedAnalysis);
        return updatedAnalysis;
      } else {
        // If not found, create new
        const id = await store.add(analysis);
        return { ...analysis, id };
      }
    }
  } catch (error) {
    console.error('Error updating analysis:', error);
    throw new Error('Failed to update analysis');
  }
};

// Helper function to extract brand name
export const extractBrandName = (siteName: string, siteUrl: string): string => {
  try {
    // Common words to remove
    const commonWords = ['privacy', 'policy', 'legal', 'terms', 'conditions', 'of', 'and', 'the'];
    
    // Try to extract from siteName first
    let brandName = siteName
      .split(/[-|]/) // Split on common separators
      .map(part => part.trim())
      .filter(part => part.length > 0)[0] // Take first part
      .toLowerCase();
    
    // Clean up brandName
    brandName = brandName
      .split(' ')
      .filter(word => !commonWords.includes(word.toLowerCase()))
      .join(' ');
    
    // If brandName is empty or too generic, try domain name
    if (!brandName || brandName.length < 2) {
      const domain = new URL(siteUrl).hostname
        .replace('www.', '')
        .split('.')[0];
      
      brandName = domain
        .split('-')
        .filter(word => !commonWords.includes(word.toLowerCase()))
        .join(' ');
    }
    
    // Capitalize first letter of each word
    return brandName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  } catch (error) {
    console.error('Error extracting brand name:', error);
    return siteName; // Fallback to siteName if extraction fails
  }
};