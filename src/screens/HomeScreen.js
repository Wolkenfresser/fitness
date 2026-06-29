import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';
import { weeklyData, stats, workoutPlans } from '../data/data';
import RingProgress from '../components/RingProgress';
import WorkoutCard from '../components/WorkoutCard';

export default function HomeScreen({ navigation }) {
  const today = new Date();
  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const todayIdx = today.getDay();

  const weeklyGoalProgress = stats.weeklyDone / stats.weeklyGoal;
  const caloriesWeek = weeklyData.reduce((s, d) => s + d.calories, 0);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Привет, Алексей 👋</Text>
            <Text style={styles.subGreeting}>Готов к тренировке?</Text>
          </View>
          <TouchableOpacity style={styles.avatarCircle} onPress={() => navigation.navigate('Профиль')}>
            <Text style={styles.avatarText}>АК</Text>
          </TouchableOpacity>
        </View>

        {/* Streak Banner */}
        <View style={styles.streakBanner}>
          <Text style={styles.streakFire}>🔥</Text>
          <View>
            <Text style={styles.streakNum}>{stats.currentStreak} дня подряд</Text>
            <Text style={styles.streakSub}>Серия активности</Text>
          </View>
          <View style={styles.streakRight}>
            <Text style={styles.streakBest}>Рекорд: {stats.bestStreak}</Text>
          </View>
        </View>

        {/* Weekly calendar */}
        <Text style={styles.sectionTitle}>Эта неделя</Text>
        <View style={styles.weekRow}>
          {weeklyData.map((d, i) => {
            const isToday = dayNames[todayIdx] === d.day;
            return (
              <View key={d.day} style={[styles.dayCell, isToday && styles.dayCellToday, d.done && !isToday && styles.dayCellDone]}>
                <Text style={[styles.dayLabel, isToday && styles.dayLabelToday, d.done && !isToday && styles.dayLabelDone]}>{d.day}</Text>
                {d.done ? (
                  <Text style={styles.dayCheck}>✓</Text>
                ) : isToday ? (
                  <View style={styles.dayDot} />
                ) : (
                  <View style={styles.dayEmpty} />
                )}
              </View>
            );
          })}
        </View>

        {/* Progress rings */}
        <Text style={styles.sectionTitle}>Прогресс</Text>
        <View style={styles.ringsRow}>
          <RingProgress
            size={110}
            strokeWidth={10}
            progress={weeklyGoalProgress}
            color={COLORS.accent}
            value={`${stats.weeklyDone}/${stats.weeklyGoal}`}
            subtitle="цель"
            label="Тренировки"
          />
          <RingProgress
            size={110}
            strokeWidth={10}
            progress={Math.min(caloriesWeek / 2000, 1)}
            color={COLORS.orange}
            value={caloriesWeek}
            subtitle="ккал"
            label="Сожжено"
          />
          <RingProgress
            size={110}
            strokeWidth={10}
            progress={Math.min(stats.currentStreak / 14, 1)}
            color={COLORS.blue}
            value={stats.currentStreak}
            subtitle="дней"
            label="Серия"
          />
        </View>

        {/* Quick stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{stats.totalWorkouts}</Text>
            <Text style={styles.statLabel}>Всего тренировок</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{Math.round(stats.totalMinutes / 60)}ч</Text>
            <Text style={styles.statLabel}>В тренажёрке</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statVal, { color: COLORS.orange }]}>{(stats.totalCalories / 1000).toFixed(1)}к</Text>
            <Text style={styles.statLabel}>Ккал всего</Text>
          </View>
        </View>

        {/* Recommended workouts */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Рекомендуем</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Тренировки')}>
            <Text style={styles.seeAll}>Все →</Text>
          </TouchableOpacity>
        </View>
        {workoutPlans.slice(0, 3).map(w => (
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: SPACING.md, marginBottom: SPACING.lg },
  greeting: { color: COLORS.text, fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.black },
  subGreeting: { color: COLORS.textMuted, fontSize: FONTS.sizes.md, marginTop: 2 },
  avatarCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: COLORS.bg, fontWeight: FONTS.weights.black, fontSize: FONTS.sizes.md },
  streakBanner: {
    backgroundColor: '#1E1A00',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.accent + '33',
    marginBottom: SPACING.lg,
  },
  streakFire: { fontSize: 32, marginRight: SPACING.sm },
  streakNum: { color: COLORS.accent, fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.black },
  streakSub: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs },
  streakRight: { flex: 1, alignItems: 'flex-end' },
  streakBest: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm },
  sectionTitle: { color: COLORS.text, fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, marginBottom: SPACING.sm },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.sm },
  seeAll: { color: COLORS.accent, fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.lg },
  dayCell: { alignItems: 'center', paddingVertical: 8, paddingHorizontal: 6, borderRadius: RADIUS.md, width: 42 },
  dayCellToday: { backgroundColor: COLORS.accent },
  dayCellDone: { backgroundColor: COLORS.card },
  dayLabel: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.medium, marginBottom: 4 },
  dayLabelToday: { color: COLORS.bg, fontWeight: FONTS.weights.black },
  dayLabelDone: { color: COLORS.text },
  dayCheck: { color: COLORS.accent, fontSize: 14, fontWeight: FONTS.weights.black },
  dayDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.bg },
  dayEmpty: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.textFaint },
  ringsRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.lg },
  statsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  statCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center' },
  statVal: { color: COLORS.accent, fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.black },
  statLabel: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 4, textAlign: 'center' },
});
