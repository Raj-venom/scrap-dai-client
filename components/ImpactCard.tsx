import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';



interface ImpactCardProps {
    energySaved: string;
    waterSaved: string;
    treesSaved: string;
    oreSaved: string;
}

function ImpactCard({ energySaved, waterSaved, treesSaved, oreSaved }: ImpactCardProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Impact on Environment</Text>
            <Text style={styles.subtitle}>You've saved:</Text>
            <View style={styles.statsRow}>
                <View style={styles.stat}>
                    <Ionicons name="flash-outline" size={20} color="#333333" />
                    <Text style={styles.statValue}>{energySaved}</Text>
                </View>
                <View style={styles.stat}>
                    <Ionicons name="water-outline" size={20} color="#333333" />
                    <Text style={styles.statValue}>{waterSaved}</Text>
                </View>
                <View style={styles.stat}>
                    <Ionicons name="leaf-outline" size={20} color="#333333" />
                    <Text style={styles.statValue}>{treesSaved}</Text>
                </View>
                <View style={styles.stat}>
                    <Ionicons name="cube-outline" size={20} color="#333333" />
                    <Text style={styles.statValue}>{oreSaved}</Text>
                </View>
            </View>
        </View>
    );
}

export default ImpactCard;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFF7',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#D9D9D9',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 12,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 14,
        color: '#333333',
        marginTop: 4,
    },
});
