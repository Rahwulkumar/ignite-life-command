/**
 * Bible reference validation library
 * Contains all 66 books with their chapter counts and verse counts per chapter.
 *
 * Usage:
 *   const result = validateBibleReference("John 3:16");
 *   if (!result.valid) toast.error(result.error);
 */

// ── Data ────────────────────────────────────────────────────────────────────

/**
 * All 66 Bible books: canonical name → array of verse counts per chapter
 * (index 0 = chapter 1, etc.)
 */
export const BIBLE_BOOKS: Record<string, number[]> = {
  // Old Testament
  Genesis: [31,25,24,26,32,22,24,22,29,32,32,20,18,24,21,16,27,33,38,18,34,24,20,67,34,35,46,22,35,43,55,32,20,31,29,43,36,30,23,23,57,38,34,34,28,34,31,22,33,26],
  Exodus: [22,25,22,31,23,30,25,32,35,29,10,51,22,31,27,36,16,27,25,26,36,31,33,18,40,37,21,43,46,38,18,35,23,35,35,38,29,31,43,38],
  Leviticus: [17,16,17,35,19,30,38,36,24,20,47,8,59,57,33,34,16,30,24,16,15,22,20,25,29,29,46,35,43],
  Numbers: [54,34,51,49,31,27,89,26,23,36,35,16,33,45,41,50,13,32,22,29,35,41,30,25,18,65,23,31,40,16,54,42,56,29,34,13],
  Deuteronomy: [46,37,29,49,33,25,26,20,29,22,32,32,18,29,23,22,20,22,21,20,23,30,25,22,19,19,26,68,29,20,30,52,29,12],
  Joshua: [18,24,17,24,15,27,26,35,27,43,23,24,33,15,63,10,18,28,51,9,45,34,16,33],
  Judges: [36,23,31,24,31,40,25,35,57,18,40,15,25,20,20,31,13,31,30,48,25],
  Ruth: [22,23,18,22],
  "1 Samuel": [28,36,21,22,12,21,17,22,27,27,15,25,23,52,35,23,58,30,24,42,15,23,29,22,44,25,12,25,11,31,13],
  "2 Samuel": [27,32,39,12,25,23,29,18,13,19,27,31,39,33,37,23,29,33,43,26,22,51,39,25],
  "1 Kings": [53,46,28,34,18,38,51,66,28,29,43,33,34,31,34,34,24,46,21,43,29,53],
  "2 Kings": [18,25,27,44,27,33,20,29,37,36,21,21,25,29,38,20,41,37,37,21,26,20,37,20,30],
  "1 Chronicles": [54,55,24,43,26,81,40,40,44,14,47,40,14,17,29,43,27,17,19,8,30,19,32,31,31,32,34,21,30],
  "2 Chronicles": [17,18,17,22,14,42,22,18,31,19,23,16,22,15,19,14,19,34,11,37,20,12,21,27,28,23,9,27,36,27,21,33,25,33,27,23],
  Ezra: [11,70,13,24,17,22,28,36,15,44],
  Nehemiah: [11,20,32,23,19,19,73,18,38,39,36,47,31],
  Esther: [22,28,23,31,10,15,17,21,32,11],
  Job: [22,13,26,21,27,30,21,22,35,22,20,25,28,22,35,22,16,21,29,29,34,30,17,25,6,14,23,28,25,31,40,22,33,37,16,33,24,41,30,24,34,17],
  Psalms: [6,12,8,8,12,10,17,9,20,18,7,8,6,7,5,11,15,50,14,9,13,31,6,10,22,12,14,9,11,12,24,11,22,22,28,12,40,22,13,17,13,11,5,20,28,14,9,18,10,39,28,43,6,30,14,10,10,30,9,14,17,26,6,10,28,30,18,12,19,16,6,10,11,9,9,21,10,22,7,8,22,11,25,26,7,9,29,18,38,13,58,11,50,16,12,32,11,14,11,29,34,30,24,8,23,17],
  Proverbs: [33,22,35,27,23,35,27,36,18,32,31,28,25,35,33,33,28,24,29,30,31,29,35,34,28,28,27,28,27,33,31],
  Ecclesiastes: [18,26,22,16,20,12,29,17,18,20,10,14],
  "Song of Solomon": [17,17,11,16,16,13,13,14],
  Isaiah: [31,22,26,6,30,13,25,22,21,34,16,6,22,32,9,14,14,7,25,6,17,25,18,23,12,21,13,29,24,33,9,20,24,17,10,22,38,22,8,31,29,25,28,28,25,13,15,22,26,12,15,14,19,30,15,12,15,21,32,12,11,26],
  Jeremiah: [19,37,25,31,31,30,34,22,26,25,23,17,27,22,21,21,27,23,15,18,14,30,40,10,38,24,22,17,32,24,40,44,26,22,19,32,21,28,18,16,18,22,13,30,5,28,7,47,39,46,64,34],
  Lamentations: [22,22,66,22,22],
  Ezekiel: [28,10,27,17,17,14,27,18,11,22,25,28,23,23,8,63,24,32,14,49,32,31,49,27,17,21,36,26,21,26,18,32,33,31,15,38,28,23,29,49,26,20,27,31,25,24,23,35],
  Daniel: [21,49,30,37,31,28,28,27,27,21,45,13],
  Hosea: [11,23,5,19,15,11,16,14,17,15,12,14,16,9],
  Joel: [20,32,21],
  Amos: [15,16,15,13,27,14,17,14,15],
  Obadiah: [21],
  Jonah: [17,10,10,11],
  Micah: [16,13,12,13,15,16,20],
  Nahum: [15,13,19],
  Habakkuk: [17,20,19],
  Zephaniah: [18,15,20],
  Haggai: [15,23],
  Zechariah: [21,13,10,14,11,15,14,23,17,12,17,14,9,21],
  Malachi: [14,17,18,6],
  // New Testament
  Matthew: [25,23,17,25,48,34,29,34,38,42,30,50,58,36,39,28,27,35,30,34,46,46,39,51,46,75,66,20],
  Mark: [45,28,35,41,43,56,37,38,50,52,33,44,37,72,47,20],
  Luke: [80,52,38,44,39,49,50,56,62,42,54,59,35,35,32,31,37,43,48,47,38,71,56,53],
  John: [51,25,36,54,47,71,53,59,41,42,57,50,38,31,27,33,26,40,42,31,25],
  Acts: [26,47,26,37,42,15,60,40,43,48,30,25,52,28,41,40,34,28,41,38,40,30,35,27,27,32,44,31],
  Romans: [32,29,31,25,21,23,25,39,33,21,36,21,14,23,33,27],
  "1 Corinthians": [31,16,23,21,13,20,40,34,29,22,25,20,28,22,35,22,16,21,29,29,34,30,17,25,6,14,23,28,25,31,40,22,33,37,16,33,24,41,30,24,34,17],
  "2 Corinthians": [24,17,18,18,21,18,16,24,15,18,33,21,14],
  Galatians: [24,21,29,31,26,18],
  Ephesians: [23,22,21,32,33,24],
  Philippians: [30,30,21,23],
  Colossians: [29,23,25,18],
  "1 Thessalonians": [10,20,13,18,28],
  "2 Thessalonians": [12,17,18],
  "1 Timothy": [20,15,16,16,25,21],
  "2 Timothy": [18,26,17,22],
  Titus: [16,15,15],
  Philemon: [25],
  Hebrews: [14,18,19,16,14,20,28,13,28,39,40,29,25],
  James: [27,26,18,17,20],
  "1 Peter": [25,25,22,19,14],
  "2 Peter": [21,22,18],
  "1 John": [10,29,24,21,21],
  "2 John": [13],
  "3 John": [14],
  Jude: [25],
  Revelation: [20,29,22,11,14,17,17,13,21,11,19,17,18,20,8,21,18,24,21,15,27,21],
};

// Common abbreviations / alternate spellings → canonical name
const ALIASES: Record<string, string> = {
  gen: "Genesis", ge: "Genesis",
  exo: "Exodus", ex: "Exodus",
  lev: "Leviticus", le: "Leviticus",
  num: "Numbers", nu: "Numbers",
  deu: "Deuteronomy", dt: "Deuteronomy", deut: "Deuteronomy",
  jos: "Joshua", josh: "Joshua",
  jdg: "Judges", judg: "Judges",
  rut: "Ruth", ru: "Ruth",
  "1sa": "1 Samuel", "1sam": "1 Samuel",
  "2sa": "2 Samuel", "2sam": "2 Samuel",
  "1ki": "1 Kings", "1kgs": "1 Kings", "1kings": "1 Kings",
  "2ki": "2 Kings", "2kgs": "2 Kings", "2kings": "2 Kings",
  "1ch": "1 Chronicles", "1chr": "1 Chronicles", "1chron": "1 Chronicles",
  "2ch": "2 Chronicles", "2chr": "2 Chronicles", "2chron": "2 Chronicles",
  ezr: "Ezra",
  neh: "Nehemiah",
  est: "Esther",
  job: "Job",
  psa: "Psalms", ps: "Psalms", psalm: "Psalms",
  pro: "Proverbs", prov: "Proverbs", pr: "Proverbs",
  ecc: "Ecclesiastes", eccl: "Ecclesiastes", qoh: "Ecclesiastes",
  sos: "Song of Solomon", song: "Song of Solomon", sol: "Song of Solomon",
  isa: "Isaiah",
  jer: "Jeremiah",
  lam: "Lamentations",
  eze: "Ezekiel", ezek: "Ezekiel",
  dan: "Daniel", da: "Daniel",
  hos: "Hosea",
  joe: "Joel", jl: "Joel",
  amo: "Amos", am: "Amos",
  oba: "Obadiah", ob: "Obadiah",
  jon: "Jonah",
  mic: "Micah",
  nah: "Nahum",
  hab: "Habakkuk",
  zep: "Zephaniah", zeph: "Zephaniah",
  hag: "Haggai",
  zec: "Zechariah", zech: "Zechariah",
  mal: "Malachi",
  mat: "Matthew", matt: "Matthew", mt: "Matthew",
  mar: "Mark", mk: "Mark",
  luk: "Luke", lk: "Luke",
  joh: "John", jn: "John",
  act: "Acts",
  rom: "Romans",
  "1co": "1 Corinthians", "1cor": "1 Corinthians",
  "2co": "2 Corinthians", "2cor": "2 Corinthians",
  gal: "Galatians",
  eph: "Ephesians",
  phi: "Philippians", php: "Philippians", phil: "Philippians",
  col: "Colossians",
  "1th": "1 Thessalonians", "1thes": "1 Thessalonians", "1thess": "1 Thessalonians",
  "2th": "2 Thessalonians", "2thes": "2 Thessalonians", "2thess": "2 Thessalonians",
  "1ti": "1 Timothy", "1tim": "1 Timothy",
  "2ti": "2 Timothy", "2tim": "2 Timothy",
  tit: "Titus",
  phm: "Philemon", phlm: "Philemon",
  heb: "Hebrews",
  jas: "James", jm: "James",
  "1pe": "1 Peter", "1pet": "1 Peter",
  "2pe": "2 Peter", "2pet": "2 Peter",
  "1jo": "1 John", "1jn": "1 John",
  "2jo": "2 John", "2jn": "2 John",
  "3jo": "3 John", "3jn": "3 John",
  jud: "Jude",
  rev: "Revelation", re: "Revelation",
};

// ── Core functions ────────────────────────────────────────────────────────────

/** Returns all book names sorted alphabetically, for autocomplete */
export const ALL_BOOK_NAMES = Object.keys(BIBLE_BOOKS).sort();

/**
 * Given a raw book string (case-insensitive, may be abbreviated),
 * returns the canonical book name or null.
 */
export function resolveBookName(raw: string): string | null {
  const trimmed = raw.trim();
  // Try exact match (case-insensitive)
  const exact = ALL_BOOK_NAMES.find(
    (b) => b.toLowerCase() === trimmed.toLowerCase()
  );
  if (exact) return exact;

  // Try alias table
  const alias = ALIASES[trimmed.toLowerCase().replace(/\s+/g, "")];
  if (alias) return alias;

  // Try prefix match (e.g. "Gen" → "Genesis") — must be unique
  const withNumber = trimmed.replace(/^(\d)\s*/, "$1 "); // normalise "1John" → "1 John"
  const matches = ALL_BOOK_NAMES.filter((b) =>
    b.toLowerCase().startsWith(withNumber.toLowerCase())
  );
  if (matches.length === 1) return matches[0];

  return null;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  /** Canonical book name if resolved */
  book?: string;
  chapter?: number;
  verse?: number;
  /** Normalised reference string e.g. "John 3:16" */
  normalised?: string;
}

/**
 * Parse and validate a Bible reference string.
 * Accepts formats: "John 3:16", "Jn 3:16", "jn3:16", "1 Cor 13:4"
 *
 * Rules enforced:
 *  - Book name must be a known Bible book (or unambiguous abbreviation)
 *  - Chapter must be provided
 *  - Verse must be provided
 *  - Chapter must be within the book's chapter count
 *  - Verse must be within that chapter's verse count
 */
export function validateBibleReference(raw: string): ValidationResult {
  const input = raw.trim();

  if (!input) {
    return { valid: false, error: "Reference is required" };
  }

  // Split into book part + chapter:verse
  // e.g. "1 Corinthians 13:4"  → book="1 Corinthians", rest="13:4"
  // e.g. "Jn3:16"              → book="Jn", rest="3:16"
  const match = input.match(
    /^(\d\s*[A-Za-z]+(?:\s+[A-Za-z]+)*|[A-Za-z]+(?:\s+[A-Za-z]+)*)\s+(\d+):(\d+)$/i
  );

  if (!match) {
    // Could be missing chapter:verse entirely
    const hasColon = input.includes(":");
    if (!hasColon) {
      return {
        valid: false,
        error: 'Format must be "Book Chapter:Verse" (e.g. John 3:16)',
      };
    }
    return {
      valid: false,
      error: 'Could not parse reference. Try "John 3:16" or "1 Cor 13:4"',
    };
  }

  const rawBook = match[1];
  const chapter = parseInt(match[2], 10);
  const verse = parseInt(match[3], 10);

  // Resolve book
  const book = resolveBookName(rawBook);
  if (!book) {
    return {
      valid: false,
      error: `"${rawBook}" is not a recognised Bible book. Check spelling or use a common abbreviation.`,
    };
  }

  const chapters = BIBLE_BOOKS[book];

  // Validate chapter
  if (chapter < 1 || chapter > chapters.length) {
    return {
      valid: false,
      error: `${book} has ${chapters.length} chapter${chapters.length === 1 ? "" : "s"} (you entered chapter ${chapter})`,
    };
  }

  // Validate verse
  const maxVerse = chapters[chapter - 1];
  if (verse < 1 || verse > maxVerse) {
    return {
      valid: false,
      error: `${book} ${chapter} has ${maxVerse} verse${maxVerse === 1 ? "" : "s"} (you entered verse ${verse})`,
    };
  }

  return {
    valid: true,
    book,
    chapter,
    verse,
    normalised: `${book} ${chapter}:${verse}`,
  };
}

/** Book name suggestions for autocomplete — returns up to `limit` matches */
export function suggestBooks(query: string, limit = 6): string[] {
  if (!query.trim()) return [];
  const q = query.trim().toLowerCase();
  return ALL_BOOK_NAMES.filter((b) => b.toLowerCase().startsWith(q)).slice(
    0,
    limit
  );
}
