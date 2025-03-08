import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MenuButtonProps {
  title: string;
  subtitle: string;
  onPress: () => void;
}

export default function MenuButton({ title, subtitle, onPress }: MenuButtonProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View className='flex-row items-center justify-between'>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#666"  />
      </View>
    </TouchableOpacity>
  );
}

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
    marginBottom: 4,
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
  },
  icon: {
    // position: 'absolute',
    // right: 16,
    // top: '50%',
    // marginTop: -12,
  },
});
