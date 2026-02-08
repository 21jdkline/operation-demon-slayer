/**
 * OPERATION DEMON SLAYER - Google Apps Script
 * 
 * SETUP:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire file
 * 4. Save (Ctrl+S)
 * 5. Click "Deploy" > "New deployment"
 * 6. Choose "Web app"
 * 7. Set "Execute as" to "Me"
 * 8. Set "Who has access" to "Anyone"
 * 9. Click "Deploy"
 * 10. Copy the Web App URL and add it to your .env file as VITE_GOOGLE_SCRIPT_URL
 * 
 * SHEET STRUCTURE (tabs will be auto-created):
 * - DailyLog: date, time, metric, value, notes
 * - Workouts: date, type, duration, exercises, nasalPercent, hrr, notes
 * - Weekly: date, week, medStatus, asrs6Score, cogTests, deepTest, deepTestScores
 * - DeepTests: date, week, medStatus, testName, scores (TMT-A/B, N-Back, Go/No-Go)
 * - GripStrength: date, leftHand, rightHand
 * - OuraData: date, hrvAvg, respiratoryRate, deepSleep, remSleep, sleepScore
 * - AppleHealth: date, hrvMorning, restingHR, activeCalories, steps
 */

// Handle POST requests (data coming in)
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(data.sheet);
    
    if (!sheet) {
      // Create sheet if it doesn't exist
      SpreadsheetApp.getActiveSpreadsheet().insertSheet(data.sheet);
      sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(data.sheet);
      // Add headers based on sheet type
      addHeaders(sheet, data.sheet);
    }
    
    // Add the row
    const row = formatRow(data.sheet, data.data, data.timestamp);
    sheet.appendRow(row);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (fetching data)
function doGet(e) {
  try {
    const sheetName = e.parameter.sheet || 'DailyLog';
    const range = e.parameter.range || 'all';
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    // Filter by date range if specified
    let filteredRows = rows;
    if (range !== 'all') {
      const daysAgo = parseInt(range) || 30;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - daysAgo);
      
      filteredRows = rows.filter(row => {
        const rowDate = new Date(row[0]);
        return rowDate >= cutoff;
      });
    }
    
    // Convert to objects
    const result = filteredRows.map(row => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i];
      });
      return obj;
    });
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Add headers for new sheets
function addHeaders(sheet, sheetName) {
  const headers = {
    'DailyLog': ['date', 'time', 'metric', 'value', 'notes'],
    'Workouts': ['date', 'type', 'name', 'duration', 'exercises', 'nasalPercent', 'hrr', 'notes'],
    'Weekly': ['date', 'week', 'medStatus', 'asrs6Score', 'asrs6Responses', 'spatialSpan', 'featureMatch', 'stroop'],
    'DeepTests': ['date', 'week', 'medStatus', 'testName', 'score1', 'score1Label', 'score2', 'score2Label'],
    'GripStrength': ['date', 'leftHand', 'rightHand'],
    'EveningRatings': ['date', 'focus', 'taskInitiation', 'emotionalReg', 'mentalEnergy', 'restlessness'],
    'Weight': ['date', 'weight'],
    'Supplements': ['date', 'morning', 'preworkout', 'sleep', 'notes'],
    'OuraData': ['date', 'hrvAvg', 'hrvMin', 'hrvMax', 'respiratoryRate', 'deepSleep', 'remSleep', 'lightSleep', 'awake', 'sleepScore', 'readinessScore'],
    'AppleHealth': ['date', 'hrvMorning', 'restingHR', 'activeCalories', 'steps', 'exerciseMinutes'],
  };
  
  if (headers[sheetName]) {
    sheet.appendRow(headers[sheetName]);
    sheet.getRange(1, 1, 1, headers[sheetName].length).setFontWeight('bold');
  }
}

// Format row based on sheet type
function formatRow(sheetName, data, timestamp) {
  const date = new Date(timestamp);
  const dateStr = Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const timeStr = Utilities.formatDate(date, Session.getScriptTimeZone(), 'HH:mm:ss');
  
  switch (sheetName) {
    case 'DailyLog':
      return [dateStr, timeStr, data.metric || data.type, data.value, data.notes || ''];
      
    case 'Workouts':
      return [
        dateStr,
        data.workoutType || data.type,
        data.workout || data.name,
        data.duration || '',
        JSON.stringify(data.exercises || []),
        data.nasalPercent || '',
        data.hrr || '',
        data.notes || ''
      ];
      
    case 'Weekly':
      return [
        dateStr,
        data.week || '',
        data.medStatus || data.medicationStatus || '',
        data.asrs6Score || '',
        JSON.stringify(data.asrs6Responses || []),
        data.spatialSpan || '',
        data.featureMatch || '',
        data.stroop || ''
      ];
    
    case 'DeepTests':
      // Handle TMT, N-Back, Go/No-Go
      const scores = data.value || data.scores || {};
      const testName = data.testName || '';
      let score1 = '', score1Label = '', score2 = '', score2Label = '';
      
      if (testName === 'TMT') {
        score1 = scores.tmtA || '';
        score1Label = 'TMT-A (sec)';
        score2 = scores.tmtB || '';
        score2Label = 'TMT-B (sec)';
      } else if (testName === 'N-Back') {
        score1 = scores.nBackAccuracy || '';
        score1Label = 'Accuracy (%)';
        score2 = scores.nBackLevel || '';
        score2Label = 'N Level';
      } else if (testName === 'Go/No-Go') {
        score1 = scores.goNoGoRT || '';
        score1Label = 'RT (ms)';
        score2 = scores.goNoGoErrors || '';
        score2Label = 'Errors';
      }
      
      return [
        dateStr,
        data.week || '',
        data.medStatus || data.medicationStatus || '',
        testName,
        score1,
        score1Label,
        score2,
        score2Label
      ];
    
    case 'GripStrength':
      return [
        dateStr,
        data.left || data.value?.left || '',
        data.right || data.value?.right || ''
      ];
    
    case 'EveningRatings':
      const ratings = data.value || data;
      return [
        dateStr,
        ratings.focus || '',
        ratings.taskInitiation || '',
        ratings.emotionalReg || '',
        ratings.mentalEnergy || '',
        ratings.restlessness || ''
      ];
    
    case 'Weight':
      return [
        dateStr,
        data.value || data.weight || ''
      ];
      
    default:
      // Generic: just dump all data
      return [dateStr, timeStr, JSON.stringify(data)];
  }
}

// Scheduled function to fetch Oura data (run daily via trigger)
function fetchOuraData() {
  const OURA_TOKEN = PropertiesService.getScriptProperties().getProperty('OURA_TOKEN');
  if (!OURA_TOKEN) {
    Logger.log('No Oura token configured');
    return;
  }
  
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = Utilities.formatDate(yesterday, 'UTC', 'yyyy-MM-dd');
  
  // Fetch sleep data
  const sleepUrl = `https://api.ouraring.com/v2/usercollection/sleep?start_date=${dateStr}&end_date=${dateStr}`;
  const sleepResponse = UrlFetchApp.fetch(sleepUrl, {
    headers: { 'Authorization': `Bearer ${OURA_TOKEN}` }
  });
  const sleepData = JSON.parse(sleepResponse.getContentText());
  
  // Fetch daily readiness
  const readinessUrl = `https://api.ouraring.com/v2/usercollection/daily_readiness?start_date=${dateStr}&end_date=${dateStr}`;
  const readinessResponse = UrlFetchApp.fetch(readinessUrl, {
    headers: { 'Authorization': `Bearer ${OURA_TOKEN}` }
  });
  const readinessData = JSON.parse(readinessResponse.getContentText());
  
  // Process and save
  if (sleepData.data && sleepData.data.length > 0) {
    const sleep = sleepData.data[0];
    const readiness = readinessData.data && readinessData.data[0];
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OuraData');
    if (sheet) {
      sheet.appendRow([
        dateStr,
        sleep.average_hrv || '',
        sleep.lowest_heart_rate || '',
        '', // max HRV not in API
        sleep.average_breath || '',
        Math.round((sleep.deep_sleep_duration || 0) / 60), // minutes
        Math.round((sleep.rem_sleep_duration || 0) / 60),
        Math.round((sleep.light_sleep_duration || 0) / 60),
        Math.round((sleep.awake_time || 0) / 60),
        sleep.score || '',
        readiness ? readiness.score : ''
      ]);
    }
  }
}

// Set up daily Oura fetch trigger
function setupOuraTrigger() {
  // Delete existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'fetchOuraData') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Create new daily trigger at 8am
  ScriptApp.newTrigger('fetchOuraData')
    .timeBased()
    .atHour(8)
    .everyDays(1)
    .create();
    
  Logger.log('Oura trigger set up for 8am daily');
}

// Initialize all sheets
function initializeSheets() {
  const sheetNames = ['DailyLog', 'Workouts', 'Weekly', 'DeepTests', 'GripStrength', 'EveningRatings', 'Weight', 'OuraData', 'AppleHealth'];
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  sheetNames.forEach(name => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
      addHeaders(sheet, name);
      Logger.log('Created sheet: ' + name);
    }
  });
  
  Logger.log('All sheets initialized!');
}

// Test function
function test() {
  Logger.log('Script is working!');
  Logger.log('Sheets available:');
  SpreadsheetApp.getActiveSpreadsheet().getSheets().forEach(sheet => {
    Logger.log('- ' + sheet.getName());
  });
}
