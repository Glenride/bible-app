
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import { getBooks, getVerses, getChapterCount, initDatabase } from '../../utils/Database';
import { Book, Verse } from '../../types/Bible';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function BibleScreen() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
    const [verses, setVerses] = useState<Verse[]>([]);
    const [chapters, setChapters] = useState<number[]>([]);

    useEffect(() => {
        loadBooks();
    }, []);

    useEffect(() => {
        if (selectedBook && selectedChapter) {
            loadVerses(selectedBook.book_id, selectedChapter);
        }
    }, [selectedBook, selectedChapter]);

    const loadBooks = async () => {
        try {
            setLoading(true);
            await initDatabase();
            const loadedBooks = await getBooks();
            setBooks(loadedBooks);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleBookSelect = async (book: Book) => {
        setSelectedBook(book);
        const chapterCount = book.chapter_count;// await getChapterCount(book.book_id);
        // Create array [1, 2, ... chapterCount]
        const chaps = Array.from({ length: chapterCount }, (_, i) => i + 1);
        setChapters(chaps);
        setSelectedChapter(null);
    };

    const handleChapterSelect = (chapter: number) => {
        setSelectedChapter(chapter);
    };

    const loadVerses = async (bookId: number, chapter: number) => {
        try {
            setLoading(true);
            const vs = await getVerses(bookId, chapter);
            setVerses(vs);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (selectedChapter) {
            setSelectedChapter(null);
        } else if (selectedBook) {
            setSelectedBook(null);
        }
    };

    if (loading && !books.length) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#d4a373" />
                <Text style={styles.loadingText}>Loading Bible Data...</Text>
            </View>
        );
    }

    // Render Verse View
    if (selectedBook && selectedChapter) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fefae0" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{selectedBook.book_name} {selectedChapter}</Text>
                    <View style={{ width: 24 }} />
                </View>
                <FlatList
                    data={verses}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.verseContainer}>
                            <Text style={styles.verseNumber}>{item.verse}</Text>
                            <Text style={styles.verseText}>{item.text}</Text>
                        </View>
                    )}
                    contentContainerStyle={styles.versesList}
                />
            </SafeAreaView>
        );
    }

    // Render Chapter Selection
    if (selectedBook) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fefae0" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{selectedBook.book_name}</Text>
                    <View style={{ width: 24 }} />
                </View>
                <FlatList
                    data={chapters}
                    keyExtractor={(item) => item.toString()}
                    numColumns={5}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.chapterItem} onPress={() => handleChapterSelect(item)}>
                            <Text style={styles.chapterText}>{item}</Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.chapterList}
                />
            </SafeAreaView>
        );
    }

    // Render Book List
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Bible</Text>
            </View>
            <FlatList
                data={books}
                keyExtractor={(item) => item.book_id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.bookItem} onPress={() => handleBookSelect(item)}>
                        <Text style={styles.bookName}>{item.book_name}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#6c584c" />
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.bookList}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fefae0', // Light cream background
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fefae0',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#6c584c',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#6c584c', // Dark brown
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fefae0',
    },
    backButton: {
        padding: 5,
    },
    bookList: {
        padding: 16,
    },
    bookItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#faedcd',
        backgroundColor: '#fff',
        marginBottom: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        elevation: 1,
    },
    bookName: {
        fontSize: 18,
        color: '#283618',
        fontFamily: 'System', // Use default for now, could use Playfair if available
    },
    chapterList: {
        padding: 16,
    },
    chapterItem: {
        flex: 1,
        margin: 5,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#faedcd',
        borderRadius: 25,
    },
    chapterText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#6c584c',
    },
    versesList: {
        padding: 16,
    },
    verseContainer: {
        marginBottom: 16,
        flexDirection: 'row',
    },
    verseNumber: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#bc6c25',
        marginRight: 8,
        marginTop: 4,
        width: 20,
        textAlign: 'right',
    },
    verseText: {
        fontSize: 18,
        lineHeight: 28,
        color: '#283618',
        flex: 1,
    },
});
