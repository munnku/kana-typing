// Romaji input state
export type RomajiInputState = 'idle' | 'partial' | 'complete' | 'error';

// Finger names for keyboard guide
export type FingerName =
  | 'left-pinky' | 'left-ring' | 'left-middle' | 'left-index' | 'left-thumb'
  | 'right-thumb' | 'right-index' | 'right-middle' | 'right-ring' | 'right-pinky';

export type Hand = 'left' | 'right';

export interface KeyInfo {
  finger: FingerName;
  hand: Hand;
  label: string;        // display label on key
  shiftLabel?: string;  // shift label if exists
}

// A single kana character unit to type
export interface KanaUnit {
  kana: string;           // e.g. "か"
  romaji: string[];       // accepted romaji sequences e.g. ["ka"] or ["si","shi"]
  displayRomaji: string;  // canonical display romaji e.g. "ka"
}

// Character states in typing display
export type CharState = 'pending' | 'current' | 'correct' | 'error' | 'corrected';

export interface DisplayChar {
  kana: string;
  displayRomaji: string;
  acceptedRomaji: string[];
  state: CharState;
  typedRomaji: string; // what user has typed so far for this char
}

// Lesson types
export type LessonType = 'intro' | 'practice' | 'words' | 'test';

export interface Lesson {
  id: string;           // e.g. "u1-l01"
  unitId: string;       // e.g. "unit-1"
  unitTitle: string;    // e.g. "あ行"
  lessonNumber: number;
  title: string;        // e.g. "あいうえお を覚えよう"
  description: string;
  type: LessonType;
  newKeys: string[];    // new kana introduced e.g. ["あ","い","う","え","お"]
  text: string;         // the text to type (in hiragana + spaces)
  targetKpm: number;    // target characters per minute for 3 stars
  starThresholds: {
    one: { kpm: number; accuracy: number };
    two: { kpm: number; accuracy: number };
    three: { kpm: number; accuracy: number };
  };
  xpReward: number;     // XP awarded on completion
}

// Typing session state
export type SessionStatus = 'idle' | 'active' | 'paused' | 'complete';

export interface TypingSessionState {
  status: SessionStatus;
  chars: DisplayChar[];
  cursorIndex: number;
  partialRomaji: string;    // current partial romaji input (e.g. "k" waiting for "a")
  errorCount: number;
  keystrokeCount: number;   // total keystrokes including errors
  startedAt: number | null; // Date.now()
  elapsedSeconds: number;
}

// Session result
export interface SessionResult {
  lessonId: string;
  kpm: number;            // characters per minute
  accuracy: number;       // 0-100
  stars: 0 | 1 | 2 | 3;
  durationSeconds: number;
  correctChars: number;
  totalChars: number;
  errorCount: number;
  completedAt: string;    // ISO 8601
  xpEarned: number;
}

// Progress stored in localStorage
export interface LessonProgress {
  lessonId: string;
  unlocked: boolean;
  completed: boolean;
  bestKpm: number;
  bestAccuracy: number;
  stars: 0 | 1 | 2 | 3;
  attempts: number;
  lastPlayedAt: string | null;
  history: Array<{ kpm: number; accuracy: number; date: string }>;  // last 10 attempts
}

export interface UserProgress {
  version: number;
  lastUpdated: string;
  xp: number;
  level: number;
  streakDays: number;
  lastPracticeDate: string | null;  // ISO date string YYYY-MM-DD
  longestStreak: number;
  totalSessions: number;
  totalTimeSeconds: number;
  totalKeystrokes: number;
  lessons: Record<string, LessonProgress>;
  badges: string[];     // earned badge IDs
  weakKeys: Record<string, number>;  // kana -> error count for adaptive learning
}

// Badge definition
export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;         // emoji
  condition: string;    // human-readable condition
}

// App settings
export interface AppSettings {
  showKeyboard: boolean;
  showFingerGuide: boolean;
  soundEnabled: boolean;
  fontSize: 'sm' | 'md' | 'lg';
  theme: 'light' | 'dark' | 'blue';
  romajiGuide: 'always' | 'fadein' | 'never';  // show romaji hint
}

// Typing test mode (timed free practice)
export interface TypingTest {
  duration: 60 | 180 | 300;  // seconds: 1min, 3min, 5min
  text: string;
}

export interface TestResult {
  duration: number;
  kpm: number;
  accuracy: number;
  correctChars: number;
  errorCount: number;
  completedAt: string;
}
