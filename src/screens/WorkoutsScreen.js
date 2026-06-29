import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';
import { workoutPlans } from '../data/data';
import WorkoutCard from '../components/WorkoutCard';

const CATEGORIES = ['Все', 'Кардио', 'Сила', 'HIIT', 'Растяжка'];
const LEVELS = ['Все', 'Лёгкий', 'Средний', 'Тяжёлый'];

export default function WorkoutsScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState('Все');
  const [activeLevel, setActiveLevel] = useState('Все');

  const filtered = workoutPlans.filter(w => {
    const catOk = activeCategory === 'Все' || w.category === activeCategory;
    const lvlOk = activeLevel === 'Все' || w.level === activeLevel;
    return catOk && lvlOk;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Тренировки</Text>

        {/* Category filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {CATEGORIES.map(c => (
            <TouchableOpacity
              key={c}
              onPress={() => setActiveCategory(c)}
              style={[styles.filterChip, activeCategory === c && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, activeCategory === c && styles.filterTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Level filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.filterRow, { marginTop: 4 }]}>
          {LEVELS.map(l => {
            const levelColor = { 'Лёгкий': COLORS.accent, 'Средний': COLORS.orange, 'Тяжёлый': COLORS.danger }[l];
            return (
              <TouchableOpacity
                key={l}
                onPress={() => setActiveLevel(l)}
                style={[styles.filterChip, activeLevel === l && { backgroundColor: (levelColor || COLORS.accent) + '22', borderColor: levelColor || COLORS.accent }]}
              >
                <Text style={[styles.filterText, activeLevel === l && { color: levelColor || COLORS.accent }]}>{l}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.count}>{filtered.length} тренировок</Text>

        {filtered.map(w => (
          <WorkoutCard
            key={w.id}
            workout={w}
            onPress={() => navigation.navigate('WorkoutDetail', { workout: w })}
          />
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1, paddingHorizontal: SPACING.md },
  title: { color: COLORS.text, fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.black, marginTop: SPACING.md, marginBottom: SPACING.md },
  filterRow: { flexDirection: 'row', marginBottom: SPACING.sm },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.textFaint,
    marginRight: SPACING.sm,
    backgroundColor: 'transparent',
  },
  filterChipActive: { backgroundColor: COLORS.accent + '18', borderColor: COLORS.accent },
  filterText: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.medium },
  filterTextActive: { color: COLORS.accent, fontWeight: FONTS.weights.bold },
  count: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm, marginBottom: SPACING.md },
});
