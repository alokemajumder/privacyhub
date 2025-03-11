import { PrivacyAnalysis } from '../types';
import { toast } from 'react-toastify';

const DB_NAME = 'privacyhub';
const STORE_NAME = 'analyses';
const DB_VERSION = 1;

let dbInstance: IDBDatabase | null = null;

// Check for IndexedDB support and private mode
const checkIndexedDBSupport = (): boolean => {
  try {
    // Test for basic IndexedDB support
    if (!window.indexedDB) {
      console.error('IndexedDB is not supported');
      return false;
    }

    // Test for private browsing mode
    const testRequest = window.indexedDB.open('test');
    return true;
  } catch (e) {
    console.error('IndexedDB access error (possibly private mode):', e);
    return false;
  }
};

// Initialize the database with fallback
const initDB = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    // Check IndexedDB support first
    if (!checkIndexedDBSupport()) {
      reject(new Error('IndexedDB is not supported or blocked'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      const error = (event.target as IDBOpenDBRequest).error;
      console.error('Failed to open database:', error);
      
      // Check for specific error types
      if (error?.name === 'QuotaExceededError') {
        toast.error('Storage quota exceeded. Please clear some space and try again.');
      } else if (error?.name === 'SecurityError') {
        toast.error('Access to IndexedDB is blocked. Please check your privacy settings.');
      } else {
        toast.error('Failed to access local storage. Some features may be limited.');
      }
      
      reject(error);
    };

    request.onsuccess = () => {
      dbInstance = request.result;

      // Handle connection errors
      dbInstance.onerror = (event) => {
        console.error('Database error:', (event.target as IDBDatabase).error);
        toast.error('A database error occurred. Please refresh the page.');
      };

      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create the analyses store with an auto-incrementing key
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true
        });
        
        // Create indexes for faster querying
        store.createIndex('siteUrl', 'siteUrl', { unique: false });
        store.createIndex('brandName', 'brandName');
        store.createIndex('analysisDate', 'analysisDate');
        store.createIndex('lastUpdated', 'lastUpdated');
      }
    };

    request.onblocked = () => {
      toast.error('Database is blocked. Please close other tabs with this site open.');
      reject(new Error('Database blocked'));
    };
  });
};

// Error handling wrapper with fallback
const handleDBOperation = async <T>(operation: (db: IDBDatabase) => Promise<T>): Promise<T> => {
  try {
    const db = await initDB();
    return await operation(db);
  } catch (error) {
    console.error('Database operation failed:', error);
    
    // Fallback to localStorage if IndexedDB fails
    if (error instanceof Error && error.message.includes('IndexedDB')) {
      toast.warning('Using fallback storage mode. Some features may be limited.');
      return handleLocalStorageFallback(operation);
    }
    
    throw error;
  }
};

// LocalStorage fallback implementation
const handleLocalStorageFallback = async <T>(
  operation: (db: IDBDatabase) => Promise<T>
): Promise<T> => {
  const mockDb = {
    transaction: () => ({
      objectStore: () => ({
        add: (data: any) => {
          const key = `${DB_NAME}_${Date.now()}`;
          localStorage.setItem(key, JSON.stringify(data));
          return { result: data };
        },
        put: (data: any) => {
          const key = `${DB_NAME}_${data.id}`;
          localStorage.setItem(key, JSON.stringify(data));
          return { result: data };
        },
        delete: (id: number) => {
          localStorage.removeItem(`${DB_NAME}_${id}`);
          return { result: undefined };
        },
        getAll: () => {
          const items = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith(DB_NAME)) {
              try {
                const item = JSON.parse(localStorage.getItem(key) || '');
                items.push(item);
              } catch (e) {
                console.error('Error parsing stored item:', e);
              }
            }
          }
          return { result: items };
        }
      })
    })
  } as unknown as IDBDatabase;

  return operation(mockDb);
};

// Save analysis to IndexedDB
export const saveAnalysis = async (analysis: PrivacyAnalysis): Promise<PrivacyAnalysis> => {
  return handleDBOperation(async (db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const brandName = extractBrandName(analysis.siteName, analysis.siteUrl);
      const analysisWithBrand = {
        ...analysis,
        brandName,
        lastUpdated: Date.now()
      };
      
      // Always create a new entry to preserve history
      const addRequest = store.add(analysisWithBrand);
      
      addRequest.onsuccess = () => resolve(analysisWithBrand);
      addRequest.onerror = () => reject(addRequest.error);
    });
  });
};

// Get all analyses from IndexedDB
export const getAllAnalyses = async (): Promise<PrivacyAnalysis[]> => {
  return handleDBOperation(async (db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const analyses = request.result || [];
        // Sort by last updated and filter duplicates keeping only the most recent
        const uniqueAnalyses = analyses
          .sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0))
          .filter((analysis, index, self) => 
            index === self.findIndex(a => a.siteUrl === analysis.siteUrl)
          );
        resolve(uniqueAnalyses);
      };
      
      request.onerror = () => reject(request.error);
    });
  });
};

// Get latest analyses from IndexedDB
export const getLatestAnalyses = async (limit = 10): Promise<PrivacyAnalysis[]> => {
  return handleDBOperation(async (db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('lastUpdated');
      const request = index.openCursor(null, 'prev');
      
      transaction.onerror = () => {
        console.error('Transaction error:', transaction.error);
        reject(new Error('Failed to get latest analyses'));
      };
      
      const results: PrivacyAnalysis[] = [];
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor && results.length < limit) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  });
};

// Delete analysis from IndexedDB
export const deleteAnalysis = async (analysis: PrivacyAnalysis): Promise<void> => {
  return handleDBOperation(async (db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      transaction.onerror = () => {
        console.error('Transaction error:', transaction.error);
        reject(new Error('Failed to delete analysis'));
      };
      
      // If we have the ID, use it directly
      if (analysis.id) {
        const request = store.delete(analysis.id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
        return;
      }
      
      // Otherwise, look up by URL
      const index = store.index('siteUrl');
      const getRequest = index.getKey(analysis.siteUrl);
      
      getRequest.onsuccess = () => {
        if (getRequest.result) {
          const deleteRequest = store.delete(getRequest.result);
          deleteRequest.onsuccess = () => resolve();
          deleteRequest.onerror = () => reject(deleteRequest.error);
        } else {
          resolve(); // Analysis not found, consider it deleted
        }
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    });
  });
};

// Update analysis in IndexedDB
export const updateAnalysis = async (analysis: PrivacyAnalysis): Promise<PrivacyAnalysis> => {
  return handleDBOperation(async (db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      transaction.onerror = () => {
        console.error('Transaction error:', transaction.error);
        reject(new Error('Failed to update analysis'));
      };
      
      // If we have the ID, use it directly
      if (analysis.id) {
        const brandName = extractBrandName(analysis.siteName, analysis.siteUrl);
        const updatedAnalysis = {
          ...analysis,
          brandName,
          lastUpdated: Date.now()
        };
        
        const request = store.put(updatedAnalysis);
        request.onsuccess = () => resolve(updatedAnalysis);
        request.onerror = () => reject(request.error);
        return;
      }
      
      // Otherwise, look up by URL
      const index = store.index('siteUrl');
      const getRequest = index.get(analysis.siteUrl);
      
      getRequest.onsuccess = () => {
        const existingAnalysis = getRequest.result;
        if (existingAnalysis) {
          const brandName = extractBrandName(analysis.siteName, analysis.siteUrl);
          const updatedAnalysis = {
            ...analysis,
            id: existingAnalysis.id,
            brandName,
            lastUpdated: Date.now()
          };
          
          const putRequest = store.put(updatedAnalysis);
          putRequest.onsuccess = () => resolve(updatedAnalysis);
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          reject(new Error('Analysis not found'));
        }
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    });
  });
};

// Helper function to extract brand name
const extractBrandName = (siteName: string, siteUrl: string): string => {
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

// Initialize database and return support status
export const initializeDatabase = async (): Promise<boolean> => {
  try {
    if (!checkIndexedDBSupport()) {
      toast.warning('Using limited storage mode due to browser restrictions.');
      return false;
    }
    
    await initDB();
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return false;
  }
};