
import sqlite3
import csv
import os

# Paths
ARCHIVE_DIR = "/Users/dvaughnhouse/Downloads/archive-2"
BOOKS_CSV = os.path.join(ARCHIVE_DIR, "BibleData-Book.csv")
VERSES_CSV = os.path.join(ARCHIVE_DIR, "AlamoPolyglot.csv")
DB_NAME = "../assets/bible.db"

def create_database():
    # Ensure assets directory exists
    os.makedirs(os.path.dirname(DB_NAME), exist_ok=True)
    
    # Remove existing db if any
    if os.path.exists(DB_NAME):
        os.remove(DB_NAME)

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # Create tables
    print("Creating tables...")
    cursor.execute('''
        CREATE TABLE books (
            book_id INTEGER PRIMARY KEY,
            book_name TEXT,
            chapter_count INTEGER,
            verse_count INTEGER,
            short_name TEXT
        )
    ''')

    cursor.execute('''
        CREATE TABLE verses (
            id INTEGER PRIMARY KEY,
            book_id INTEGER,
            chapter INTEGER,
            verse INTEGER,
            text TEXT,
            FOREIGN KEY(book_id) REFERENCES books(book_id)
        )
    ''')

    # Import Books
    print("Importing books...")
    with open(BOOKS_CSV, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            cursor.execute('''
                INSERT INTO books (book_id, book_name, chapter_count, verse_count, short_name)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                row['book_id'],
                row['book_name'],
                row['chapter_count'],
                row['verse_count'],
                row['short_name']
            ))

    # Import Verses
    print("Importing verses...")
    with open(VERSES_CSV, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        count = 0
        batch = []
        for row in reader:
            # We will use the 'world_english_bible_web' column as the primary text for now
            # If that is empty, fallback to KJ
            text = row.get('world_english_bible_web') or row.get('king_james_bible_kjv')
            
            batch.append((
                row['id'],
                row['book_id'],
                row['chapter'],
                row['verse'],
                text
            ))
            
            count += 1
            if count % 1000 == 0:
                cursor.executemany('''
                    INSERT INTO verses (id, book_id, chapter, verse, text)
                    VALUES (?, ?, ?, ?, ?)
                ''', batch)
                batch = []
                print(f"Processed {count} verses...", end='\r')
        
        if batch:
             cursor.executemany('''
                    INSERT INTO verses (id, book_id, chapter, verse, text)
                    VALUES (?, ?, ?, ?, ?)
                ''', batch)

    # Create indices
    print("\nCreating indices...")
    cursor.execute('CREATE INDEX idx_verses_book_chapter ON verses(book_id, chapter)')
    
    conn.commit()
    conn.close()
    print(f"\nDatabase created at {DB_NAME}")

if __name__ == "__main__":
    create_database()
