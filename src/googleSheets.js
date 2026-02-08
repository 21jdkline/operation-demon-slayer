/**
 * Google Sheets Integration for Operation Demon Slayer
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Paste the code from scripts/google-apps-script.js
 * 4. Run initializeSheets() function to create all tabs
 * 5. Deploy as Web App (Execute as: Me, Access: Anyone)
 * 6. Copy the deployment URL and add to app Settings
 * 
 * SHEETS (auto-created by initializeSheets):
 *   - DailyLog: date, time, metric, value, notes
 *   - Workouts: date, type, name, duration, exercises, nasalPercent, hrr, notes
 *   - Weekly: date, week, medStatus, asrs6Score, cogTests
 *   - DeepTests: date, week, medStatus, testName, scores
 *   - GripStrength: date, leftHand, rightHand
 *   - OuraData: date, hrvAvg, respiratoryRate, sleep metrics
 *   - AppleHealth: date, hrvMorning, restingHR, activity
 */

// Get URL from localStorage (set in app Settings) or env
const getGoogleScriptUrl = () => {
  return localStorage.getItem('googleScriptUrl') || import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';
};

// Check if Google Sheets is configured
export const isGoogleSheetsConfigured = () => {
  const url = getGoogleScriptUrl();
  return url && url.length > 0;
};

// Generic function to send data to Google Sheets
export const sendToGoogleSheets = async (sheet, data) => {
  const GOOGLE_SCRIPT_URL = getGoogleScriptUrl();
  
  if (!isGoogleSheetsConfigured()) {
    console.log('Google Sheets not configured. Data:', { sheet, data });
    // Store locally as fallback
    saveToLocalStorage(sheet, data);
    return { success: true, mode: 'local' };
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Google Apps Script requires this
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sheet,
        data,
        timestamp: new Date().toISOString(),
      }),
    });
    
    // no-cors mode doesn't give us response data, so we assume success
    console.log('Sent to Google Sheets:', { sheet, data });
    // Also save locally for offline access
    saveToLocalStorage(sheet, { ...data, synced: true });
    return { success: true, mode: 'sheets' };
  } catch (error) {
    console.error('Google Sheets error:', error);
    // Fallback to local storage
    saveToLocalStorage(sheet, data);
    return { success: false, error: error.message, mode: 'local-fallback' };
  }
};

// Local storage fallback
const saveToLocalStorage = (sheet, data) => {
  const key = `adhd_${sheet}`;
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  existing.push({
    ...data,
    timestamp: new Date().toISOString(),
    synced: data.synced || false,
  });
  localStorage.setItem(key, JSON.stringify(existing));
};

// Get unsynced local data (for manual sync later)
export const getUnsyncedData = () => {
  const sheets = ['DailyLog', 'Workouts', 'Weekly', 'DeepTests', 'GripStrength'];
  const unsynced = {};
  
  sheets.forEach(sheet => {
    const key = `adhd_${sheet}`;
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    const pending = data.filter(d => !d.synced);
    if (pending.length > 0) {
      unsynced[sheet] = pending;
    }
  });
  
  return unsynced;
};

// ============================================
// SPECIFIC LOGGING FUNCTIONS
// ============================================

export const logDailyMetric = async (metric, value, notes = '') => {
  const today = new Date().toISOString().split('T')[0];
  return sendToGoogleSheets('DailyLog', {
    date: today,
    metric,
    value,
    notes,
  });
};

export const logWorkout = async (workoutData) => {
  const today = new Date().toISOString().split('T')[0];
  return sendToGoogleSheets('Workouts', {
    date: today,
    ...workoutData,
  });
};

export const logWeekly = async (weeklyData) => {
  const today = new Date().toISOString().split('T')[0];
  return sendToGoogleSheets('Weekly', {
    date: today,
    ...weeklyData,
  });
};

export const logDeepTest = async (testName, scores, week, medicationStatus) => {
  const today = new Date().toISOString().split('T')[0];
  return sendToGoogleSheets('DeepTests', {
    date: today,
    testName,
    value: scores,
    week,
    medicationStatus,
  });
};

export const logGripStrength = async (left, right) => {
  const today = new Date().toISOString().split('T')[0];
  return sendToGoogleSheets('GripStrength', {
    date: today,
    left,
    right,
  });
};

export const logSupplements = async (supplementData) => {
  const today = new Date().toISOString().split('T')[0];
  return sendToGoogleSheets('Supplements', {
    date: today,
    ...supplementData,
  });
};

// ============================================
// FETCH DATA (for trends)
// ============================================

export const fetchFromGoogleSheets = async (sheet, dateRange = 'all') => {
  const GOOGLE_SCRIPT_URL = getGoogleScriptUrl();
  
  if (!isGoogleSheetsConfigured()) {
    // Return local data
    const key = `adhd_${sheet}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  try {
    const url = `${GOOGLE_SCRIPT_URL}?sheet=${sheet}&range=${dateRange}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    // Fallback to local
    const key = `adhd_${sheet}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
};

// Get all local data for export
export const getAllLocalData = () => {
  const sheets = ['DailyLog', 'Workouts', 'Weekly', 'DeepTests', 'GripStrength'];
  const allData = {};
  
  sheets.forEach(sheet => {
    const key = `adhd_${sheet}`;
    allData[sheet] = JSON.parse(localStorage.getItem(key) || '[]');
  });
  
  return allData;
};
