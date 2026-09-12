/**
 * Robust, versioned LocalStorage wrapper for EngineeringGuides.
 * Complies with Prompt 01 Section 24.
 * Features:
 * - schemaVersion tracking
 * - Automatic migration from legacy unversioned keys
 * - Corrupted JSON recovery without silent data loss
 */

const STORAGE_VERSION = 1;
const PREFIX = 'eng_v1_';

export function getStoredItem(key, defaultValue = null) {
  try {
    const versionedKey = PREFIX + key;
    // 1. Try versioned key
    const versionedRaw = localStorage.getItem(versionedKey);
    if (versionedRaw !== null) {
      const parsed = JSON.parse(versionedRaw);
      if (parsed && parsed.__schemaVersion === STORAGE_VERSION) {
        return parsed.value;
      }
    }

    // 2. Migration: check legacy key
    const legacyRaw = localStorage.getItem(key);
    if (legacyRaw !== null) {
      try {
        const parsedLegacy = JSON.parse(legacyRaw);
        setStoredItem(key, parsedLegacy);
        return parsedLegacy;
      } catch {
        setStoredItem(key, legacyRaw);
        return legacyRaw;
      }
    }
  } catch (e) {
    console.warn(`[Storage] Safe recovery: could not read key '${key}':`, e);
  }
  return defaultValue;
}

export function setStoredItem(key, value) {
  try {
    const versionedKey = PREFIX + key;
    const record = {
      __schemaVersion: STORAGE_VERSION,
      value: value
    };
    localStorage.setItem(versionedKey, JSON.stringify(record));
    // Keep legacy key updated for backwards compatibility
    if (typeof value === 'string') {
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (e) {
    console.warn(`[Storage] Safe recovery: could not persist key '${key}':`, e);
  }
}
