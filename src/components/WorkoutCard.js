import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';

export default function WorkoutCard({ workout, onPress, compact = false }) {
  const levelColor = {
    'Лёгкий': '#C8FF00',
    'Средний': '#FF8C4D',
    'Тяжёлый': '#FF4D4D',
  }[workout.level] || COLORS.accent;

  if (compact) {
    return (
      <TouchableOpacity onPress={onPress} style={[styles.compactCard, { borderLeftColor: workout.color }]}>
        <Text style={styles.compactIcon}>{workout.icon}</Text>
        <View style={styles.compactInfo}>
          <Text style={styles.compactName}>{workout.name}</Text>
          <Text style={styles.compactMeta}>{workout.duration} мин · {workout.calories} ккал</Text>
        </View>
        <View style={[styles.levelBadge, { backgroundColor: levelColor + '22' }]}>
          <Text style={[styles.levelText, { color: levelColor }]}>{workout.level}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.85}>
      <View style={[styles.iconContainer, { backgroundColor: workout.color + '18' }]}>
        <Text style={styles.icon}>{workout.icon}</Text>
      </View>
      <View style={styles.info}>
        <View style={styles.header}>
          <Text style={styles.category}>{workout.category}</Text>
          <View style={[styles.levelBadge, { backgroundColor: levelColor + '22' }]}>
            <Text style={[styles.levelText, { color: levelColor }]}>{workout.level}</Text>
          </View>
        </View>
        <Text style={styles.name}>{workout.name}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaItem}>⏱ {workout.duration} мин</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaItem}>🔥 {workout.calories} ккал</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaItem}>💪 {workout.exercises.length} упр.</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  icon: { fontSize: 26 },
  info: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  category: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.medium, textTransform: 'uppercase', letterSpacing: 0.8 },
  levelBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.full },
  levelText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold },
  name: { color: COLORS.text, fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaItem: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs },
  metaDot: { color: COLORS.textFaint, marginHorizontal: 6, fontSize: FONTS.sizes.xs },
  // compact
  compactCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    borderLeftWidth: 3,
  },
  compactIcon: { fontSize: 20, marginRight: SPACING.sm },
  compactInfo: { flex: 1 },
  compactName: { color: COLORS.text, fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.semibold },
  compactMeta: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 2 },
});
