import TOML from '@iarna/toml';
import { PrivacyAnalysis } from '../types';

export const saveAnalysisToTOML = (analysis: any): string => {
  return TOML.stringify(analysis);
};

export const loadAnalysisFromTOML = (tomlString: string): any => {
  try {
    return TOML.parse(tomlString);
  } catch (error) {
    console.error('Error parsing TOML:', error);
    return null;
  }
};

// Save to localStorage
export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    const tomlString = saveAnalysisToTOML(data);
    localStorage.setItem(key, tomlString);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Load from localStorage
export const loadFromLocalStorage = (key: string): any => {
  try {
    const tomlString = localStorage.getItem(key);
    if (!tomlString) return null;
    return loadAnalysisFromTOML(tomlString);
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

// Get all analyses from localStorage
export const getAllAnalyses = (): any[] => {
  const analyses: any[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('privacy_analysis_')) {
      const analysis = loadFromLocalStorage(key);
      if (analysis) {
        analyses.push(analysis);
      }
    }
  }
  return analyses;
};

// Delete analysis from localStorage
export const deleteAnalysis = (analysis: PrivacyAnalysis): void => {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('privacy_analysis_')) {
        const storedAnalysis = loadFromLocalStorage(key);
        if (storedAnalysis && storedAnalysis.siteUrl === analysis.siteUrl) {
          localStorage.removeItem(key);
          return;
        }
      }
    }
  } catch (error) {
    console.error('Error deleting analysis:', error);
  }
};

// Update existing analysis
export const updateAnalysis = (analysis: PrivacyAnalysis): void => {
  try {
    let existingKey = '';
    
    // Find the existing key
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('privacy_analysis_')) {
        const storedAnalysis = loadFromLocalStorage(key);
        if (storedAnalysis && storedAnalysis.siteUrl === analysis.siteUrl) {
          existingKey = key;
          break;
        }
      }
    }
    
    if (existingKey) {
      // Update the existing analysis
      saveToLocalStorage(existingKey, analysis);
    } else {
      // Create a new entry
      const key = `privacy_analysis_${analysis.siteName}_${Date.now()}`;
      saveToLocalStorage(key, analysis);
    }
  } catch (error) {
    console.error('Error updating analysis:', error);
  }
};