import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';
import { weeklyData, stats } from '../data/data';

const BAR_MAX = Math.max(...weeklyData.map(d => d.calories), 1);

export default function ProgressScreen() {
  const totalWeekCalories = weeklyData.reduce((s, d) => s + d.calories, 0);
  const totalWeekMinutes = weeklyData.reduce((s, d) => s + d.minutes, 0);
  const activeDays = weeklyData.filter(d => d.done).length;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Прогресс</Text>

        {/* Summary cards */}
        <View style={styles.summaryRow}>
          <View style={styles.sumCard}>
            <Text style={[styles.sumVal, { color: COLORS.accent }]}>{activeDays}</Text>
            <Text style={styles.sumLabel}>Дней активности</Text>
          </View>
          <View style={styles.sumCard}>
            <Text style={[styles.sumVal, { color: COLORS.orange }]}>{totalWeekCalories}</Text>
            <Text style={styles.sumLabel}>Ккал за неделю</Text>
          </View>
          <View style={styles.sumCard}>
            <Text style={[styles.sumVal, { color: COLORS.blue }]}>{totalWeekMinutes}</Text>
            <Text style={styles.sumLabel}>Минут</Text>
          </View>
        </View>

        {/* Bar chart */}
        <Text style={styles.sectionTitle}>Калории по дням</Text>
        <View style={styles.chartCard}>
          <View style={styles.chartBars}>
            {weeklyData.map((d, i) => {
              const h = d.calories > 0 ? Math.max((d.calories / BAR_MAX) * 140, 4) : 4;
              const isMax = d.calories === Math.max(...weeklyData.map(x => x.calories));
              return (
                <View key={d.day} style={styles.barCol}>
                  {d.calories > 0 && (
                    <Text style={[styles.barLabel, isMax && { color: COLORS.accent }]}>
                      {d.calories}
                    </Text>
                  )}
                  <View style={[
                    styles.bar,
                    { height: h, backgroundColor: d.done ? (isMax ? COLORS.accent : COLORS.blue) : COLORS.textFaint }
                  ]} />
                  <Text style={[styles.dayText, d.done && { color: COLORS.text }]}>{d.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Minutes per day */}
        <Text style={styles.sectionTitle}>Время тренировок (мин)</Text>
        <View style={styles.chartCard}>
          <View style={styles.chartBars}>
            {weeklyData.map((d) => {
              const maxMin = Math.max(...weeklyData.map(x => x.minutes), 1);
              const h = d.minutes > 0 ? Math.max((d.minutes / maxMin) * 100, 4) : 4;
              return (
                <View key={d.day} style={styles.barCol}>
                  {d.minutes > 0 && <Text style={styles.barLabel}>{d.minutes}</Text>}
                  <View style={[styles.bar, { height: h, backgroundColor: d.done ? COLORS.purple : COLORS.textFaint }]} />
                  <Text style={[styles.dayText, d.done && { color: COLORS.text }]}>{d.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* All-time stats */}
        <Text style={styles.sectionTitle}>Всё время</Text>
        <View style={styles.allTimeGrid}>
          {[
            { label: 'Тренировок', val: stats.totalWorkouts, color: COLORS.accent, icon: '🏋️' },
            { label: 'Калорий', val: `${(stats.totalCalories / 1000).toFixed(1)}к`, color: COLORS.orange, icon: '🔥' },
            { label: 'Часов', val: Math.round(stats.totalMinutes / 60), color: COLORS.blue, icon: '⏱' },
            { label: 'Макс. серия', val: `${stats.bestStreak} д.`, color: COLORS.purple, icon: '⚡' },
          ].map(s => (
            <View key={s.label} style={styles.allTimeCard}>
              <Text style={styles.allTimeIcon}>{s.icon}</Text>
              <Text style={[styles.allTimeVal, { color: s.color }]}>{s.val}</Text>
              <Text style={styles.allTimeLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Streak */}
        <View style={styles.streakCard}>
          <View>
            <Text style={styles.streakTitle}>🔥 Текущая серия</Text>
            <Text style={styles.streakSub}>Продолжай — ты почти у цели!</Text>
          </View>
          <View style={styles.streakVals}>
            <View style={styles.streakItem}>
              <Text style={styles.streakVal}>{stats.currentStreak}</Text>
              <Text style={styles.streakLabel}>Сейчас</Text>
            </View>
            <Text style={styles.streakSlash}>/</Text>
            <View style={styles.streakItem}>
              <Text style={[styles.streakVal, { color: COLORS.textMuted }]}>{stats.bestStreak}</Text>
              <Text style={styles.streakLabel}>Рекорд</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1, paddingHorizontal: SPACING.md },
  title: { color: COLORS.text, fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.black, marginTop: SPACING.md, marginBottom: SPACING.md },
  sectionTitle: { color: COLORS.text, fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, marginBottom: SPACING.sm, marginTop: SPACING.sm },
  summaryRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  sumCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center' },
  sumVal: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.black },
  sumLabel: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, textAlign: 'center', marginTop: 4 },
  chartCard: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md },
  chartBars: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 170, paddingTop: 20 },
  barCol: { alignItems: 'center', flex: 1 },
  bar: { width: 26, borderRadius: 6, marginBottom: 6 },
  barLabel: { color: COLORS.textMuted, fontSize: 9, marginBottom: 4, fontWeight: FONTS.weights.semibold },
  dayText: { color: COLORS.textFaint, fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.medium },
  allTimeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  allTimeCard: {
    flex: 1, minWidth: '45%',
    backgroundColor: COLORS.card, borderRadius: RADIUS.lg,
    padding: SPACING.md, alignItems: 'center',
  },
  allTimeIcon: { fontSize: 28, marginBottom: 6 },
  allTimeVal: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.black },
  allTimeLabel: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 4 },
  streakCard: {
    backgroundColor: '#1E1A00', borderRadius: RADIUS.lg,
    padding: SPACING.md, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: COLORS.accent + '33',
  },
  streakTitle: { color: COLORS.accent, fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold },
  streakSub: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 4 },
  streakVals: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  streakItem: { alignItems: 'center' },
  streakVal: { color: COLORS.accent, fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.black },
  streakLabel: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs },
  streakSlash: { color: COLORS.textFaint, fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.bold },
});
