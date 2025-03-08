import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatsCardProps {
  title: string;
  value: string;
  mini?: boolean;
}

export default function StatsCard({ title, value, mini }: StatsCardProps) {
  if (mini) {
    return (
      <View style={styles.miniContainer}>
        <Text style={styles.miniValue}>{value}</Text>
        <Text style={styles.miniTitle}>{title}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
  },
  title: {
    color: '#fff',
    marginBottom: 8,
  },
  value: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  miniContainer: {
    alignItems: 'center',
  },
  miniValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  miniTitle: {
    color: '#666',
    fontSize: 12,
  },
});