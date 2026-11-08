
export interface Book {
    book_id: number;
    book_name: string;
    chapter_count: number;
    verse_count: number;
    short_name: string;
}

export interface Verse {
    id: number;
    book_id: number;
    chapter: number;
    verse: number;
    text: string;
}
