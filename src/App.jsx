import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { CheckCircle, Circle, TrendingUp, Moon, Sun, Activity, Wind, Brain, Timer, Heart, Flame, Snowflake, Pill, Coffee, Utensils, Zap, Dumbbell, Play, Pause, RotateCcw, ChevronDown, ChevronUp, ExternalLink, Plus, Download, ClipboardList, FileText, AlertTriangle, Link, Pencil, Cloud, CloudOff, Scale, Bell, BellOff } from 'lucide-react';
import { sendToGoogleSheets, logDailyMetric, logWorkout, isGoogleSheetsConfigured } from './googleSheets';

// ============================================
// MOTIVATIONAL QUOTES (100)
// ============================================

const MOTIVATIONAL_QUOTES = [
  // Historical Warriors & Leaders
  { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
  { text: "It is not the critic who counts; not the man who points out how the strong man stumbles. The credit belongs to the man who is actually in the arena.", author: "Theodore Roosevelt" },
  { text: "I am not afraid of an army of lions led by a sheep; I am afraid of an army of sheep led by a lion.", author: "Alexander the Great" },
  { text: "Difficulties strengthen the mind, as labor does the body.", author: "Seneca" },
  { text: "No man is free who is not master of himself.", author: "Epictetus" },
  { text: "He who conquers himself is the mightiest warrior.", author: "Confucius" },
  { text: "The only thing we have to fear is fear itself.", author: "Franklin D. Roosevelt" },
  { text: "In the midst of chaos, there is also opportunity.", author: "Sun Tzu" },
  { text: "To be prepared for war is one of the most effective means of preserving peace.", author: "George Washington" },
  { text: "Courage is not the absence of fear, but rather the judgment that something else is more important than fear.", author: "Ambrose Redmoon" },
  { text: "The strength of the wolf is the pack, and the strength of the pack is the wolf.", author: "Rudyard Kipling" },
  { text: "What we do in life echoes in eternity.", author: "Maximus (Gladiator)" },
  { text: "Fortune favors the bold.", author: "Virgil" },
  { text: "A warrior's greatest glory is not in never falling, but in rising every time we fall.", author: "Confucius" },
  { text: "The discipline of desire is the background of character.", author: "John Locke" },
  // Modern Motivational Men
  { text: "Discipline equals freedom.", author: "Jocko Willink" },
  { text: "Don't expect to be motivated every day. You won't be. You have to learn to be disciplined.", author: "Jocko Willink" },
  { text: "Get after it.", author: "Jocko Willink" },
  { text: "The more you sweat in training, the less you bleed in combat.", author: "Richard Marcinko" },
  { text: "Suffering is the best teacher. It forces you to go inward, be still, and examine yourself.", author: "David Goggins" },
  { text: "You are in danger of living a life so comfortable and soft, that you will die without ever realizing your potential.", author: "David Goggins" },
  { text: "Who's gonna carry the boats?", author: "David Goggins" },
  { text: "Stay hard.", author: "David Goggins" },
  { text: "The only easy day was yesterday.", author: "Navy SEALs" },
  { text: "Embrace the suck.", author: "Military Saying" },
  { text: "Pain is weakness leaving the body.", author: "Marines" },
  { text: "Your mind will quit a thousand times before your body will.", author: "Unknown" },
  { text: "Hard times create strong men. Strong men create good times.", author: "G. Michael Hopf" },
  { text: "A man who conquers himself is greater than one who conquers a thousand men in battle.", author: "Buddha" },
  { text: "The body achieves what the mind believes.", author: "Napoleon Hill" },
  // Philosophical & Stoic
  { text: "We suffer more in imagination than in reality.", author: "Seneca" },
  { text: "You have power over your mind, not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
  { text: "The best revenge is to be unlike him who performed the injury.", author: "Marcus Aurelius" },
  { text: "How long are you going to wait before you demand the best for yourself?", author: "Epictetus" },
  { text: "Man cannot remake himself without suffering, for he is both the marble and the sculptor.", author: "Alexis Carrel" },
  { text: "If you are distressed by anything external, the pain is not due to the thing itself, but to your estimate of it.", author: "Marcus Aurelius" },
  { text: "First say to yourself what you would be; and then do what you have to do.", author: "Epictetus" },
  { text: "Begin at once to live, and count each separate day as a separate life.", author: "Seneca" },
  { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
  // Athletes & Competitors
  { text: "I hated every minute of training, but I said, 'Don't quit. Suffer now and live the rest of your life as a champion.'", author: "Muhammad Ali" },
  { text: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi" },
  { text: "The fight is won or lost far away from witnesses—behind the lines, in the gym, and out there on the road.", author: "Muhammad Ali" },
  { text: "I fear not the man who has practiced 10,000 kicks once, but I fear the man who has practiced one kick 10,000 times.", author: "Bruce Lee" },
  { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
  { text: "Champions aren't made in the gyms. Champions are made from something they have deep inside them.", author: "Muhammad Ali" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "Excellence is not a singular act, but a habit. You are what you repeatedly do.", author: "Shaquille O'Neal" },
  { text: "I've missed more than 9000 shots. I've lost almost 300 games. 26 times I've been trusted to take the game winning shot and missed. I've failed over and over again. That is why I succeed.", author: "Michael Jordan" },
  { text: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee" },
  // Business & Success
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
  { text: "Do the hard jobs first. The easy jobs will take care of themselves.", author: "Dale Carnegie" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "If you're going through hell, keep going.", author: "Winston Churchill" },
  { text: "A ship in harbor is safe, but that is not what ships are built for.", author: "John A. Shedd" },
  { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  // Focus & Productivity
  { text: "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus.", author: "Alexander Graham Bell" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Either you run the day or the day runs you.", author: "Jim Rohn" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.", author: "Stephen Covey" },
  { text: "Absorb what is useful, discard what is useless, and add what is specifically your own.", author: "Bruce Lee" },
  { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
  { text: "Small disciplines repeated with consistency every day lead to great achievements gained slowly over time.", author: "John C. Maxwell" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  // Personal Growth & Character
  { text: "The oak fought the wind and was broken, the willow bent when it must and survived.", author: "Robert Jordan" },
  { text: "Be so good they can't ignore you.", author: "Steve Martin" },
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
  { text: "The unexamined life is not worth living.", author: "Socrates" },
  { text: "Character cannot be developed in ease and quiet. Only through experience of trial and suffering can the soul be strengthened.", author: "Helen Keller" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
  { text: "Life shrinks or expands in proportion to one's courage.", author: "Anaïs Nin" },
  { text: "A man's worth is no greater than his ambitions.", author: "Marcus Aurelius" },
  // Breathing & Mind-Body
  { text: "Breath is the bridge which connects life to consciousness, which unites your body to your thoughts.", author: "Thich Nhat Hanh" },
  { text: "When the breath wanders the mind also is unsteady. But when the breath is calmed the mind too will be still.", author: "Hatha Yoga Pradipika" },
  { text: "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.", author: "Thich Nhat Hanh" },
  { text: "Master your breath, let the self be in bliss, contemplate on the sublime within you.", author: "Krishnamacharya" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "Rule your mind or it will rule you.", author: "Horace" },
  { text: "Between stimulus and response there is a space. In that space is our power to choose our response.", author: "Viktor Frankl" },
  { text: "The body benefits from movement, and the mind benefits from stillness.", author: "Sakyong Mipham" },
  { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
  { text: "Tension is who you think you should be. Relaxation is who you are.", author: "Chinese Proverb" },
  // Veterans & Military
  { text: "Lead me, follow me, or get out of my way.", author: "General George Patton" },
  { text: "Sweat more in training, bleed less in war.", author: "Spartan Warriors" },
  { text: "Under pressure, you don't rise to the occasion, you sink to the level of your training.", author: "Navy SEALs" },
  { text: "The only thing that overcomes hard luck is hard work.", author: "Harry Golden" },
  { text: "Bravery is being the only one who knows you're afraid.", author: "Colonel David Hackworth" },
  { text: "It's not about how hard you hit. It's about how hard you can get hit and keep moving forward.", author: "Rocky Balboa" },
  { text: "Cowards die many times before their deaths; the valiant never taste of death but once.", author: "William Shakespeare" },
  { text: "A pint of sweat saves a gallon of blood.", author: "General George Patton" },
  { text: "In preparing for battle I have always found that plans are useless, but planning is indispensable.", author: "Dwight D. Eisenhower" },
  { text: "The more difficult the victory, the greater the happiness in winning.", author: "Pelé" },
];

// ============================================
// DATA & CONSTANTS
// ============================================

const WORKOUTS = {
  A: {
    name: "Push (Gym - Yates HIT)",
    exercises: [
      { id: 'incline_db', name: 'Incline DB Press', warmup: '2×12-15', working: '1×6-10 FAIL', notes: 'Lengthened position' },
      { id: 'flat_bench', name: 'Flat Barbell Bench', warmup: '1×12', working: '1×6-10 FAIL', notes: 'Full ROM' },
      { id: 'cable_fly', name: 'Cable Fly (low-to-high)', warmup: '1×15', working: '1×10-15 FAIL', notes: 'Stretch at bottom' },
      { id: 'ohp', name: 'Overhead Press', warmup: '1×12', working: '1×6-10 FAIL', notes: 'Seated or standing' },
      { id: 'lateral', name: 'Lateral Raise', warmup: '1×15', working: '1×12-15 FAIL', notes: 'Slight lean forward' },
      { id: 'pushdown', name: 'Tricep Pushdown', warmup: '1×15', working: '1×10-15 FAIL', notes: 'Full lockout' },
      { id: 'overhead_tri', name: 'Overhead Tricep Ext', warmup: '-', working: '1×10-15 FAIL', notes: 'Lengthened position' },
    ]
  },
  B: {
    name: "Pull/Legs (Gym - Yates HIT)",
    exercises: [
      { id: 'pullup', name: 'Weighted Pull-ups', warmup: '2×8-10', working: '1×6-10 FAIL', notes: 'Full stretch at bottom' },
      { id: 'yates_row', name: 'Barbell Row (Yates)', warmup: '1×12', working: '1×6-10 FAIL', notes: 'Underhand, 70° angle' },
      { id: 'cable_row', name: 'Cable Row (stretch)', warmup: '1×15', working: '1×10-12 FAIL', notes: 'Let shoulders protract' },
      { id: 'bb_curl', name: 'Barbell Curl', warmup: '1×12', working: '1×8-12 FAIL', notes: 'No swinging' },
      { id: 'incline_curl', name: 'Incline DB Curl', warmup: '-', working: '1×10-12 FAIL', notes: 'Lengthened position' },
      { id: 'leg_press', name: 'Leg Press', warmup: '2×15', working: '1×10-15 FAIL', notes: 'Deep ROM, don\'t lock' },
      { id: 'rdl', name: 'Romanian Deadlift', warmup: '1×12', working: '1×8-12 FAIL', notes: 'Hamstring stretch' },
      { id: 'leg_curl', name: 'Leg Curl', warmup: '1×15', working: '1×10-15 FAIL', notes: 'Full ROM' },
      { id: 'calf', name: 'Calf Raise', warmup: '1×15', working: '1×12-20 FAIL', notes: 'Full stretch, pause top' },
    ]
  },
  C: {
    name: "Home (KB/DB/Barbell)",
    exercises: [
      { id: 'kb_swing', name: 'KB Swings', warmup: '-', working: '3×15-20', notes: 'Hip hinge, explosive' },
      { id: 'goblet', name: 'Goblet Squat', warmup: '-', working: '3×12-15', notes: 'Deep, pause at bottom' },
      { id: 'lm_press', name: 'Landmine Press', warmup: '-', working: '3×10-12/side', notes: 'Standing or kneeling' },
      { id: 'lm_row', name: 'Landmine Row', warmup: '-', working: '3×10-12/side', notes: 'Brace core, pull to hip' },
      { id: 'floor_press', name: 'DB Floor Press', warmup: '-', working: '3×10-12', notes: 'Or use bench' },
      { id: 'clean_press', name: 'KB Clean & Press', warmup: '-', working: '3×8-10/side', notes: 'Full body power' },
      { id: 'curl_bar', name: 'Curl Bar Curls', warmup: '-', working: '3×10-12', notes: 'Strict form' },
      { id: 'tgu', name: 'KB Turkish Get-Up', warmup: '-', working: '2×3/side', notes: 'Slow, controlled' },
      { id: 'farmer', name: 'Farmer Carry', warmup: '-', working: '3×40-60 sec', notes: 'Heavy, grip + core' },
    ]
  },
  '4x4': {
    name: "Norwegian 4×4 HIIT",
    type: 'cardio',
    exercises: [
      { id: 'warmup', name: 'Warm-up', duration: '5-10 min', notes: 'Easy cardio, nasal breathing' },
      { id: 'interval1', name: 'Interval 1', duration: '4 min', notes: '85-95% max HR' },
      { id: 'recovery1', name: 'Recovery 1', duration: '3 min', notes: 'Active recovery, nasal' },
      { id: 'interval2', name: 'Interval 2', duration: '4 min', notes: '85-95% max HR' },
      { id: 'recovery2', name: 'Recovery 2', duration: '3 min', notes: 'Active recovery' },
      { id: 'interval3', name: 'Interval 3', duration: '4 min', notes: '85-95% max HR' },
      { id: 'recovery3', name: 'Recovery 3', duration: '3 min', notes: 'Active recovery' },
      { id: 'interval4', name: 'Interval 4', duration: '4 min', notes: '85-95% max HR' },
      { id: 'cooldown', name: 'Cool-down', duration: '5 min', notes: 'Easy cardio, nasal' },
    ]
  },
  'zone2': {
    name: "Zone 2 Cardio (Nasal Only)",
    type: 'cardio',
    exercises: [
      { id: 'warmup', name: 'Warm-up', duration: '5 min', notes: 'Easy pace, nasal breathing only' },
      { id: 'main', name: 'Main Set', duration: '20-40 min', notes: '60-70% max HR, nasal ONLY. If you must mouth breathe, slow down.' },
      { id: 'cooldown', name: 'Cool-down', duration: '5 min', notes: 'Easy walk, nasal' },
    ]
  },
  D: {
    name: "Daily Mobility (10-15 min)",
    type: 'mobility',
    exercises: [
      { id: 'cat_cow', name: 'Cat-Cow', duration: '1 min', notes: 'Sync with breath', detailed: 'Hands/knees. Inhale: drop belly, lift chest (cow). Exhale: round spine, tuck chin (cat). Move slowly.' },
      { id: 'world_greatest', name: 'World\'s Greatest Stretch', duration: '2 min', notes: '5-6 reps/side', detailed: 'Lunge forward, hands inside foot. Rotate torso, reach to ceiling. Hold 3s. Straighten front leg for hamstring.' },
      { id: 't_spine', name: 'T-Spine Rotation', duration: '1 min', notes: 'Follow hand with eyes', detailed: 'Side-lying, knees bent 90°. Top arm forward. Rotate arm overhead to other side, eyes follow hand.' },
      { id: '90_90', name: '90/90 Hip Switches', duration: '2 min', notes: 'Sit tall, control it', detailed: 'Sit with legs at 90°. Lift knees, rotate hips to switch. Move slowly with control.' },
      { id: 'hip_flexor', name: 'Half-Kneeling Hip Flexor', duration: '2 min', notes: '1 min/side', detailed: 'Kneel, squeeze back glute, tuck pelvis. Lean forward maintaining position. Feel hip flexor stretch.' },
      { id: 'shoulder_cars', name: 'Shoulder CARs', duration: '2 min', notes: '5 circles each way', detailed: 'Controlled Articular Rotations. Largest possible circle without moving torso. 30+ sec per rotation.' },
      { id: 'deep_squat', name: 'Deep Squat Hold', duration: '2 min', notes: 'Heels down, breathe', detailed: 'Feet shoulder-width, sink deep, heels flat. Push knees out. Breathe and relax into it.' },
      { id: 'dead_hang', name: 'Dead Hang', duration: '1 min', notes: 'Decompress spine', detailed: 'Grip bar, hang. Passive or active shoulders. Breathe. Let spine decompress.' },
    ]
  },
};

const WEEKLY_SCHEDULE = {
  Mon: { workout: 'A', training: 'Push (Gym)', recovery: 'Sauna + Breathing' },
  Tue: { workout: '4x4', training: 'Norwegian 4×4', recovery: 'Cold (optional)' },
  Wed: { workout: 'C', training: 'Home KB/BB', recovery: 'Mobility' },
  Thu: { workout: 'B', training: 'Pull/Legs (Gym)', recovery: 'Sauna + Breathing' },
  Fri: { workout: '4x4', training: 'Norwegian 4×4', recovery: 'Cold (optional)' },
  Sat: { workout: 'C', training: 'Home KB/BB', recovery: 'Sauna + Breathing' },
  Sun: { workout: 'rest', training: 'REST', recovery: 'Extended NSDR' },
};

const ASRS6_QUESTIONS = [
  "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
  "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
  "How often do you have problems remembering appointments or obligations?",
  "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
  "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
  "How often do you feel overly active and compelled to do things, like you were driven by a motor?",
];

const NOSTRIL_OPTIONS = ['Left', 'Equal', 'Right'];

// Demo data generator
const generateDemoData = () => {
  const data = [];
  const startDate = new Date('2026-02-08');
  for (let i = 0; i < 14; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const isBaseline = i < 7;
    data.push({
      date: date.toISOString().split('T')[0],
      day: i + 1,
      week: Math.ceil((i + 1) / 7),
      phase: isBaseline ? 'Baseline' : 'Protocol',
      mackenzieExhale: isBaseline ? 35 + Math.random() * 10 : 40 + i * 1.5 + Math.random() * 5,
      morningHRV: 45 + Math.random() * 15 + (isBaseline ? 0 : i * 0.8),
      reactionTime: 280 - (isBaseline ? 0 : i * 2) + Math.random() * 20,
      hrr: 18 + (isBaseline ? 0 : i * 0.4) + Math.random() * 4,
    });
  }
  return data;
};

// ============================================
// UTILITY COMPONENTS
// ============================================

const TimerDisplay = ({ initialSeconds, onComplete, autoStart = false }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);

  useEffect(() => {
    let interval;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (seconds === 0 && isRunning) {
      setIsRunning(false);
      onComplete?.();
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds, onComplete]);

  const reset = () => { setSeconds(initialSeconds); setIsRunning(false); };
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="flex items-center gap-3">
      <div className="text-3xl font-mono font-bold text-gray-800">{mins}:{secs.toString().padStart(2, '0')}</div>
      <button onClick={() => setIsRunning(!isRunning)} className={`p-2 rounded-full ${isRunning ? 'bg-orange-500' : 'bg-green-500'} text-white`}>
        {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </button>
      <button onClick={reset} className="p-2 rounded-full bg-gray-200 text-gray-600"><RotateCcw className="w-5 h-5" /></button>
    </div>
  );
};

const Stopwatch = ({ onSave }) => {
  const [ms, setMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) interval = setInterval(() => setMs(m => m + 100), 100);
    return () => clearInterval(interval);
  }, [isRunning]);

  const reset = () => { setMs(0); setIsRunning(false); };
  const seconds = (ms / 1000).toFixed(1);

  return (
    <div className="flex items-center gap-3">
      <div className="text-3xl font-mono font-bold text-gray-800">{seconds}s</div>
      <button onClick={() => setIsRunning(!isRunning)} className={`p-2 rounded-full ${isRunning ? 'bg-orange-500' : 'bg-green-500'} text-white`}>
        {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </button>
      <button onClick={reset} className="p-2 rounded-full bg-gray-200 text-gray-600"><RotateCcw className="w-5 h-5" /></button>
      {ms > 0 && !isRunning && (
        <button onClick={() => onSave?.(parseFloat(seconds))} className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium">Save {seconds}s</button>
      )}
    </div>
  );
};

const Accordion = ({ title, icon: Icon, children, defaultOpen = false, badge = null }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-4 text-left">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-blue-600" />}
          <span className="font-semibold text-gray-800">{title}</span>
          {badge && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{badge}</span>}
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      {isOpen && <div className="px-4 pb-4 border-t border-gray-100">{children}</div>}
    </div>
  );
};

// ============================================
// TODAY TAB
// ============================================

const TodayTab = ({ currentDay, currentWeek, completed, setCompleted, onLog, setActiveTab }) => {
  const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
  const schedule = WEEKLY_SCHEDULE[dayOfWeek];
  const isSunday = dayOfWeek === 'Sun';
  const isSaturday = dayOfWeek === 'Sat';
  const isOddWeek = currentWeek % 2 === 1;
  const showSaturdayMedReminder = isSaturday && isOddWeek;

  const getChecklistItems = () => {
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
    const isGripDay = ['Mon', 'Wed', 'Fri'].includes(dayName);
    
    const items = {
      morning: [
        { id: 'mouthTapeCheck', label: 'Mouth Tape Used Last Night?', time: 'Upon waking' },
        { id: 'weight', label: 'Weigh-in', time: 'Upon waking' },
        { id: 'nostrilCheck', label: 'Nostril Dominance Check', time: '6:00am', link: 'protocols' },
        { id: 'mackenzie', label: 'Mackenzie Exhale Test', time: '6:00-6:15am', link: 'protocols' },
        { id: 'hrv', label: 'Morning HRV (Polar H10)', time: '6:15-6:20am', link: 'protocols' },
        ...(isGripDay ? [{ id: 'gripStrength', label: 'Grip Strength (L + R)', time: '6:15am', link: 'tests' }] : []),
        { id: 'sunlight', label: 'Sunlight + Hydration', time: '6:20-6:30am', duration: '10 min' },
        { id: 'breathwork', label: 'HRV Biofeedback Breathing', time: '6:30-6:45am', duration: '15 min', link: 'protocols' },
        { id: 'co2', label: 'CO2 Tolerance Training', time: '6:45-6:50am', duration: '5 min', link: 'protocols' },
      ],
      midday: [
        { id: 'meal1', label: 'Meal 1 + Morning Supplements', time: '10:00am', link: 'protocols' },
        { id: 'nsdr', label: 'NSDR (Non-Sleep Deep Rest)', time: '2:00-2:30pm', duration: '10-20 min', link: 'protocols' },
      ],
      training: [],
      evening: [
        { id: 'meal3', label: 'Meal 3 (last meal before 6pm)', time: 'Before 6:00pm' },
        { id: 'reaction', label: 'Reaction Time Test', time: '8:00pm', link: 'tests' },
        { id: 'eveningRatings', label: 'Evening Check-in (5 ratings)', time: '9:00pm', highlight: true },
        { id: 'sleepSupps', label: 'Sleep Supplements', time: '9:00pm', link: 'protocols' },
        { id: 'mouthTape', label: 'Mouth Tape Applied', time: '9:30pm' },
      ],
    };

    if (schedule.workout !== 'rest') {
      items.training.push({ id: 'training', label: `Training: ${schedule.training}`, time: '5:00-6:30pm', link: 'workout', highlight: true });
      items.training.push({ id: 'mobility', label: 'Daily Mobility', time: 'Pre/Post workout', duration: '10-15 min', link: 'workout' });
    } else {
      items.training.push({ id: 'rest', label: 'Active Recovery / Rest Day', time: 'All day', highlight: true });
      items.training.push({ id: 'extendedNsdr', label: 'Extended NSDR', time: 'Afternoon', duration: '30 min', link: 'protocols' });
    }

    if (schedule.recovery.includes('Sauna')) {
      items.evening.unshift({ id: 'sauna', label: 'Sauna + Coherent Breathing', time: '6:30-7:00pm', duration: '15-20 min', link: 'protocols' });
    }
    if (schedule.recovery.includes('Cold')) {
      items.evening.unshift({ id: 'cold', label: 'Cold Exposure (optional)', time: 'Post-workout', duration: '2-5 min', link: 'protocols' });
    }

    if (isSunday) {
      const medStatus = isOddWeek ? 'UNMEDICATED' : 'MEDICATED';
      items.morning.push({ id: 'cogTests', label: `Sunday Cognitive Tests (${medStatus})`, time: '8:00-9:00am', link: 'tests', highlight: true, important: true });
      items.morning.push({ id: 'asrs6', label: 'ASRS-6 Questionnaire', time: '9:00am', link: 'tests' });
    }

    return items;
  };

  const checklistItems = getChecklistItems();
  const toggleItem = (id) => setCompleted(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-4">
      {showSaturdayMedReminder && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            <div>
              <div className="font-bold text-amber-800">Medication Reminder</div>
              <div className="text-sm text-amber-700">Tomorrow is an <strong>UNMEDICATED</strong> test day. Do NOT take Vyvanse tomorrow morning.</div>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => schedule.workout !== 'rest' && setActiveTab('workout')}
        className={`w-full text-left bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 text-white ${schedule.workout !== 'rest' ? 'hover:from-blue-700 hover:to-blue-800 cursor-pointer' : ''}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm opacity-80">{dayOfWeek}'s Training</div>
            <div className="text-xl font-bold">{schedule.training}</div>
            <div className="text-sm opacity-80 mt-1">Recovery: {schedule.recovery}</div>
          </div>
          {schedule.workout !== 'rest' && (
            <div className="flex items-center gap-1 text-blue-200">
              <span className="text-xs">View</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          )}
        </div>
        {isSunday && (
          <div className={`mt-2 text-sm font-semibold px-2 py-1 rounded inline-block ${isOddWeek ? 'bg-orange-500' : 'bg-green-500'}`}>
            Test Day: {isOddWeek ? 'UNMEDICATED' : 'MEDICATED'}
          </div>
        )}
      </button>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Log</h3>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {/* Row 1 */}
          <button onClick={() => { const v = window.prompt('Weight (lbs)?'); if (v && !isNaN(v)) { onLog({ type: 'weight', value: parseFloat(v) }); setCompleted(prev => ({ ...prev, weight: true })); window.alert(`Logged weight: ${v} lbs`); }}}
            className="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-50 hover:bg-gray-100">
            <Scale className="w-5 h-5" style={{ color: '#00897B' }} /><span className="text-xs text-gray-600">Weight</span>
          </button>
          <button onClick={() => { const v = window.prompt('Morning HRV (rMSSD)?'); if (v && !isNaN(v)) { onLog({ type: 'morningHRV', value: parseFloat(v) }); setCompleted(prev => ({ ...prev, hrv: true })); window.alert(`Logged HRV: ${v}`); }}}
            className="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-50 hover:bg-gray-100">
            <Activity className="w-5 h-5" style={{ color: '#1565C0' }} /><span className="text-xs text-gray-600">HRV</span>
          </button>
          <button onClick={() => { const v = window.prompt('Mackenzie exhale (seconds)?'); if (v && !isNaN(v)) { onLog({ type: 'mackenzieExhale', value: parseFloat(v) }); setCompleted(prev => ({ ...prev, mackenzie: true })); window.alert(`Logged exhale: ${v}s`); }}}
            className="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-50 hover:bg-gray-100">
            <Wind className="w-5 h-5" style={{ color: '#1F4E79' }} /><span className="text-xs text-gray-600">Exhale</span>
          </button>
          <button onClick={() => { const v = window.prompt('Reaction time (ms)?'); if (v && !isNaN(v)) { onLog({ type: 'reaction', value: parseFloat(v) }); setCompleted(prev => ({ ...prev, reaction: true })); window.alert(`Logged reaction: ${v}ms`); }}}
            className="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-50 hover:bg-gray-100">
            <Timer className="w-5 h-5" style={{ color: '#7B1FA2' }} /><span className="text-xs text-gray-600">Reaction</span>
          </button>
          {/* Row 2 */}
          <button onClick={() => {
              if (window.confirm('Did you use mouth tape last night?')) {
                onLog({ type: 'mouthTape', value: 'Yes' }); setCompleted(prev => ({ ...prev, mouthTapeCheck: true })); window.alert('Logged mouth tape: Yes');
              } else {
                onLog({ type: 'mouthTape', value: 'No' }); setCompleted(prev => ({ ...prev, mouthTapeCheck: true })); window.alert('Logged mouth tape: No');
              }
            }}
            className="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-50 hover:bg-gray-100">
            <Moon className="w-5 h-5" style={{ color: '#5E35B1' }} /><span className="text-xs text-gray-600">Tape</span>
          </button>
          <button onClick={() => {
              const choices = ['Left', 'Right', 'Both'];
              const choice = window.prompt('Nostril dominance? (Left / Right / Both)');
              if (!choice) return;
              const normalized = choices.find(c => c.toLowerCase() === choice.trim().toLowerCase());
              if (!normalized) { window.alert('Please enter Left, Right, or Both'); return; }
              onLog({ type: 'nostrilDominance', value: normalized });
              setCompleted(prev => ({ ...prev, nostrilCheck: true }));
              window.alert(`Logged nostril: ${normalized}`);
            }}
            className="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-50 hover:bg-gray-100">
            <Wind className="w-5 h-5" style={{ color: '#7B1FA2' }} /><span className="text-xs text-gray-600">Nostril</span>
          </button>
          <button onClick={() => {
              const left = window.prompt('Left hand grip (kg)?'); if (!left || isNaN(left)) return;
              const right = window.prompt('Right hand grip (kg)?'); if (!right || isNaN(right)) return;
              onLog({ type: 'gripStrength', value: { left: parseFloat(left), right: parseFloat(right) } });
              setCompleted(prev => ({ ...prev, gripStrength: true }));
              window.alert(`Logged grip: L=${left}kg, R=${right}kg`);
            }}
            className="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-50 hover:bg-gray-100">
            <Dumbbell className="w-5 h-5" style={{ color: '#C62828' }} /><span className="text-xs text-gray-600">Grip</span>
          </button>
          <button onClick={() => {
              const peak = window.prompt('Peak HR (bpm)?'); if (!peak || isNaN(peak)) return;
              const oneMin = window.prompt('HR after 1 minute (bpm)?'); if (!oneMin || isNaN(oneMin)) return;
              const hrr = parseFloat(peak) - parseFloat(oneMin);
              onLog({ type: 'hrr', value: hrr, peakHR: parseFloat(peak), oneMinHR: parseFloat(oneMin) });
              setCompleted(prev => ({ ...prev, hrr: true }));
              window.alert(`Logged HRR: ${hrr} bpm (${peak} → ${oneMin})`);
            }}
            className="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-50 hover:bg-gray-100">
            <Heart className="w-5 h-5" style={{ color: '#E53935' }} /><span className="text-xs text-gray-600">HRR</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
        {Object.entries(checklistItems).map(([section, items]) => (
          items.length > 0 && (
            <div key={section}>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{section}</h4>
              <div className="space-y-1">
                {items.map((item) => (
                  <div key={item.id} className={`flex items-center gap-3 p-2 rounded-lg ${completed[item.id] ? 'bg-green-50' : item.highlight ? 'bg-blue-50' : item.important ? 'bg-amber-50' : 'bg-gray-50'}`}>
                    <button onClick={() => toggleItem(item.id)} className="flex-shrink-0">
                      {completed[item.id] ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-300" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm ${completed[item.id] ? 'text-green-700 line-through' : item.highlight ? 'text-blue-800 font-medium' : item.important ? 'text-amber-800 font-medium' : 'text-gray-700'}`}>{item.label}</span>
                      <div className="text-xs text-gray-500">{item.time}{item.duration ? ` • ${item.duration}` : ''}</div>
                    </div>
                    {item.link && (
                      <button onClick={() => setActiveTab(item.link)} className="flex-shrink-0 p-1 text-blue-500 hover:bg-blue-100 rounded">
                        <Link className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>

      {/* Evening Check-in */}
      <EveningCheckin onLog={onLog} onComplete={() => setCompleted(prev => ({ ...prev, eveningRatings: true }))} />
    </div>
  );
};

// ============================================
// EVENING CHECK-IN COMPONENT
// ============================================

const SUBJECTIVE_RATINGS = [
  { id: 'focus', label: 'Focus', description: 'Ability to sustain attention on tasks' },
  { id: 'taskInitiation', label: 'Task Initiation', description: 'Ease of starting tasks, not procrastinating' },
  { id: 'emotionalReg', label: 'Emotional Regulation', description: 'Mood stability, handling frustration' },
  { id: 'mentalEnergy', label: 'Mental Energy', description: 'Mental stamina, clarity vs fog' },
  { id: 'restlessness', label: 'Restlessness', description: 'Physical/mental stillness vs agitation' },
];

const EveningCheckin = ({ onLog, onComplete }) => {
  const [ratings, setRatings] = useState({});
  const [expanded, setExpanded] = useState(false);
  const allRated = SUBJECTIVE_RATINGS.every(r => ratings[r.id] !== undefined);

  const handleSave = () => {
    if (!allRated) {
      alert('Please rate all 5 items');
      return;
    }
    onLog({ type: 'eveningRatings', value: ratings });
    onComplete?.();
    alert('Evening ratings saved!');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between bg-indigo-50 hover:bg-indigo-100"
      >
        <div className="flex items-center gap-3">
          <Moon className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold text-indigo-800">Evening Check-in</span>
          {allRated && <CheckCircle className="w-4 h-4 text-green-500" />}
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-indigo-600" /> : <ChevronDown className="w-5 h-5 text-indigo-600" />}
      </button>
      
      {expanded && (
        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-600">Rate your day 1-10 (1 = worst, 10 = best)</p>
          
          {SUBJECTIVE_RATINGS.map(({ id, label, description }) => (
            <div key={id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-gray-800">{label}</span>
                  <p className="text-xs text-gray-500">{description}</p>
                </div>
                <span className="text-lg font-bold text-indigo-600 w-8 text-center">
                  {ratings[id] || '-'}
                </span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <button
                    key={num}
                    onClick={() => setRatings(prev => ({ ...prev, [id]: num }))}
                    className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                      ratings[id] === num 
                        ? 'bg-indigo-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          ))}
          
          <button
            onClick={handleSave}
            disabled={!allRated}
            className={`w-full py-3 rounded-lg font-semibold ${
              allRated 
                ? 'bg-indigo-500 text-white hover:bg-indigo-600' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Save Evening Ratings
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================
// PROTOCOLS TAB
// ============================================

const ProtocolsTab = ({ onLog, onComplete }) => {
  return (
    <div className="space-y-3">
      <Accordion title="Nostril Dominance Check" icon={Wind} defaultOpen badge="Daily">
        <div className="space-y-3 pt-3">
          <div className="bg-purple-50 rounded-lg p-3 text-sm text-purple-800">
            <strong>Why track this (Nestor):</strong> The nasal cycle shifts every 30 min to 4 hours. Right nostril dominance correlates with sympathetic activation (alertness); left with parasympathetic (calm). Research (Kahana-Zweig 2016) shows nostril dominance affects brain hemisphere activation.
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
            <strong>How to check:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Close right nostril with finger, inhale through left</li>
              <li>Close left nostril, inhale through right</li>
              <li>Note which has less resistance = dominant</li>
              <li>Check immediately upon waking for consistency</li>
            </ol>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {NOSTRIL_OPTIONS.map(option => (
              <button
                key={option}
                onClick={() => { 
                  onLog({ type: 'nostrilDominance', value: option }); 
                  onComplete?.('nostrilCheck'); 
                  alert(`Logged: ${option} dominant`); 
                }}
                className="py-3 px-4 rounded-lg bg-purple-100 text-purple-800 font-medium hover:bg-purple-200"
              >
                {option === 'Left' ? '← Left' : option === 'Right' ? 'Right →' : '= Equal'}
              </button>
            ))}
          </div>
        </div>
      </Accordion>

      <Accordion title="Mackenzie Exhale Test" icon={Wind} defaultOpen badge="Daily • Primary">
        <div className="space-y-3 pt-3">
          <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
            <strong>Why this test (Nestor/Mackenzie):</strong> More objective than BOLT — you can't cheat or misjudge "first urge." Measures lung capacity + exhale control + CO2 tolerance. Clear endpoint: you're out of air.
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
            <strong>Instructions:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Take 3-4 relaxed breaths (3-5s in, 5-10s out)</li>
              <li>On 4th breath, inhale FULLY (max capacity)</li>
              <li>Start timer</li>
              <li>Exhale as SLOWLY as possible through pursed lips</li>
              <li>Visualize barely flickering a candle flame</li>
              <li>Stop when out of air OR must inhale</li>
            </ol>
          </div>
          <Stopwatch onSave={(val) => { onLog({ type: 'mackenzieExhale', value: val }); onComplete?.('mackenzie'); alert(`Saved Mackenzie: ${val}s`); }} />
          <div className="grid grid-cols-6 gap-1 text-center text-xs">
            <div className="bg-red-100 text-red-800 p-2 rounded"><div className="font-bold">&lt;30s</div><div>Below</div></div>
            <div className="bg-yellow-100 text-yellow-800 p-2 rounded"><div className="font-bold">30-45s</div><div>Avg</div></div>
            <div className="bg-green-100 text-green-800 p-2 rounded"><div className="font-bold">45-60s</div><div>Inter</div></div>
            <div className="bg-blue-100 text-blue-800 p-2 rounded"><div className="font-bold">60-75s</div><div>Adv</div></div>
            <div className="bg-purple-100 text-purple-800 p-2 rounded"><div className="font-bold">75-90s</div><div>V.Adv</div></div>
            <div className="bg-indigo-100 text-indigo-800 p-2 rounded"><div className="font-bold">90s+</div><div>Elite</div></div>
          </div>
        </div>
      </Accordion>

      <Accordion title="BOLT Score (Optional)" icon={Wind} badge="Secondary">
        <div className="space-y-3 pt-3">
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
            <strong>Alternative test:</strong> Measures CO2 tolerance after normal exhale. More subjective but useful for comparison. Target: 40+ seconds.
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Normal breath IN through nose</li>
              <li>Normal breath OUT through nose</li>
              <li>Pinch nose and start timer</li>
              <li>Stop at FIRST urge to breathe</li>
            </ol>
          </div>
          <Stopwatch onSave={(val) => { onLog({ type: 'bolt', value: val }); onComplete?.('bolt'); alert(`Saved BOLT: ${val}s`); }} />
        </div>
      </Accordion>

      <Accordion title="HRV Biofeedback Breathing" icon={Heart} badge="Daily • 15 min">
        <div className="space-y-3 pt-3">
          <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
            <strong>The 5.5-5.5 Protocol (Nestor):</strong> Breathing at exactly 5.5 breaths/min synchronizes heart, lung, and brain rhythms. Research (Lin 2014, Bernardi 2001) identified this as the optimal rate for maximizing HRV.
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
            <strong>Instructions:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Wet Polar H10 electrodes, strap to chest</li>
              <li>Open HRV4Biofeedback app</li>
              <li>Set to exactly <strong>5.5 breaths/min</strong></li>
              <li>Inhale <strong>5.5 sec</strong> through nose</li>
              <li>Exhale <strong>5.5 sec</strong> through nose</li>
              <li>Watch for large HRV oscillations (resonance)</li>
            </ol>
          </div>
          <TimerDisplay initialSeconds={900} onComplete={() => onComplete?.('breathwork')} />
          <button onClick={() => onComplete?.('breathwork')} className="w-full py-2 bg-green-500 text-white rounded-lg font-medium">Mark Complete</button>
        </div>
      </Accordion>

      <Accordion title="CO2 Tolerance Training" icon={Wind} badge="Daily • 5 min">
        <div className="space-y-3 pt-3">
          <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
            <strong>The Bohr Effect (Nestor):</strong> Paradoxically, low CO2 levels reduce oxygen delivery to the brain despite adequate blood oxygen saturation. CO2 is required for hemoglobin to release oxygen to tissues. The prefrontal cortex—responsible for executive function—is particularly sensitive to oxygenation changes. Building CO2 tolerance improves brain oxygen delivery.
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
            <strong>Buteyko "Breathe Light":</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Normal exhale, don't force</li>
              <li>Hold until moderate air hunger</li>
              <li>Resume normal breathing 30-60 sec</li>
              <li>Repeat 3-5 rounds</li>
              <li>Target: 50-80% of BOLT score</li>
            </ol>
          </div>
          <TimerDisplay initialSeconds={300} onComplete={() => onComplete?.('co2')} />
          <button onClick={() => onComplete?.('co2')} className="w-full py-2 bg-green-500 text-white rounded-lg font-medium">Mark Complete</button>
        </div>
      </Accordion>

      <Accordion title="Right Nostril Breathing (Surya Bhedana)" icon={Sun} badge="Optional • Focus">
        <div className="space-y-3 pt-3">
          <div className="bg-orange-50 rounded-lg p-3 text-sm text-orange-800">
            <strong>Energizing/Focus Protocol (Nestor):</strong> Right nostril breathing activates the sympathetic nervous system, increases blood flow to the LEFT prefrontal cortex (contralateral), and boosts alertness. Research (Singh 2016, Pal 2014) shows acute effects last 15-30 min. Best used before demanding cognitive tasks.
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
            <strong>Instructions:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Sit comfortably with spine straight</li>
              <li>Close LEFT nostril with ring finger</li>
              <li>Inhale slowly through RIGHT nostril (5.5 sec)</li>
              <li>Close RIGHT nostril with thumb, release left</li>
              <li>Exhale through LEFT nostril (5.5 sec)</li>
              <li>Repeat for 2-5 minutes</li>
            </ol>
            <p className="mt-2 text-xs text-gray-500">Remember: Inhale RIGHT, exhale LEFT</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-sm text-yellow-800">
            <strong>Best uses:</strong> Before cognitive tests, demanding work tasks, or when you need alertness. NOT recommended before bed.
          </div>
          <TimerDisplay initialSeconds={180} />
          <button onClick={() => { onLog({type:'rightNostril',value:true}); alert('Logged right nostril breathing'); }} className="w-full py-2 bg-orange-500 text-white rounded-lg font-medium">Log Complete</button>
        </div>
      </Accordion>

      <Accordion title="Left Nostril Breathing (Chandra Bhedana)" icon={Moon} badge="Optional • Calm/Sleep">
        <div className="space-y-3 pt-3">
          <div className="bg-indigo-50 rounded-lg p-3 text-sm text-indigo-800">
            <strong>Calming/Sleep Protocol (Nestor):</strong> Left nostril breathing activates the parasympathetic nervous system, lowers heart rate and blood pressure, and promotes relaxation. Research shows it increases blood flow to the RIGHT prefrontal cortex (associated with creative, spatial, emotional processing). Ideal for wind-down routines.
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
            <strong>Instructions:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Sit or lie comfortably</li>
              <li>Close RIGHT nostril with thumb</li>
              <li>Inhale slowly through LEFT nostril (5.5 sec)</li>
              <li>Close LEFT nostril with ring finger, release right</li>
              <li>Exhale through RIGHT nostril (5.5 sec)</li>
              <li>Repeat for 2-5 minutes</li>
            </ol>
            <p className="mt-2 text-xs text-gray-500">Remember: Inhale LEFT, exhale RIGHT</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-sm text-green-800">
            <strong>Best uses:</strong> After 9pm as part of wind-down, before sleep supplements, when feeling anxious or overstimulated.
          </div>
          <TimerDisplay initialSeconds={180} />
          <button onClick={() => { onLog({type:'leftNostril',value:true}); alert('Logged left nostril breathing'); }} className="w-full py-2 bg-indigo-500 text-white rounded-lg font-medium">Log Complete</button>
        </div>
      </Accordion>

      <Accordion title="Sauna + Coherent Breathing" icon={Flame} badge="3-4x/week">
        <div className="space-y-3 pt-3">
          <div className="bg-orange-50 rounded-lg p-3 text-sm text-orange-800">
            Heat stress triggers heat shock proteins, improves CV function, opportunity for breathwork.
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
            <strong>Protocol:</strong> 176-212°F, 15-20 min<br/>
            <strong>During:</strong> Coherent breathing (5.5 in/5.5 out)<br/>
            <strong>Stretches:</strong> Forward fold, Figure-4 hip, Spinal twist, Neck, Shoulder, Chest opener
          </div>
          <TimerDisplay initialSeconds={1200} />
          <button onClick={() => { const m = prompt('Sauna duration (min)?'); if(m) { onLog({type:'sauna',value:parseFloat(m)}); onComplete?.('sauna'); alert(`Logged ${m} min`); }}} className="w-full py-2 bg-orange-500 text-white rounded-lg font-medium">Log Sauna</button>
        </div>
      </Accordion>

      <Accordion title="Cold Exposure" icon={Snowflake} badge="Optional">
        <div className="space-y-3 pt-3">
          <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
            Norepinephrine release (up to 500%), cold tolerance, breath control practice.
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
            <strong>Protocol:</strong> 2-5 min cold shower<br/>
            <strong>Breathing:</strong> Slow nasal, don't gasp<br/>
            <strong>Warning:</strong> NOT immediately before bed
          </div>
          <TimerDisplay initialSeconds={180} />
          <button onClick={() => { onLog({type:'cold',value:true}); onComplete?.('cold'); alert('Logged cold'); }} className="w-full py-2 bg-blue-500 text-white rounded-lg font-medium">Mark Complete</button>
        </div>
      </Accordion>

      <Accordion title="NSDR (Non-Sleep Deep Rest)" icon={Moon} badge="Daily • 10-30 min">
        <div className="space-y-3 pt-3">
          <div className="bg-purple-50 rounded-lg p-3 text-sm text-purple-800">
            +65% dopamine increase (PET studies). Mental restoration, improved focus.
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
            <strong>When:</strong> 2-4pm or when fatigued<br/>
            <strong>Duration:</strong> 10-20 min (30 on rest days)<br/>
            <strong>Position:</strong> Lying, eyes closed, follow audio
          </div>
          <a href="https://www.youtube.com/watch?v=AKGrmY8OSHM" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-purple-600 font-medium">
            <ExternalLink className="w-4 h-4" />Huberman 10-min NSDR
          </a>
          <TimerDisplay initialSeconds={600} onComplete={() => onComplete?.('nsdr')} />
          <button onClick={() => onComplete?.('nsdr')} className="w-full py-2 bg-purple-500 text-white rounded-lg font-medium">Mark Complete</button>
        </div>
      </Accordion>

      <Accordion title="Supplements" icon={Pill}>
        <div className="space-y-3 pt-3">
          <div className="bg-green-50 rounded-lg p-3 text-sm text-green-800">
            <strong>Morning (10am):</strong> Creatine 5g, Fish Oil 2000mg EPA, D3+K2 5000 IU, Tongkat Ali 400mg, Rhodiola 200mg, B-Complex, Lion's Mane 500mg, Ginseng 140mg<br/><br/>
            <strong>Pre-Workout:</strong> Alpha-GPC 300mg<br/><br/>
            <strong>Sleep (9pm):</strong> Mag L-Threonate 145mg, Apigenin 50mg, L-Theanine 200mg (opt)
          </div>
          <button onClick={() => { onLog({type:'supplements',value:'morning'}); onComplete?.('meal1'); alert('Logged morning supps'); }} className="w-full py-2 bg-green-500 text-white rounded-lg font-medium">Log Morning Supplements</button>
          <button onClick={() => { onLog({type:'supplements',value:'sleep'}); onComplete?.('sleepSupps'); alert('Logged sleep supps'); }} className="w-full py-2 bg-indigo-500 text-white rounded-lg font-medium">Log Sleep Supplements</button>
        </div>
      </Accordion>

      <Accordion title="Zone 2 Cardio (Nasal Only)" icon={Activity} badge="3x/week">
        <div className="space-y-3 pt-3">
          <div className="bg-teal-50 rounded-lg p-3 text-sm text-teal-800">
            <strong>Why Zone 2 + Nasal (Nestor):</strong> Zone 2 (60-70% max HR) builds aerobic base and mitochondrial density. Nasal-only breathing ensures you stay in the aerobic zone while building CO2 tolerance. If you must mouth breathe, you're going too hard.
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
            <strong>Protocol:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Warm-up: 5 min easy pace, nasal breathing</li>
              <li>Main set: 20-40 min at 60-70% max HR</li>
              <li>Breathing: Nasal ONLY the entire time</li>
              <li>If you must mouth breathe, SLOW DOWN</li>
              <li>Cool-down: 5 min easy walk, nasal</li>
            </ol>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-sm text-yellow-800">
            <strong>The Test:</strong> Can you maintain a conversation through your nose? If not, you're going too hard. This is about building aerobic capacity, not pushing limits.
          </div>
          <TimerDisplay initialSeconds={1800} />
          <button onClick={() => { const m = prompt('Zone 2 duration (min)?'); if(m) { onLog({type:'zone2',value:parseFloat(m)}); alert(`Logged ${m} min zone 2`); }}} className="w-full py-2 bg-teal-500 text-white rounded-lg font-medium">Log Zone 2 Session</button>
        </div>
      </Accordion>
    </div>
  );
};

// ============================================
// TESTS TAB
// ============================================

// All 5 cognitive tests run every Sunday
const DEEP_TEST_INFO = {
  'TMT': {
    name: 'Trail Making Test (TMT-A & B)',
    description: 'Executive function, processing speed, task switching. TMT-B specifically tests cognitive flexibility.',
    note: 'Use TMT-Lite phone app',
    instructions: [
      'TMT-A: Connect numbers 1-25 in order as fast as possible',
      'TMT-B: Alternate numbers and letters (1-A-2-B-3-C...)',
      'Record time in seconds for each part',
      'Errors add ~2 seconds each to effective time',
    ],
    fields: ['tmtA', 'tmtB'],
    fieldLabels: ['TMT-A Time (sec)', 'TMT-B Time (sec)'],
  },
  'Stroop': {
    name: 'Stroop Test',
    description: 'Measures selective attention and cognitive flexibility by naming ink colors of color words.',
    url: 'https://3rrzyovd9q.cognition.run',
    instructions: [
      'Name the ink color, not the word itself',
      'Go as fast as possible while staying accurate',
      'Complete all trials presented',
      'Record congruent RT, incongruent RT, and accuracy',
    ],
    fields: ['stroopCongruent', 'stroopIncongruent', 'stroopAccuracy'],
    fieldLabels: ['Congruent RT (ms)', 'Incongruent RT (ms)', 'Accuracy (%)'],
    computedField: { label: 'Stroop Effect', calc: (s) => { const c = parseFloat(s.stroopCongruent); const i = parseFloat(s.stroopIncongruent); return (!isNaN(c) && !isNaN(i)) ? i - c : null; }, key: 'stroopEffect' },
  },
  'Flanker': {
    name: 'Flanker Test',
    description: 'Measures attention and inhibitory control by identifying a target among distractors.',
    url: 'https://bc50jfnfsa.cognition.run',
    instructions: [
      'Focus on the center arrow/stimulus',
      'Indicate the direction of the center target',
      'Ignore the flanking distractors',
      'Record congruent RT, incongruent RT, and accuracy',
    ],
    fields: ['flankerCongruent', 'flankerIncongruent', 'flankerAccuracy'],
    fieldLabels: ['Congruent RT (ms)', 'Incongruent RT (ms)', 'Accuracy (%)'],
    computedField: { label: 'Flanker Effect', calc: (s) => { const c = parseFloat(s.flankerCongruent); const i = parseFloat(s.flankerIncongruent); return (!isNaN(c) && !isNaN(i)) ? i - c : null; }, key: 'flankerEffect' },
  },
  'Go/No-Go': {
    name: 'Go/No-Go Response Inhibition Test',
    description: 'Measures impulse control and response inhibition - a core ADHD deficit.',
    url: 'https://sketgsdcac.cognition.run',
    instructions: [
      'Press spacebar for "Go" stimuli (e.g., green)',
      'Do NOT press for "No-Go" stimuli (e.g., red)',
      'Go as fast as possible while minimizing errors',
      'Record mean RT, commission errors, and accuracy',
    ],
    fields: ['gonogoRT', 'gonogoErrors', 'gonogoAccuracy'],
    fieldLabels: ['Mean RT (ms)', 'Commission Errors', 'Accuracy (%)'],
  },
  'Attention Span': {
    name: 'Attention Span Test',
    description: 'Measures sustained attention and vigilance over time.',
    url: 'https://g0zegupaji.cognition.run',
    instructions: [
      'Follow the on-screen instructions carefully',
      'Stay focused for the entire duration',
      'Respond as quickly and accurately as possible',
      'Record your accuracy and mean RT',
    ],
    fields: ['attentionAccuracy', 'attentionRT'],
    fieldLabels: ['Accuracy (%)', 'Mean RT (ms)'],
  },
};

const TestsTab = ({ onLog, currentWeek }) => {
  const [asrs6, setAsrs6] = useState(Array(6).fill(null));
  const [deepTestScores, setDeepTestScores] = useState({});
  const [gripStrength, setGripStrength] = useState({ left: '', right: '' });
  const [weeklyNotes, setWeeklyNotes] = useState('');

  const asrs6Total = asrs6.reduce((a, b) => a + (b || 0), 0);
  const isOddWeek = currentWeek % 2 === 1;
  const medicationStatus = isOddWeek ? 'UNMEDICATED' : 'MEDICATED';
  const allTests = Object.keys(DEEP_TEST_INFO);

  const getComputedValue = (testInfo) => {
    if (!testInfo.computedField) return null;
    return testInfo.computedField.calc(deepTestScores);
  };

  const handleSaveAllWeeklyTests = () => {
    const stroopEffect = getComputedValue(DEEP_TEST_INFO['Stroop']);
    const flankerEffect = getComputedValue(DEEP_TEST_INFO['Flanker']);
    const payload = {
      sheet: 'WeeklyTests',
      data: {
        date: new Date().toISOString().split('T')[0],
        week: currentWeek,
        medicated: !isOddWeek,
        metric: 'weeklyTests',
        value: {
          tmtA: deepTestScores.tmtA ? parseFloat(deepTestScores.tmtA) : null,
          tmtB: deepTestScores.tmtB ? parseFloat(deepTestScores.tmtB) : null,
          stroopCongruent: deepTestScores.stroopCongruent ? parseFloat(deepTestScores.stroopCongruent) : null,
          stroopIncongruent: deepTestScores.stroopIncongruent ? parseFloat(deepTestScores.stroopIncongruent) : null,
          stroopAccuracy: deepTestScores.stroopAccuracy ? parseFloat(deepTestScores.stroopAccuracy) : null,
          stroopEffect: stroopEffect,
          flankerCongruent: deepTestScores.flankerCongruent ? parseFloat(deepTestScores.flankerCongruent) : null,
          flankerIncongruent: deepTestScores.flankerIncongruent ? parseFloat(deepTestScores.flankerIncongruent) : null,
          flankerAccuracy: deepTestScores.flankerAccuracy ? parseFloat(deepTestScores.flankerAccuracy) : null,
          flankerEffect: flankerEffect,
          gonogoRT: deepTestScores.gonogoRT ? parseFloat(deepTestScores.gonogoRT) : null,
          gonogoErrors: deepTestScores.gonogoErrors ? parseFloat(deepTestScores.gonogoErrors) : null,
          gonogoAccuracy: deepTestScores.gonogoAccuracy ? parseFloat(deepTestScores.gonogoAccuracy) : null,
          attentionAccuracy: deepTestScores.attentionAccuracy ? parseFloat(deepTestScores.attentionAccuracy) : null,
          attentionRT: deepTestScores.attentionRT ? parseFloat(deepTestScores.attentionRT) : null,
          asrs6Total: asrs6Total,
          asrs6Items: asrs6,
        },
        notes: weeklyNotes,
      },
      timestamp: new Date().toISOString(),
    };
    onLog(payload);
    alert(`Saved all weekly tests — Week ${currentWeek} (${medicationStatus})`);
  };

  return (
    <div className="space-y-4">
      {/* Warning Banner */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            Stroop, Flanker, Go/No-Go, and Attention Span require laptop/desktop with keyboard. TMT uses TMT-Lite phone app.
          </p>
        </div>
      </div>

      {/* Medication Status Banner */}
      <div className={`rounded-xl p-4 ${isOddWeek ? 'bg-orange-50 border border-orange-200' : 'bg-green-50 border border-green-200'}`}>
        <div className="flex items-center gap-3">
          <Brain className={`w-6 h-6 ${isOddWeek ? 'text-orange-600' : 'text-green-600'}`} />
          <div>
            <div className={`font-bold ${isOddWeek ? 'text-orange-800' : 'text-green-800'}`}>Week {currentWeek} Sunday Tests: {medicationStatus}</div>
            <div className={`text-sm ${isOddWeek ? 'text-orange-700' : 'text-green-700'}`}>
              {isOddWeek ? 'Do NOT take medication before testing' : 'Take medication as normal before testing'}
            </div>
          </div>
        </div>
      </div>

      {/* All Cognitive Tests - Every Sunday */}
      {allTests.map(testKey => {
        const testInfo = DEEP_TEST_INFO[testKey];
        const computedVal = getComputedValue(testInfo);
        return (
          <div key={testKey} className="bg-white rounded-xl p-4 shadow-sm border-2 border-purple-200">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              {testInfo.name}
            </h3>
            <p className="text-sm text-gray-600 mb-3">{testInfo.description}</p>

            {testInfo.url ? (
              <a href={testInfo.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-purple-600 font-medium mb-3">
                <ExternalLink className="w-4 h-4" />Open Test
              </a>
            ) : testInfo.note ? (
              <p className="text-sm text-purple-600 font-medium mb-3">{testInfo.note}</p>
            ) : null}

            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <strong className="text-sm text-gray-700">Instructions:</strong>
              <ol className="list-decimal list-inside mt-1 text-sm text-gray-600 space-y-1">
                {testInfo.instructions.map((inst, i) => <li key={i}>{inst}</li>)}
              </ol>
            </div>

            <div className="space-y-2">
              {testInfo.fields.map((field, idx) => (
                <div key={field}>
                  <label className="text-sm text-gray-600">{testInfo.fieldLabels[idx]}</label>
                  <input
                    type="number"
                    value={deepTestScores[field] || ''}
                    onChange={(e) => setDeepTestScores(prev => ({ ...prev, [field]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
                    placeholder="Enter score"
                  />
                </div>
              ))}
              {testInfo.computedField && computedVal !== null && (
                <div className="bg-purple-50 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-purple-700">{testInfo.computedField.label}</span>
                  <span className="text-lg font-bold text-purple-800">{computedVal} ms</span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* ASRS-6 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-blue-600" />ASRS-6 (Weekly)
        </h3>
        <p className="text-sm text-gray-600 mb-3">Rate 0-4: 0=Never, 1=Rarely, 2=Sometimes, 3=Often, 4=Very Often</p>
        <div className="space-y-3">
          {ASRS6_QUESTIONS.map((q, idx) => (
            <div key={idx} className="border-b border-gray-100 pb-3">
              <p className="text-sm text-gray-700 mb-2">{idx + 1}. {q}</p>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map((score) => (
                  <button key={score} onClick={() => { const n = [...asrs6]; n[idx] = score; setAsrs6(n); }}
                    className={`w-10 h-10 rounded-lg font-medium ${asrs6[idx] === score ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{score}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-lg font-bold">Total: {asrs6Total}/24</div>
        </div>
      </div>

      {/* Grip Strength - 3x/week */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-red-600" />
          Grip Strength (Mon/Wed/Fri)
        </h3>
        <p className="text-sm text-gray-600 mb-3">3 attempts each hand, record best. Same time each day, before coffee.</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">Left Hand (kg)</label>
            <input
              type="number"
              value={gripStrength.left}
              onChange={(e) => setGripStrength({ ...gripStrength, left: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
              placeholder="Best of 3"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Right Hand (kg)</label>
            <input
              type="number"
              value={gripStrength.right}
              onChange={(e) => setGripStrength({ ...gripStrength, right: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
              placeholder="Best of 3"
            />
          </div>
        </div>
        <button
          onClick={() => {
            onLog({ type: 'gripStrength', value: gripStrength });
            alert(`Logged grip: L=${gripStrength.left}kg, R=${gripStrength.right}kg`);
            setGripStrength({ left: '', right: '' });
          }}
          className="w-full mt-3 py-2 bg-red-500 text-white rounded-lg font-medium"
        >
          Save Grip Strength
        </button>
      </div>

      {/* Reaction Time */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Timer className="w-5 h-5 text-orange-600" />Reaction Time (Daily)
        </h3>
        <a href="https://humanbenchmark.com/tests/reactiontime" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-orange-600 font-medium mb-4">
          <ExternalLink className="w-4 h-4" />Open Human Benchmark
        </a>
        <p className="text-sm text-gray-600 mb-3">Do 5 trials on computer, enter your average:</p>
        <div className="flex gap-2">
          <input type="number" placeholder="e.g., 245" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" id="reactionInput" />
          <button onClick={() => { const i = document.getElementById('reactionInput'); if(i.value) { onLog({type:'reaction',value:parseFloat(i.value)}); alert(`Logged: ${i.value}ms`); i.value=''; }}}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium">Save</button>
        </div>
      </div>

      {/* Save All Weekly Tests */}
      <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-green-300">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Download className="w-5 h-5 text-green-600" />
          Save All Weekly Tests
        </h3>
        <p className="text-sm text-gray-600 mb-3">Submit all cognitive test scores, ASRS-6, and notes for Week {currentWeek} ({medicationStatus}).</p>
        <textarea
          value={weeklyNotes}
          onChange={(e) => setWeeklyNotes(e.target.value)}
          placeholder="Optional notes about this week's testing..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 text-sm"
          rows={2}
        />
        <button
          onClick={handleSaveAllWeeklyTests}
          className="w-full py-3 bg-green-600 text-white rounded-lg font-bold text-lg"
        >
          Save Week {currentWeek} Tests ({medicationStatus})
        </button>
      </div>
    </div>
  );
};

// ============================================
// WORKOUT TAB (full with weight/rep tracking)
// ============================================

const WorkoutTab = ({ onLog }) => {
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [exerciseData, setExerciseData] = useState({});
  const [cardioData, setCardioData] = useState({ maxHR: '', avgHR: '', duration: '', nasalPercent: 100 });
  const [nasalPercent, setNasalPercent] = useState(50);
  const [hrr, setHrr] = useState('');
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [completedIntervals, setCompletedIntervals] = useState({});
  const [expandedExercise, setExpandedExercise] = useState(null);

  const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
  const suggestedWorkout = WEEKLY_SCHEDULE[dayOfWeek]?.workout;

  const updateSet = (exerciseId, setIndex, field, value) => {
    setExerciseData(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        sets: [
          ...(prev[exerciseId]?.sets || []).slice(0, setIndex),
          { ...(prev[exerciseId]?.sets?.[setIndex] || {}), [field]: value },
          ...(prev[exerciseId]?.sets || []).slice(setIndex + 1),
        ]
      }
    }));
  };

  const addSet = (exerciseId) => {
    setExerciseData(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        sets: [...(prev[exerciseId]?.sets || []), { weight: '', reps: '' }]
      }
    }));
  };

  const toggleInterval = (id) => {
    setCompletedIntervals(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const saveWorkout = () => {
    const workoutLog = {
      type: 'workout',
      workout: selectedWorkout,
      workoutType: WORKOUTS[selectedWorkout]?.type || 'strength',
      exercises: exerciseData,
      cardioData,
      completedIntervals,
      nasalPercent,
      hrr: parseFloat(hrr) || null,
      notes: workoutNotes,
      timestamp: new Date().toISOString(),
    };
    onLog(workoutLog);
    alert('Workout saved!');
  };

  if (!selectedWorkout) {
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="text-sm text-blue-700">Today's scheduled:</div>
          <div className="text-lg font-bold text-blue-900">{suggestedWorkout === 'rest' ? 'Rest Day' : WORKOUTS[suggestedWorkout]?.name || 'Rest'}</div>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Strength</h3>
        <div className="grid grid-cols-3 gap-3">
          {['A', 'B', 'C'].map((key) => (
            <button key={key} onClick={() => setSelectedWorkout(key)}
              className={`p-4 rounded-xl text-left ${key === suggestedWorkout ? 'bg-blue-500 text-white' : 'bg-white shadow-sm hover:shadow-md'}`}>
              <div className="font-semibold">Workout {key}</div>
              <div className={`text-xs ${key === suggestedWorkout ? 'text-blue-100' : 'text-gray-500'}`}>{WORKOUTS[key].name.split('(')[0]}</div>
            </button>
          ))}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Cardio</h3>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setSelectedWorkout('4x4')}
            className={`p-4 rounded-xl text-left ${suggestedWorkout === '4x4' ? 'bg-orange-500 text-white' : 'bg-white shadow-sm hover:shadow-md'}`}>
            <div className="font-semibold">4×4 HIIT</div>
            <div className={`text-xs ${suggestedWorkout === '4x4' ? 'text-orange-100' : 'text-gray-500'}`}>Norwegian</div>
          </button>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Mobility</h3>
        <button onClick={() => setSelectedWorkout('D')} className="w-full p-4 rounded-xl text-left bg-white shadow-sm hover:shadow-md">
          <div className="font-semibold">Daily Mobility</div>
          <div className="text-xs text-gray-500">10-15 min routine</div>
        </button>
      </div>
    );
  }

  const workout = WORKOUTS[selectedWorkout];
  const isCardio = workout.type === 'cardio';
  const isMobility = workout.type === 'mobility';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => setSelectedWorkout(null)} className="text-blue-600 text-sm mb-1">← Change workout</button>
          <h2 className="text-xl font-bold text-gray-800">{workout.name}</h2>
        </div>
        <button onClick={saveWorkout} className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium">Save Workout</button>
      </div>

      {/* Workout type instructions */}
      {(selectedWorkout === 'A' || selectedWorkout === 'B') && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
          <strong>Yates HIT:</strong> 1-2 warmup sets → 1 working set to failure. Rest 2-3 min between exercises.
        </div>
      )}
      {selectedWorkout === 'C' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
          <strong>Home Workout:</strong> Nasal breathing throughout. 60-90 sec rest. Form over weight.
        </div>
      )}
      {selectedWorkout === '4x4' && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-800">
          <strong>4×4 HIIT:</strong> Mouth breathing OK during intervals. Target 85-95% max HR. Nasal during recovery.
        </div>
      )}

      {/* Exercises */}
      <div className="space-y-3">
        {workout.exercises.map((exercise) => (
          <div key={exercise.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                {isCardio && (
                  <button onClick={() => toggleInterval(exercise.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${completedIntervals[exercise.id] ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}`}>
                    {completedIntervals[exercise.id] && <CheckCircle className="w-4 h-4" />}
                  </button>
                )}
                <div>
                  <div className="font-semibold text-gray-800">{exercise.name}</div>
                  <div className="text-xs text-gray-500">
                    {isCardio || isMobility ? exercise.duration : (
                      <>{exercise.warmup !== '-' && `Warmup: ${exercise.warmup} • `}Working: {exercise.working}</>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{exercise.notes}</span>
            </div>

            {/* Detailed instructions (expandable for mobility) */}
            {isMobility && exercise.detailed && (
              <button onClick={() => setExpandedExercise(expandedExercise === exercise.id ? null : exercise.id)}
                className="text-blue-600 text-xs flex items-center gap-1 mb-2">
                {expandedExercise === exercise.id ? 'Hide' : 'Show'} instructions
                <ChevronDown className={`w-3 h-3 transition-transform ${expandedExercise === exercise.id ? 'rotate-180' : ''}`} />
              </button>
            )}
            {expandedExercise === exercise.id && exercise.detailed && (
              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800 mb-2">
                <strong>How to:</strong> {exercise.detailed}
              </div>
            )}

            {/* Weight/Reps inputs for strength workouts */}
            {!isCardio && !isMobility && (
              <div className="space-y-2 mt-3">
                {(exerciseData[exercise.id]?.sets || [{ weight: '', reps: '' }]).map((set, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-8">Set {idx + 1}</span>
                    <input
                      type="number"
                      placeholder="lbs"
                      value={set.weight || ''}
                      onChange={(e) => updateSet(exercise.id, idx, 'weight', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                    />
                    <span className="text-gray-400">×</span>
                    <input
                      type="number"
                      placeholder="reps"
                      value={set.reps || ''}
                      onChange={(e) => updateSet(exercise.id, idx, 'reps', e.target.value)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                    />
                  </div>
                ))}
                <button onClick={() => addSet(exercise.id)} className="flex items-center gap-1 text-sm text-blue-600 mt-1">
                  <Plus className="w-4 h-4" /> Add set
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Post-workout section for cardio */}
      {isCardio && (
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-800">Cardio Stats</h3>
          {selectedWorkout === '4x4' && (
            <div>
              <label className="text-sm text-gray-600 block mb-2">Max HR During Intervals</label>
              <input type="number" value={cardioData.maxHR} onChange={(e) => setCardioData({ ...cardioData, maxHR: e.target.value })}
                placeholder="e.g., 175" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          )}
          <div>
            <label className="text-sm text-gray-600 block mb-2">Heart Rate Recovery (BPM drop in 1 min)</label>
            <input type="number" value={hrr} onChange={(e) => setHrr(e.target.value)}
              placeholder="e.g., 25" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
      )}

      {/* Post-workout section for strength */}
      {!isCardio && !isMobility && (
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-800">Post-Workout</h3>
          <div>
            <label className="text-sm text-gray-600 block mb-2">Nasal Breathing %</label>
            <input type="range" min="0" max="100" value={nasalPercent} onChange={(e) => setNasalPercent(parseInt(e.target.value))} className="w-full" />
            <div className="text-center text-lg font-bold text-blue-600">{nasalPercent}%</div>
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-2">Heart Rate Recovery (BPM drop in 1 min)</label>
            <input type="number" value={hrr} onChange={(e) => setHrr(e.target.value)}
              placeholder="e.g., 25" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-2">Notes</label>
            <textarea value={workoutNotes} onChange={(e) => setWorkoutNotes(e.target.value)}
              placeholder="PRs, how you felt, etc." className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={2} />
          </div>
        </div>
      )}

      {/* Mobility completion */}
      {isMobility && (
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-800">Complete</h3>
          <div>
            <label className="text-sm text-gray-600 block mb-2">Duration (minutes)</label>
            <input type="number" value={cardioData.duration} onChange={(e) => setCardioData({ ...cardioData, duration: e.target.value })}
              placeholder="e.g., 12" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// TRENDS TAB
// ============================================

const TrendsTab = ({ data }) => {
  const MiniChart = ({ dataKey, color, title, unit }) => (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h4 className="text-sm font-medium text-gray-600 mb-2">{title}</h4>
      <ResponsiveContainer width="100%" height={80}>
        <AreaChart data={data.slice(-7)}>
          <defs><linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color} stopOpacity={0.3}/><stop offset="95%" stopColor={color} stopOpacity={0}/></linearGradient></defs>
          <Area type="monotone" dataKey={dataKey} stroke={color} fill={`url(#grad-${dataKey})`} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="text-right text-sm text-gray-500">Latest: {data[data.length - 1]?.[dataKey]?.toFixed(1)} {unit}</div>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">7-Day Trends</h2>
      <MiniChart dataKey="mackenzieExhale" color="#1F4E79" title="Mackenzie Exhale" unit="sec" />
      <MiniChart dataKey="morningHRV" color="#C62828" title="Morning HRV" unit="ms" />
      <MiniChart dataKey="reactionTime" color="#E65100" title="Reaction Time" unit="ms" />
      <MiniChart dataKey="weight" color="#00897B" title="Weight" unit="lbs" />
      <MiniChart dataKey="hrr" color="#2E7D32" title="Heart Rate Recovery" unit="bpm" />
      
      {/* Subjective Ratings Trend */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Subjective Ratings (7-day avg)</h4>
        <div className="space-y-2">
          {[
            { key: 'focus', label: 'Focus', color: '#3B82F6' },
            { key: 'taskInitiation', label: 'Task Initiation', color: '#8B5CF6' },
            { key: 'emotionalReg', label: 'Emotional Reg', color: '#EC4899' },
            { key: 'mentalEnergy', label: 'Mental Energy', color: '#F59E0B' },
            { key: 'restlessness', label: 'Restlessness', color: '#10B981' },
          ].map(({ key, label, color }) => {
            const avg = data.slice(-7).reduce((sum, d) => sum + (d[key] || 5), 0) / 7;
            return (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-24">{label}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${avg * 10}%`, backgroundColor: color }} />
                </div>
                <span className="text-xs font-medium text-gray-700 w-8">{avg.toFixed(1)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================
// FOOD LOG
// ============================================

const FoodLog = ({ onLog }) => {
  const [mealType, setMealType] = useState('Meal 1');
  const [description, setDescription] = useState('');

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <Utensils className="w-5 h-5 text-green-600" />Log Meal
      </h3>
      <div className="space-y-3">
        <div className="flex gap-2">
          {['Meal 1', 'Meal 2', 'Meal 3'].map((type) => (
            <button key={type} onClick={() => setMealType(type)}
              className={`px-3 py-1 rounded-full text-sm ${mealType === type ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}>{type}</button>
          ))}
        </div>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="What did you eat?" className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={2} />
        <button onClick={() => { if(description.trim()) { onLog({type:'meal',mealType,value:description}); alert(`Logged ${mealType}`); setDescription(''); }}}
          className="w-full py-2 bg-green-500 text-white rounded-lg font-medium">Save Meal</button>
      </div>
    </div>
  );
};

// ============================================
// DAILY JOURNAL
// ============================================

const DailyJournal = ({ onLog }) => {
  const [entry, setEntry] = useState('');

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <Pencil className="w-5 h-5 text-indigo-600" />Daily Journal
      </h3>
      <p className="text-sm text-gray-500 mb-2">Thoughts, observations, how you're feeling...</p>
      <textarea value={entry} onChange={(e) => setEntry(e.target.value)}
        placeholder="What's on your mind today?" className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={4} />
      <button onClick={() => { if(entry.trim()) { onLog({type:'journal',value:entry,timestamp:new Date().toISOString()}); alert('Journal entry saved'); setEntry(''); }}}
        className="w-full py-2 bg-indigo-500 text-white rounded-lg font-medium mt-3">Save Journal Entry</button>
    </div>
  );
};

// ============================================
// SETUP TAB
// ============================================

const SetupTab = () => {
  const [googleScriptUrl, setGoogleScriptUrl] = useState(localStorage.getItem('googleScriptUrl') || '');
  const [googleSheetUrl, setGoogleSheetUrl] = useState(localStorage.getItem('googleSheetUrl') || '');
  const [startDate, setStartDate] = useState(localStorage.getItem('experimentStartDate') || '2026-02-08');
  const [equipment, setEquipment] = useState(JSON.parse(localStorage.getItem('equipment') || '{"polarH10":false,"ouraRing":false,"appleWatch":true,"mouthTape":false,"gripDynamometer":false}'));
  const [notifications, setNotifications] = useState(JSON.parse(localStorage.getItem('notifications') || JSON.stringify({
    morningProtocol: { enabled: true, time: '06:00' },
    breathwork: { enabled: true, time: '06:30' },
    nsdr: { enabled: false, time: '14:00' },
    gripStrength: { enabled: true, time: '06:15' },
    eveningCheckin: { enabled: true, time: '21:00' },
    unmedReminder: { enabled: true, time: '20:00' },
    medReminder: { enabled: true, time: '20:00' },
  })));
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const requestNotificationPermission = async () => {
    if (typeof Notification === 'undefined') {
      alert('Notifications not supported in this browser');
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission === 'granted') {
      new Notification('Operation Demon Slayer', { body: 'Notifications enabled! Get after it.' });
    }
  };

  const saveSettings = () => {
    localStorage.setItem('googleScriptUrl', googleScriptUrl);
    localStorage.setItem('googleSheetUrl', googleSheetUrl);
    localStorage.setItem('experimentStartDate', startDate);
    localStorage.setItem('equipment', JSON.stringify(equipment));
    localStorage.setItem('notifications', JSON.stringify(notifications));
    alert('Settings saved! Reload app to apply Google Sheets connection.');
  };

  const toggleEquipment = (key) => {
    setEquipment(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled }
    }));
  };

  const updateNotificationTime = (key, time) => {
    setNotifications(prev => ({
      ...prev,
      [key]: { ...prev[key], time }
    }));
  };

  const exportLogs = () => {
    const logs = JSON.parse(localStorage.getItem('adhd_DailyLog') || '[]');
    const csv = logs.map(l => `${l.timestamp},${l.metric || l.type},${l.value}`).join('\n');
    const blob = new Blob(['timestamp,metric,value\n' + csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adhd-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const NOTIFICATION_CONFIG = [
    { key: 'morningProtocol', label: 'Morning Protocol', desc: 'Weigh-in, Nostril, Mackenzie, HRV' },
    { key: 'breathwork', label: 'Breathwork', desc: '15 min HRV biofeedback' },
    { key: 'gripStrength', label: 'Grip Strength', desc: 'Mon/Wed/Fri only' },
    { key: 'nsdr', label: 'NSDR', desc: 'Non-Sleep Deep Rest' },
    { key: 'eveningCheckin', label: 'Evening Check-in', desc: '5 ratings + mouth tape' },
    { key: 'unmedReminder', label: 'Unmedicated Reminder', desc: 'Saturday before odd-week Sundays' },
    { key: 'medReminder', label: 'Medicated Reminder', desc: 'Saturday before even-week Sundays' },
  ];

  return (
    <div className="space-y-4">
      {/* Quick Links */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-blue-600" />
          Quick Links
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {googleSheetUrl && (
            <a href={googleSheetUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
              <FileText className="w-4 h-4" /> Google Sheet
            </a>
          )}
          <a href="https://humanbenchmark.com/tests/reactiontime" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium">
            <Zap className="w-4 h-4" /> Reaction Test
          </a>
          <a href="https://3rrzyovd9q.cognition.run" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
            <Brain className="w-4 h-4" /> Stroop
          </a>
          <a href="https://bc50jfnfsa.cognition.run" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
            <Brain className="w-4 h-4" /> Flanker
          </a>
          <a href="https://sketgsdcac.cognition.run" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-pink-50 text-pink-700 rounded-lg text-sm font-medium">
            <Brain className="w-4 h-4" /> Go/No-Go
          </a>
          <a href="https://g0zegupaji.cognition.run" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium">
            <Brain className="w-4 h-4" /> Attention Span
          </a>
          <div className="flex items-center gap-2 p-3 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium">
            <Brain className="w-4 h-4" /> TMT-Lite <span className="text-xs text-gray-400">(Phone app)</span>
          </div>
          <a href="https://cloud.ouraring.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
            <Moon className="w-4 h-4" /> Oura Dashboard
          </a>
          <a href="https://www.hrv4training.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium">
            <Heart className="w-4 h-4" /> HRV4Training
          </a>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          Notifications
        </h3>
        
        {notificationPermission !== 'granted' && (
          <button 
            onClick={requestNotificationPermission}
            className="w-full mb-3 p-3 bg-blue-500 text-white rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <Bell className="w-4 h-4" />
            Enable Notifications
          </button>
        )}
        
        {notificationPermission === 'granted' && (
          <p className="text-xs text-green-600 mb-3 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Notifications enabled
          </p>
        )}
        
        {notificationPermission === 'denied' && (
          <p className="text-xs text-red-600 mb-3 flex items-center gap-1">
            <BellOff className="w-3 h-3" /> Notifications blocked. Enable in browser settings.
          </p>
        )}

        <div className="space-y-2">
          {NOTIFICATION_CONFIG.map(item => (
            <div key={item.key} className={`flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${notifications[item.key]?.enabled ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
              <button onClick={() => toggleNotification(item.key)} className="flex-1 text-left">
                <div className="font-medium text-gray-800">{item.label}</div>
                <div className="text-xs text-gray-500">{item.desc}</div>
              </button>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={notifications[item.key]?.time || '06:00'}
                  onChange={(e) => updateNotificationTime(item.key, e.target.value)}
                  className="text-sm p-1 border rounded w-24"
                  disabled={!notifications[item.key]?.enabled}
                />
                {notifications[item.key]?.enabled ? 
                  <Bell className="w-5 h-5 text-blue-500" /> : 
                  <BellOff className="w-5 h-5 text-gray-300" />
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment Status */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Equipment Status
        </h3>
        <p className="text-xs text-gray-500 mb-3">Toggle what you have. App will adjust accordingly.</p>
        <div className="space-y-2">
          {[
            { key: 'polarH10', label: 'Polar H10 Chest Strap', desc: 'Morning HRV, biofeedback' },
            { key: 'ouraRing', label: 'Oura Ring', desc: 'Sleep HRV, respiratory rate' },
            { key: 'appleWatch', label: 'Apple Watch', desc: 'Workout HR, HRR' },
            { key: 'mouthTape', label: 'Mouth Tape', desc: 'Nasal breathing during sleep' },
            { key: 'gripDynamometer', label: 'Grip Dynamometer', desc: 'Grip strength tracking' },
          ].map(item => (
            <button key={item.key} onClick={() => toggleEquipment(item.key)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${equipment[item.key] ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="text-left">
                <div className="font-medium text-gray-800">{item.label}</div>
                <div className="text-xs text-gray-500">{item.desc}</div>
              </div>
              {equipment[item.key] ? 
                <CheckCircle className="w-6 h-6 text-green-500" /> : 
                <Circle className="w-6 h-6 text-gray-300" />
              }
            </button>
          ))}
        </div>
      </div>

      {/* Google Sheets Integration */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Cloud className="w-5 h-5 text-blue-600" />
          Google Sheets Integration
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Apps Script URL</label>
            <input type="text" value={googleScriptUrl} onChange={(e) => setGoogleScriptUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/..."
              className="w-full p-2 border rounded-lg text-sm" />
            <p className="text-xs text-gray-500 mt-1">Deploy Apps Script as Web App, paste URL here</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Sheet URL (for quick link)</label>
            <input type="text" value={googleSheetUrl} onChange={(e) => setGoogleSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              className="w-full p-2 border rounded-lg text-sm" />
          </div>
        </div>
      </div>

      {/* Experiment Settings */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Timer className="w-5 h-5 text-blue-600" />
          Experiment Settings
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date (Day 1)</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded-lg text-sm" />
          <p className="text-xs text-gray-500 mt-1">Used to calculate current day/week/phase</p>
        </div>
      </div>

      {/* Export & Save */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Download className="w-5 h-5 text-blue-600" />
          Data Management
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={exportLogs} className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
            Export Logs (CSV)
          </button>
          <button onClick={saveSettings} className="p-3 bg-green-500 text-white rounded-lg text-sm font-medium">
            Save Settings
          </button>
        </div>
      </div>

      {/* Version Info */}
      <div className="text-center text-xs text-gray-400 py-4">
        Operation Demon Slayer v4.2
      </div>
    </div>
  );
};

// ============================================
// MAIN APP
// ============================================

export default function ADHDProtocolApp() {
  const [data] = useState(generateDemoData());
  const [completed, setCompleted] = useState({});
  const [activeTab, setActiveTab] = useState('today');
  const [logs, setLogs] = useState([]);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [syncStatus, setSyncStatus] = useState(isGoogleSheetsConfigured() ? 'connected' : 'local');
  
  const START_DATE = new Date('2026-02-08');
  const today = new Date();
  const diffTime = today.getTime() - START_DATE.getTime();
  const calculatedDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const [selectedDay, setSelectedDay] = useState(null);
  const currentDay = selectedDay || Math.max(1, Math.min(84, calculatedDay));
  const currentWeek = Math.ceil(currentDay / 7);
  const phase = currentWeek === 1 ? 'Baseline' : currentWeek <= 6 ? 'Protocol' : currentWeek <= 10 ? 'Exercise Integration' : 'Analysis';
  
  // Calculate streak from completed data
  const calculateStreak = () => {
    let streak = 0;
    const keys = Object.keys(completed);
    // Simple: count consecutive days with at least 5 items completed
    // In production this would check actual date-based completion
    const dailyRequirements = ['mackenzie', 'hrv', 'breathwork', 'co2', 'reaction'];
    const todayCompleted = dailyRequirements.filter(k => completed[k]).length;
    if (todayCompleted >= 3) streak = 1;
    // For demo, return a reasonable number
    return Math.max(streak, Object.keys(completed).length > 5 ? Math.floor(Object.keys(completed).length / 3) : 0);
  };

  const streak = calculateStreak();
  
  const handleLog = async (entry) => {
    const logEntry = { ...entry, timestamp: new Date().toISOString(), day: currentDay };
    setLogs(prev => [...prev, logEntry]);
    
    // Sync to Google Sheets
    try {
      setSyncStatus('syncing');
      await logDailyMetric(entry.type, entry.value);
      setSyncStatus(isGoogleSheetsConfigured() ? 'connected' : 'local');
    } catch (err) {
      console.error('Sync error:', err);
      setSyncStatus('error');
    }
    
    console.log('Logged:', logEntry);
  };

  const handleComplete = (id) => {
    setCompleted(prev => ({ ...prev, [id]: true }));
  };

  const completedCount = Object.values(completed).filter(Boolean).length;

  // Get daily quote (seeded by day number for consistency)
  const dailyQuote = MOTIVATIONAL_QUOTES[currentDay % MOTIVATIONAL_QUOTES.length];

  const tabs = [
    { id: 'today', label: 'Today', icon: Sun },
    { id: 'workout', label: 'Workout', icon: Dumbbell },
    { id: 'protocols', label: 'Protocols', icon: Wind },
    { id: 'tests', label: 'Tests', icon: Brain },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'setup', label: 'Setup', icon: Link },
  ];

  const DayPicker = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowDayPicker(false)}>
      <div className="bg-white rounded-xl p-4 max-w-sm w-full max-h-96 overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Select Day</h3>
          <button onClick={() => { setSelectedDay(null); setShowDayPicker(false); }} className="text-blue-600 text-sm">Reset</button>
        </div>
        {[1,2,3,4,5,6,7,8,9,10,11,12].map(week => (
          <div key={week}>
            <div className="text-xs text-gray-500 mt-2 mb-1">Week {week}</div>
            <div className="grid grid-cols-7 gap-1">
              {[0,1,2,3,4,5,6].map(d => {
                const day = (week - 1) * 7 + d + 1;
                const isSelected = day === currentDay;
                const isFuture = day > calculatedDay;
                return (
                  <button key={day} onClick={() => { setSelectedDay(day); setShowDayPicker(false); }} disabled={isFuture}
                    className={`p-2 rounded text-sm ${isSelected ? 'bg-blue-600 text-white' : isFuture ? 'bg-gray-100 text-gray-300' : 'bg-gray-50 hover:bg-gray-100'}`}>{day}</button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {showDayPicker && <DayPicker />}
      
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-4 sticky top-0 z-20">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-xl font-bold">Operation Demon Slayer</h1>
              <button onClick={() => setShowDayPicker(true)} className="text-blue-200 text-sm hover:text-white flex items-center gap-1">
                Day {currentDay} • Week {currentWeek} • {phase}
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="font-bold">{streak} day streak</span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <p className="text-sm text-blue-200">{completedCount} tasks</p>
                {syncStatus === 'connected' && <Cloud className="w-3 h-3 text-green-400" title="Synced to Google Sheets" />}
                {syncStatus === 'local' && <CloudOff className="w-3 h-3 text-yellow-400" title="Local only - configure Google Sheets" />}
                {syncStatus === 'syncing' && <Cloud className="w-3 h-3 text-blue-300 animate-pulse" title="Syncing..." />}
                {syncStatus === 'error' && <CloudOff className="w-3 h-3 text-red-400" title="Sync error" />}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Motivational Quote */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 text-white">
          <p className="text-sm italic">"{dailyQuote.text}"</p>
          <p className="text-xs text-gray-400 mt-2 text-right">— {dailyQuote.author}</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-lg mx-auto p-4">
        {activeTab === 'today' && (
          <div className="space-y-4">
            <TodayTab currentDay={currentDay} currentWeek={currentWeek} completed={completed} setCompleted={setCompleted} onLog={handleLog} setActiveTab={setActiveTab} />
            <FoodLog onLog={handleLog} />
            <DailyJournal onLog={handleLog} />
          </div>
        )}
        {activeTab === 'workout' && <WorkoutTab onLog={handleLog} />}
        {activeTab === 'protocols' && <ProtocolsTab onLog={handleLog} onComplete={handleComplete} />}
        {activeTab === 'tests' && <TestsTab onLog={handleLog} currentWeek={currentWeek} />}
        {activeTab === 'trends' && <TrendsTab data={data} />}
        {activeTab === 'setup' && <SetupTab />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20">
        <div className="max-w-lg mx-auto flex">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 flex flex-col items-center gap-1 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`}>
              <tab.icon className="w-5 h-5" />
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
