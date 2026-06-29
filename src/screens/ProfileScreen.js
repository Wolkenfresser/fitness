import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, Switch,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';
import { userProfile, stats } from '../data/data';

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const bmi = (userProfile.weight / ((userProfile.height / 100) ** 2)).toFixed(1);
  const bmiLabel = bmi < 18.5 ? 'Недовес' : bmi < 25 ? 'Норма' : bmi < 30 ? 'Избыток' : 'Ожирение';
  const bmiColor = bmi < 18.5 ? COLORS.blue : bmi < 25 ? COLORS.accent : COLORS.orange;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Профиль</Text>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>АК</Text>
          </View>
          <Text style={styles.name}>{userProfile.name}</Text>
          <View style={styles.goalBadge}>
            <Text style={styles.goalText}>🎯 {userProfile.goal}</Text>
          </View>
        </View>

        {/* Body stats */}
        <Text style={styles.sectionTitle}>Показатели тела</Text>
        <View style={styles.bodyCard}>
          <View style={styles.bodyRow}>
            <View style={styles.bodyStat}>
              <Text style={styles.bodyVal}>{userProfile.weight}</Text>
              <Text style={styles.bodyLabel}>кг</Text>
            </View>
            <View style={styles.bodyDivider} />
            <View style={styles.bodyStat}>
              <Text style={styles.bodyVal}>{userProfile.height}</Text>
              <Text style={styles.bodyLabel}>см</Text>
            </View>
            <View style={styles.bodyDivider} />
            <View style={styles.bodyStat}>
              <Text style={styles.bodyVal}>{userProfile.age}</Text>
              <Text style={styles.bodyLabel}>лет</Text>
            </View>
            <View style={styles.bodyDivider} />
            <View style={styles.bodyStat}>
              <Text style={[styles.bodyVal, { color: bmiColor }]}>{bmi}</Text>
              <Text style={[styles.bodyLabel, { color: bmiColor }]}>ИМТ</Text>
            </View>
          </View>
          <View style={[styles.bmiBadge, { backgroundColor: bmiColor + '18' }]}>
            <Text style={[styles.bmiText, { color: bmiColor }]}>ИМТ: {bmiLabel}</Text>
          </View>
        </View>

        {/* Achievements */}
        <Text style={styles.sectionTitle}>Достижения</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achieveRow}>
          {[
            { icon: '🏆', label: 'Первая\nтренировка', unlocked: true },
            { icon: '🔥', label: `${stats.bestStreak} дней\nподряд`, unlocked: true },
            { icon: '💪', label: '50 тренировок', unlocked: stats.totalWorkouts >= 50 },
            { icon: '⚡', label: '100к ккал', unlocked: stats.totalCalories >= 100000 },
            { icon: '🌟', label: 'Месяц\nактивности', unlocked: false },
            { icon: '🦾', label: 'Железная воля', unlocked: false },
          ].map((a, i) => (
            <View key={i} style={[styles.achieveCard, !a.unlocked && styles.achieveCardLocked]}>
              <Text style={[styles.achieveIcon, !a.unlocked && { opacity: 0.3 }]}>{a.icon}</Text>
              <Text style={[styles.achieveLabel, !a.unlocked && { color: COLORS.textFaint }]}>{a.label}</Text>
              {!a.unlocked && <Text style={styles.achieveLock}>🔒</Text>}
            </View>
          ))}
        </ScrollView>

        {/* Settings */}
        <Text style={styles.sectionTitle}>Настройки</Text>
        <View style={styles.settingsCard}>
          {[
            { label: 'Уведомления', val: notifications, set: setNotifications, icon: '🔔' },
            { label: 'Звуки', val: sound, set: setSound, icon: '🔊' },
            { label: 'Тёмная тема', val: darkMode, set: setDarkMode, icon: '🌙' },
          ].map((s, i) => (
            <View key={s.label} style={[styles.settingRow, i > 0 && styles.settingBorder]}>
              <Text style={styles.settingIcon}>{s.icon}</Text>
              <Text style={styles.settingLabel}>{s.label}</Text>
              <Switch
                value={s.val}
                onValueChange={s.set}
                trackColor={{ false: COLORS.textFaint, true: COLORS.accent }}
                thumbColor={s.val ? COLORS.bg : COLORS.textMuted}
              />
            </View>
          ))}
        </View>

        {/* Level */}
        <View style={styles.levelCard}>
          <Text style={styles.levelTitle}>Уровень подготовки</Text>
          <View style={styles.levelRow}>
            {['Начинающий', 'Средний', 'Продвинутый'].map(l => (
              <TouchableOpacity
                key={l}
                style={[styles.levelBtn, userProfile.level === l && styles.levelBtnActive]}
              >
                <Text style={[styles.levelBtnText, userProfile.level === l && styles.levelBtnTextActive]}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1, paddingHorizontal: SPACING.md },
  title: { color: COLORS.text, fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.black, marginTop: SPACING.md, marginBottom: SPACING.md },
  avatarSection: { alignItems: 'center', marginBottom: SPACING.lg },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  avatarText: { color: COLORS.bg, fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.black },
  name: { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.black },
  goalBadge: { marginTop: 6, backgroundColor: COLORS.card, paddingHorizontal: 14, paddingVertical: 6, borderRadius: RADIUS.full },
  goalText: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm },
  sectionTitle: { color: COLORS.text, fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, marginBottom: SPACING.sm },
  bodyCard: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.lg },
  bodyRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: SPACING.sm },
  bodyStat: { alignItems: 'center' },
  bodyVal: { color: COLORS.text, fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.black },
  bodyLabel: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 2 },
  bodyDivider: { width: 1, height: 40, backgroundColor: COLORS.cardLight },
  bmiBadge: { borderRadius: RADIUS.full, paddingVertical: 6, alignItems: 'center' },
  bmiText: { fontWeight: FONTS.weights.bold, fontSize: FONTS.sizes.sm },
  achieveRow: { marginBottom: SPACING.lg },
  achieveCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.lg,
    width: 90, padding: SPACING.sm, alignItems: 'center',
    marginRight: SPACING.sm,
  },
  achieveCardLocked: { opacity: 0.6 },
  achieveIcon: { fontSize: 30, marginBottom: 4 },
  achieveLabel: { color: COLORS.textMuted, fontSize: 10, textAlign: 'center', lineHeight: 14 },
  achieveLock: { fontSize: 12, marginTop: 4 },
  settingsCard: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, marginBottom: SPACING.md, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, paddingHorizontal: SPACING.md },
  settingBorder: { borderTopWidth: 1, borderTopColor: COLORS.cardLight },
  settingIcon: { fontSize: 20, marginRight: SPACING.sm },
  settingLabel: { color: COLORS.text, fontSize: FONTS.sizes.md, flex: 1 },
  levelCard: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md },
  levelTitle: { color: COLORS.text, fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.semibold, marginBottom: SPACING.sm },
  levelRow: { flexDirection: 'row', gap: SPACING.sm },
  levelBtn: { flex: 1, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.cardLight, alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  levelBtnActive: { backgroundColor: COLORS.accent + '18', borderColor: COLORS.accent },
  levelBtnText: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.medium },
  levelBtnTextActive: { color: COLORS.accent, fontWeight: FONTS.weights.bold },
});
