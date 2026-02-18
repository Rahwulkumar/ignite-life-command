// Bible Books Reference Data
// Complete list of all 66 Bible books with chapter counts

export interface BibleBook {
    id: number;
    name: string;
    testament: 'old' | 'new';
    chapters: number;
    abbreviation: string;
}

export const BIBLE_BOOKS: BibleBook[] = [
    // Old Testament (39 books)
    { id: 1, name: 'Genesis', testament: 'old', chapters: 50, abbreviation: 'Gen' },
    { id: 2, name: 'Exodus', testament: 'old', chapters: 40, abbreviation: 'Exod' },
    { id: 3, name: 'Leviticus', testament: 'old', chapters: 27, abbreviation: 'Lev' },
    { id: 4, name: 'Numbers', testament: 'old', chapters: 36, abbreviation: 'Num' },
    { id: 5, name: 'Deuteronomy', testament: 'old', chapters: 34, abbreviation: 'Deut' },
    { id: 6, name: 'Joshua', testament: 'old', chapters: 24, abbreviation: 'Josh' },
    { id: 7, name: 'Judges', testament: 'old', chapters: 21, abbreviation: 'Judg' },
    { id: 8, name: 'Ruth', testament: 'old', chapters: 4, abbreviation: 'Ruth' },
    { id: 9, name: '1 Samuel', testament: 'old', chapters: 31, abbreviation: '1Sam' },
    { id: 10, name: '2 Samuel', testament: 'old', chapters: 24, abbreviation: '2Sam' },
    { id: 11, name: '1 Kings', testament: 'old', chapters: 22, abbreviation: '1Kgs' },
    { id: 12, name: '2 Kings', testament: 'old', chapters: 25, abbreviation: '2Kgs' },
    { id: 13, name: '1 Chronicles', testament: 'old', chapters: 29, abbreviation: '1Chr' },
    { id: 14, name: '2 Chronicles', testament: 'old', chapters: 36, abbreviation: '2Chr' },
    { id: 15, name: 'Ezra', testament: 'old', chapters: 10, abbreviation: 'Ezra' },
    { id: 16, name: 'Nehemiah', testament: 'old', chapters: 13, abbreviation: 'Neh' },
    { id: 17, name: 'Esther', testament: 'old', chapters: 10, abbreviation: 'Esth' },
    { id: 18, name: 'Job', testament: 'old', chapters: 42, abbreviation: 'Job' },
    { id: 19, name: 'Psalms', testament: 'old', chapters: 150, abbreviation: 'Ps' },
    { id: 20, name: 'Proverbs', testament: 'old', chapters: 31, abbreviation: 'Prov' },
    { id: 21, name: 'Ecclesiastes', testament: 'old', chapters: 12, abbreviation: 'Eccl' },
    { id: 22, name: 'Song of Solomon', testament: 'old', chapters: 8, abbreviation: 'Song' },
    { id: 23, name: 'Isaiah', testament: 'old', chapters: 66, abbreviation: 'Isa' },
    { id: 24, name: 'Jeremiah', testament: 'old', chapters: 52, abbreviation: 'Jer' },
    { id: 25, name: 'Lamentations', testament: 'old', chapters: 5, abbreviation: 'Lam' },
    { id: 26, name: 'Ezekiel', testament: 'old', chapters: 48, abbreviation: 'Ezek' },
    { id: 27, name: 'Daniel', testament: 'old', chapters: 12, abbreviation: 'Dan' },
    { id: 28, name: 'Hosea', testament: 'old', chapters: 14, abbreviation: 'Hos' },
    { id: 29, name: 'Joel', testament: 'old', chapters: 3, abbreviation: 'Joel' },
    { id: 30, name: 'Amos', testament: 'old', chapters: 9, abbreviation: 'Amos' },
    { id: 31, name: 'Obadiah', testament: 'old', chapters: 1, abbreviation: 'Obad' },
    { id: 32, name: 'Jonah', testament: 'old', chapters: 4, abbreviation: 'Jonah' },
    { id: 33, name: 'Micah', testament: 'old', chapters: 7, abbreviation: 'Mic' },
    { id: 34, name: 'Nahum', testament: 'old', chapters: 3, abbreviation: 'Nah' },
    { id: 35, name: 'Habakkuk', testament: 'old', chapters: 3, abbreviation: 'Hab' },
    { id: 36, name: 'Zephaniah', testament: 'old', chapters: 3, abbreviation: 'Zeph' },
    { id: 37, name: 'Haggai', testament: 'old', chapters: 2, abbreviation: 'Hag' },
    { id: 38, name: 'Zechariah', testament: 'old', chapters: 14, abbreviation: 'Zech' },
    { id: 39, name: 'Malachi', testament: 'old', chapters: 4, abbreviation: 'Mal' },

    // New Testament (27 books)
    { id: 40, name: 'Matthew', testament: 'new', chapters: 28, abbreviation: 'Matt' },
    { id: 41, name: 'Mark', testament: 'new', chapters: 16, abbreviation: 'Mark' },
    { id: 42, name: 'Luke', testament: 'new', chapters: 24, abbreviation: 'Luke' },
    { id: 43, name: 'John', testament: 'new', chapters: 21, abbreviation: 'John' },
    { id: 44, name: 'Acts', testament: 'new', chapters: 28, abbreviation: 'Acts' },
    { id: 45, name: 'Romans', testament: 'new', chapters: 16, abbreviation: 'Rom' },
    { id: 46, name: '1 Corinthians', testament: 'new', chapters: 16, abbreviation: '1Cor' },
    { id: 47, name: '2 Corinthians', testament: 'new', chapters: 13, abbreviation: '2Cor' },
    { id: 48, name: 'Galatians', testament: 'new', chapters: 6, abbreviation: 'Gal' },
    { id: 49, name: 'Ephesians', testament: 'new', chapters: 6, abbreviation: 'Eph' },
    { id: 50, name: 'Philippians', testament: 'new', chapters: 4, abbreviation: 'Phil' },
    { id: 51, name: 'Colossians', testament: 'new', chapters: 4, abbreviation: 'Col' },
    { id: 52, name: '1 Thessalonians', testament: 'new', chapters: 5, abbreviation: '1Thess' },
    { id: 53, name: '2 Thessalonians', testament: 'new', chapters: 3, abbreviation: '2Thess' },
    { id: 54, name: '1 Timothy', testament: 'new', chapters: 6, abbreviation: '1Tim' },
    { id: 55, name: '2 Timothy', testament: 'new', chapters: 4, abbreviation: '2Tim' },
    { id: 56, name: 'Titus', testament: 'new', chapters: 3, abbreviation: 'Titus' },
    { id: 57, name: 'Philemon', testament: 'new', chapters: 1, abbreviation: 'Phlm' },
    { id: 58, name: 'Hebrews', testament: 'new', chapters: 13, abbreviation: 'Heb' },
    { id: 59, name: 'James', testament: 'new', chapters: 5, abbreviation: 'Jas' },
    { id: 60, name: '1 Peter', testament: 'new', chapters: 5, abbreviation: '1Pet' },
    { id: 61, name: '2 Peter', testament: 'new', chapters: 3, abbreviation: '2Pet' },
    { id: 62, name: '1 John', testament: 'new', chapters: 5, abbreviation: '1John' },
    { id: 63, name: '2 John', testament: 'new', chapters: 1, abbreviation: '2John' },
    { id: 64, name: '3 John', testament: 'new', chapters: 1, abbreviation: '3John' },
    { id: 65, name: 'Jude', testament: 'new', chapters: 1, abbreviation: 'Jude' },
    { id: 66, name: 'Revelation', testament: 'new', chapters: 22, abbreviation: 'Rev' },
];

// Helper function to get book by name
export function getBibleBook(name: string): BibleBook | undefined {
    return BIBLE_BOOKS.find(
        book => book.name.toLowerCase() === name.toLowerCase() ||
            book.abbreviation.toLowerCase() === name.toLowerCase()
    );
}

// Helper function to calculate progress percentage
export function calculateReadingProgress(
    bookName: string,
    currentChapter: number,
    currentVerse: number
): number {
    const book = getBibleBook(bookName);
    if (!book) return 0;

    // Progress = (chapters completed / total chapters) * 100
    // We consider a chapter "completed" if we're past it
    const chaptersCompleted = currentChapter - 1; // If at chapter 5, you've completed 4
    const progress = (chaptersCompleted / book.chapters) * 100;

    return Math.min(Math.max(progress, 0), 100); // Clamp between 0-100
}
