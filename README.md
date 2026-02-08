# Defeating ADHD

A personal ADHD protocol tracking app with breathing exercises, workout logging, symptom tracking, and data integration with Google Sheets, Oura Ring, and Apple Health.

## 🎯 What This Tracks

### Daily Metrics
- **Mackenzie Exhale Test** - Primary breathing metric (replaces BOLT)
- **Morning HRV** - Heart rate variability via Polar H10
- **Nostril Dominance** - Nasal cycle tracking
- **8 Symptom Domains** - Focus, task initiation, impulsivity, etc.
- **Reaction Time** - Via Human Benchmark

### Breathing Protocols
- Coherent Breathing (5.5-5.5 protocol)
- CO2 Tolerance Training (Buteyko)
- Right Nostril Breathing (Surya Bhedana) - Focus
- Left Nostril Breathing (Chandra Bhedana) - Sleep

### Workouts
- Yates HIT (Push/Pull/Legs)
- Norwegian 4×4 HIIT
- Zone 2 Cardio (Nasal Only)
- Home KB/BB
- Daily Mobility

### Weekly Cognitive Battery

All tests performed every Sunday, 8-9am. Odd weeks = UNMEDICATED, Even weeks = MEDICATED.

| Test | Measures | Platform |
|------|----------|----------|
| **TMT-A & B** | Processing speed, cognitive flexibility | TMT-Lite (phone app) |
| **Stroop** | Response inhibition | [cognition.run](https://3rrzyovd9q.cognition.run) |
| **Flanker** | Conflict monitoring, selective attention | [cognition.run](https://bc50jfnfsa.cognition.run) |
| **Go/No-Go** | Impulse control | [cognition.run](https://sketgsdcac.cognition.run) |
| **Attention Span** | Sustained attention | [cognition.run](https://g0zegupaji.cognition.run) |

> Stroop, Flanker, Go/No-Go, and Attention Span require a laptop/desktop with keyboard.

**Daily:** Reaction Time via [Human Benchmark](https://humanbenchmark.com/tests/reactiontime)
**Weekly:** ASRS-6 Questionnaire (self-report)

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/defeating-adhd.git
cd defeating-adhd
npm install
```

### 2. Set Up Google Sheets Backend

1. Create a new Google Sheet
2. Create these tabs: `DailyLog`, `Workouts`, `Weekly`, `Symptoms`, `OuraData`
3. Go to **Extensions > Apps Script**
4. Copy contents of `scripts/google-apps-script.js` into the editor
5. Save and click **Deploy > New Deployment**
6. Choose **Web app**, set access to **Anyone**
7. Copy the deployment URL

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env and add your Google Script URL
```

### 4. Run Locally
```bash
npm run dev
```

### 5. Deploy to GitHub Pages
```bash
npm run build
# Push to GitHub, enable Pages from Settings
```

## 📊 Data Architecture

```
┌─────────────────┐     ┌──────────────────┐
│   React App     │────▶│  Google Sheets   │
│   (GitHub Pages)│     │  (Database)      │
└─────────────────┘     └──────────────────┘
                               ▲
                               │ Apps Script
                               │ (scheduled)
                        ┌──────┴──────┐
                        │  Oura API   │
                        └─────────────┘
```

### Google Sheet Structure

| Tab | Columns |
|-----|---------|
| DailyLog | date, time, metric, value, notes |
| Workouts | date, type, name, duration, exercises, nasalPercent, hrr, notes |
| Symptoms | date, focus, taskInitiation, impulsivity, emotionalReg, workingMemory, timeAwareness, mentalEnergy, restlessness |
| Weekly | date, asrs6Score, cognitiveTests, screenTime, taskCompletion |
| OuraData | date, hrvAvg, respiratoryRate, deepSleep, remSleep, sleepScore |

## 🔌 Integrations

### Oura Ring (Automatic)
1. Get Personal Access Token from [Oura Cloud](https://cloud.ouraring.com/personal-access-tokens)
2. In Google Apps Script: **Project Settings > Script Properties**
3. Add property: `OURA_TOKEN` = your token
4. Run `setupOuraTrigger()` once to enable daily auto-fetch

### Apple Health (via Shortcuts)
Create an iOS Shortcut that:
1. Gets Health samples (HRV, Resting HR, Steps)
2. Formats as JSON
3. POSTs to your Google Apps Script URL

Example Shortcut actions:
```
Get Health Samples (HRV, today)
Get Health Samples (Resting HR, today)
Get variable (combine into dictionary)
Get contents of URL (POST to Google Script)
```

### Polar H10 (via HRV4Training)
- HRV4Training exports to Apple Health
- Or manually log morning HRV in the app

## 📱 Install as PWA

On iPhone:
1. Open the app in Safari
2. Tap Share → Add to Home Screen
3. App will run like a native app

## 🧪 12-Week Experiment Protocol

**Phase 1 (Week 1):** Baseline - measure only, no interventions
**Phase 2 (Weeks 2-6):** Add all breathing protocols + mouth taping
**Phase 3 (Weeks 7-10):** Integrate nasal breathing into workouts
**Phase 4 (Weeks 11-12):** Analysis and comparison

### Success Criteria
| Metric | Target |
|--------|--------|
| Mackenzie Exhale | +15-30 seconds |
| ASRS-6 | 3+ point decrease |
| Cognitive Tests | 10-15% improvement |
| Morning HRV | Upward trend |

## 📚 Research Foundation

Based on:
- James Nestor's "Breath" bibliography (400+ papers)
- Brian Mackenzie's breathing protocols
- Patrick McKeown's Buteyko method
- Lin 2014 (5.5 breaths/min optimal)
- Bernardi 2001 (rosary prayer/yoga mantras)
- Singh 2016, Pal 2014 (nostril-specific effects)

## 📄 License

MIT - Do whatever you want with it.

## 🤝 Contributing

This is a personal project, but PRs welcome if you find bugs or have improvements.
