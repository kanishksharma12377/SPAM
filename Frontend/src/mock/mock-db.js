/**
 * localStorage-backed store for demo (no-database) mode.
 *
 * Stands in for MongoDB: edits made in the UI persist across reloads on the
 * same browser, and "Reset demo data" puts everything back to the seed.
 */

import { buildSeedData } from './seed-data.js';

const DB_KEY = 'spam.demo.db.v1';
const SESSION_KEY = 'spam.demo.session.v1';

// If localStorage is unavailable (private mode, quota exhausted, SSR) we fall
// back to this in-memory copy so the app still works for the session.
let memoryDb = null;
let storageBroken = false;

function readRaw(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/** Deep clone so callers can never mutate stored state by reference. */
function clone(value) {
  return typeof structuredClone === 'function'
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}

export function loadDb() {
  if (storageBroken && memoryDb) return memoryDb;

  const raw = readRaw(DB_KEY);
  if (raw) {
    try {
      memoryDb = JSON.parse(raw);
      return memoryDb;
    } catch {
      // Corrupted payload -- fall through and re-seed.
    }
  }

  memoryDb = buildSeedData();
  if (!writeRaw(DB_KEY, JSON.stringify(memoryDb))) storageBroken = true;
  return memoryDb;
}

export function saveDb(db) {
  memoryDb = db;
  if (!writeRaw(DB_KEY, JSON.stringify(db))) {
    // Most often a QuotaExceededError from a large base64 upload. Keep the
    // session working from memory rather than losing the user's action.
    storageBroken = true;
    console.warn(
      '[SPAM demo] Could not persist to localStorage (likely storage quota). ' +
        'Changes will apply for this session but will not survive a reload.'
    );
  }
}

/** Read-modify-write helper: `mutator` receives the live db and may edit it. */
export function updateDb(mutator) {
  const db = loadDb();
  const result = mutator(db);
  saveDb(db);
  return result;
}

/** Wipe stored state and re-seed from seed-data.js. */
export function resetDb() {
  storageBroken = false;
  memoryDb = buildSeedData();
  if (!writeRaw(DB_KEY, JSON.stringify(memoryDb))) storageBroken = true;
  clearSession();
  return memoryDb;
}

/* ------------------------------------------------------------------ */
/* Session                                                             */
/* ------------------------------------------------------------------ */

/**
 * Stands in for the httpOnly `authToken` cookie the real backend sets.
 * Shape mirrors the JWT payload from controller/loginUserController.js:
 *   { id, name, role, setup }
 */
export function getSession() {
  const raw = readRaw(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setSession(payload) {
  writeRaw(SESSION_KEY, JSON.stringify(payload));
}

export function clearSession() {
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ */
/* Id generation                                                       */
/* ------------------------------------------------------------------ */

/** Mirrors counterModel.js findOneAndUpdate($inc) auto-increment. */
export function nextId(db, name) {
  db.counters = db.counters || {};
  const current = db.counters[name] ?? 1;
  db.counters[name] = current + 1;
  return current;
}

export { clone };
