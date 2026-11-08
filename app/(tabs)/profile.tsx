import { StyleSheet, Text, View } from 'react-native';

export default function PlaceholderScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Coming Soon</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
    },
});
