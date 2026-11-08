import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function BibleScreen() {
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={theme === 'dark'
                    ? ['#1a2a6c', '#b21f1f', '#fdbb2d']
                    : ['#ffffff', '#e0eafc', '#cfdef3']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={[styles.headerTitle, theme === 'light' && { color: '#000' }]}>BIBLE</Text>
                        <Text style={[styles.headerSubtitle, theme === 'light' && { color: 'rgba(0,0,0,0.6)' }]}>BOOKS</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 15 }}>
                        <TouchableOpacity onPress={toggleTheme}>
                            <Ionicons name={theme === 'dark' ? "sunny-outline" : "moon-outline"} size={24} color={theme === 'dark' ? "white" : "black"} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="notifications-outline" size={24} color={theme === 'dark' ? "white" : "black"} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Main Title Section */}
                    <View style={styles.titleSection}>
                        <Text style={[styles.bookTitle, { color: theme === 'dark' ? 'white' : '#1a1a1a' }]}>THE ACTS</Text>
                        <Text style={[styles.bookTitle, { color: theme === 'dark' ? 'white' : '#1a1a1a' }]}>OF THE</Text>
                        <Text style={[styles.bookTitle, { color: theme === 'dark' ? 'white' : '#1a1a1a' }]}>APOSTLES</Text>

                        <TouchableOpacity style={[styles.chapterPill, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)' }]}>
                            <Text style={[styles.chapterText, { color: theme === 'dark' ? 'white' : '#000' }]}>Chapter 29</Text>
                            <Ionicons name="chevron-down" size={16} color={theme === 'dark' ? 'white' : '#000'} />
                        </TouchableOpacity>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/bible')}>
                            <Ionicons name="book-outline" size={20} color={theme === 'dark' ? 'white' : '#000'} />
                            <Text style={[styles.actionButtonText, { color: theme === 'dark' ? 'white' : '#000' }]}>READ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="play-circle-outline" size={20} color={theme === 'dark' ? 'white' : '#000'} />
                            <Text style={[styles.actionButtonText, { color: theme === 'dark' ? 'white' : '#000' }]}>LISTEN</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Tabs / Recent Section */}
                    <View style={styles.recentSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }]}>TABS</Text>
                            <TouchableOpacity style={styles.newButton}>
                                <Text style={[styles.newButtonText, { color: theme === 'dark' ? 'white' : '#000' }]}>New</Text>
                                <Ionicons name="add-circle-outline" size={16} color={theme === 'dark' ? 'white' : '#000'} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScroll}>
                            <BlurView intensity={30} tint={theme} style={[styles.card, { backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)' }]}>
                                <Text style={[styles.cardTitle, { color: theme === 'dark' ? 'white' : '#000' }]}>A Living Sacrifice</Text>
                                <Text style={[styles.cardPreview, { color: theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)' }]} numberOfLines={4}>
                                    Therefore, I urge you, brothers and sisters, in view of God's mercy, to offer your bodies as a living sacrifice, holy and pleasing to God.
                                </Text>
                                <Text style={[styles.cardFooter, { color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }]}>Romans 12 NIV</Text>
                            </BlurView>

                            <BlurView intensity={30} tint={theme} style={[styles.card, { backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)' }]}>
                                <Text style={[styles.cardTitle, { color: theme === 'dark' ? 'white' : '#000' }]}>Athaliah Reigns in Judah</Text>
                                <Text style={[styles.cardPreview, { color: theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)' }]} numberOfLines={4}>
                                    When Athaliah the mother of Ahaziah saw that her son was dead, she proceeded to destroy the whole royal family.
                                </Text>
                                <Text style={[styles.cardFooter, { color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }]}>2 Kings 11 NIV</Text>
                            </BlurView>
                        </ScrollView>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    headerLeft: {
        flexDirection: 'row',
        gap: 20,
    },
    headerTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 1,
    },
    headerSubtitle: {
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '600',
        fontSize: 14,
        letterSpacing: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    titleSection: {
        marginTop: 60,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    bookTitle: {
        fontFamily: 'PlayfairDisplay_700Bold', // Make sure this matches the loaded font name
        fontSize: 42,
        color: 'white',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    chapterPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginTop: 20,
        gap: 5,
    },
    chapterText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 40,
        marginTop: 60,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    recentSection: {
        marginTop: 60,
        paddingLeft: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 20,
        marginBottom: 15,
        alignItems: 'center',
    },
    sectionTitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    newButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    newButtonText: {
        color: 'white',
        fontSize: 12,
    },
    cardsScroll: {
        paddingBottom: 20,
    },
    card: {
        width: width * 0.45,
        height: 180,
        borderRadius: 15,
        padding: 15,
        marginRight: 15,
        overflow: 'hidden',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.3)', // Fallback
    },
    cardTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    cardPreview: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        lineHeight: 18,
    },
    cardFooter: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 10,
        marginTop: 10,
    },
});
