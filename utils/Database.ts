import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { Book, Verse } from '../types/Bible';

const DB_NAME = 'bible.db';

export const getDbPath = () => `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function initDatabase(): Promise<SQLite.SQLiteDatabase | null> {
    if (Platform.OS === 'web') {
        return null;
    }

    if (dbInstance) return dbInstance;

    const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
    if (!(await FileSystem.getInfoAsync(sqliteDir)).exists) {
        await FileSystem.makeDirectoryAsync(sqliteDir);
    }

    const dbPath = getDbPath();
    const fileInfo = await FileSystem.getInfoAsync(dbPath);

    if (!fileInfo.exists) {
        console.log("Database file doesn't exist, copying from assets...");
        const asset = Asset.fromModule(require('../assets/bible.db'));
        if (!asset.localUri) {
            await asset.downloadAsync();
        }

        if (asset.localUri) {
            await FileSystem.copyAsync({
                from: asset.localUri,
                to: dbPath,
            });
            console.log("Database copied successfully.");
        } else {
            throw new Error("Failed to download or locate bible.db asset");
        }
    } else {
        console.log("Database already exists at", dbPath);
    }

    dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
    return dbInstance;
}

export async function getBooks(): Promise<Book[]> {
    if (Platform.OS === 'web') {
        const res = await fetch('/api/books');
        return await res.json();
    }
    const db = await initDatabase();
    return await db!.getAllAsync<Book>('SELECT * FROM books ORDER BY book_id');
}

export async function getVerses(bookId: number, chapter: number): Promise<Verse[]> {
    if (Platform.OS === 'web') {
        const res = await fetch(`/api/verses?bookId=${encodeURIComponent(bookId)}&chapter=${encodeURIComponent(chapter)}`);
        return await res.json();
    }
    const db = await initDatabase();
    return await db!.getAllAsync<Verse>(
        'SELECT * FROM verses WHERE book_id = ? AND chapter = ? ORDER BY verse',
        [bookId, chapter]
    );
}

export async function getChapterCount(bookId: number): Promise<number> {
    if (Platform.OS === 'web') {
        const res = await fetch(`/api/chapter-count?bookId=${encodeURIComponent(bookId)}`);
        const data = await res.json();
        return data.chapter_count || 0;
    }
    const db = await initDatabase();
    const result = await db!.getFirstAsync<{ chapter_count: number }>(
        'SELECT chapter_count FROM books WHERE book_id = ?',
        [bookId]
    );
    return result?.chapter_count || 0;
}
