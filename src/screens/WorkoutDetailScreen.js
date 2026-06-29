import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, Animated,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';

export default function WorkoutDetailScreen({ route, navigation }) {
  const { workout } = route.params;
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const timerRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      clearInterval(timerRef.current);
      pulseAnim.stopAnimation();
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (isCompleted) return;
    setIsRunning(r => !r);
  };

  const handleNext = () => {
    if (currentExercise < workout.exercises.length - 1) {
      setCurrentExercise(e => e + 1);
    } else {
      setIsRunning(false);
      setIsCompleted(true);
    }
  };

  const exercise = workout.exercises[currentExercise];
  const progressPercent = isRunning || isCompleted
    ? ((currentExercise + (isCompleted ? 1 : 0)) / workout.exercises.length) * 100
    : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Back button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Назад</Text>
        </TouchableOpacity>

        {/* Hero */}
        <View style={[styles.hero, { borderColor: workout.color + '44' }]}>
          <Text style={styles.heroIcon}>{workout.icon}</Text>
          <Text style={styles.heroTitle}>{workout.name}</Text>
          <Text style={styles.heroCategory}>{workout.category} · {workout.level}</Text>
          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatVal}>{workout.duration}</Text>
              <Text style={styles.heroStatLabel}>минут</Text>
            </View>
            <View style={[styles.heroStatDivider, { backgroundColor: workout.color + '33' }]} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatVal}>{workout.calories}</Text>
              <Text style={styles.heroStatLabel}>ккал</Text>
            </View>
            <View style={[styles.heroStatDivider, { backgroundColor: workout.color + '33' }]} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatVal}>{workout.exercises.length}</Text>
              <Text style={styles.heroStatLabel}>упражнений</Text>
            </View>
          </View>
        </View>

        {/* Timer */}
        {(isRunning || isCompleted || seconds > 0) && (
          <View style={styles.timerContainer}>
            <Animated.View style={[styles.timerCircle, { borderColor: workout.color, transform: [{ scale: pulseAnim }] }]}>
              <Text style={[styles.timerText, { color: workout.color }]}>{formatTime(seconds)}</Text>
              <Text style={styles.timerLabel}>{isCompleted ? 'Готово! 🎉' : 'Идёт тренировка'}</Text>
            </Animated.View>

            {/* Progress bar */}
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressPercent}%`, backgroundColor: workout.color }]} />
            </View>
            <Text style={styles.progressText}>
              {isCompleted ? 'Все упражнения выполнены!' : `Упражнение ${currentExercise + 1} из ${workout.exercises.length}`}
            </Text>
          </View>
        )}

        {/* Active exercise */}
        {isRunning && !isCompleted && (
          <View style={[styles.activeExercise, { borderColor: workout.color }]}>
            <Text style={styles.activeLabel}>СЕЙЧАС</Text>
            <Text style={styles.activeName}>{exercise.name}</Text>
            <View style={styles.activeMeta}>
              {exercise.sets && <Text style={styles.activeMetaItem}>{exercise.sets} подхода</Text>}
              {exercise.reps && <Text style={styles.activeMetaItem}>× {exercise.reps} повторений</Text>}
              {exercise.duration && <Text style={styles.activeMetaItem}>{exercise.duration} сек</Text>}
              <Text style={styles.activeMetaItem}>Отдых: {exercise.rest} сек</Text>
            </View>
            <TouchableOpacity onPress={handleNext} style={[styles.nextBtn, { backgroundColor: workout.color }]}>
              <Text style={[styles.nextBtnText, { color: COLORS.bg }]}>
                {currentExercise < workout.exercises.length - 1 ? 'Следующее →' : 'Завершить ✓'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Exercise list */}
        <Text style={styles.listTitle}>Упражнения</Text>
        {workout.exercises.map((ex, i) => {
          const isDone = isCompleted || (isRunning && i < currentExercise);
          const isCurrent = isRunning && i === currentExercise;
          return (
            <View key={i} style={[styles.exRow, isCurrent && { borderColor: workout.color, borderWidth: 1 }]}>
              <View style={[styles.exNum, isDone && { backgroundColor: workout.color }]}>
                <Text style={[styles.exNumText, isDone && { color: COLORS.bg }]}>
                  {isDone ? '✓' : i + 1}
                </Text>
              </View>
              <View style={styles.exInfo}>
                <Text style={[styles.exName, isDone && { color: COLORS.textMuted }]}>{ex.name}</Text>
                <Text style={styles.exMeta}>
                  {ex.sets} подх.
                  {ex.reps ? ` × ${ex.reps} повт.` : ''}
                  {ex.duration ? ` × ${ex.duration} сек` : ''}
                  {' · '}отдых {ex.rest} сек
                </Text>
              </View>
              {isCurrent && (
                <View style={[styles.currentBadge, { backgroundColor: workout.color }]}>
                  <Text style={[styles.currentBadgeText, { color: COLORS.bg }]}>СЕЙЧАС</Text>
                </View>
              )}
            </View>
          );
        })}

        {/* Start / Pause button */}
        {!isCompleted && (
          <TouchableOpacity
            onPress={handleStart}
            style={[styles.startBtn, { backgroundColor: isRunning ? COLORS.card : workout.color }]}
          >
            <Text style={[styles.startBtnText, { color: isRunning ? workout.color : COLORS.bg }]}>
              {isRunning ? '⏸  Пауза' : seconds > 0 ? '▶  Продолжить' : '▶  Начать тренировку'}
            </Text>
          </TouchableOpacity>
        )}

        {isCompleted && (
          <View style={styles.completedCard}>
            <Text style={styles.completedEmoji}>🏆</Text>
            <Text style={styles.completedTitle}>Отличная работа!</Text>
            <Text style={styles.completedSub}>Тренировка завершена за {formatTime(seconds)}</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.nextBtn, { backgroundColor: workout.color, marginTop: SPACING.md }]}>
              <Text style={[styles.nextBtnText, { color: COLORS.bg }]}>На главную</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  backBtn: { marginTop: SPACING.md, marginLeft: SPACING.md, marginBottom: SPACING.sm },
  backText: { color: COLORS.accent, fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.semibold },
  hero: {
    margin: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
  },
  heroIcon: { fontSize: 52, marginBottom: SPACING.sm },
  heroTitle: { color: COLORS.text, fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.black, textAlign: 'center' },
  heroCategory: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm, marginTop: 4, marginBottom: SPACING.md },
  heroStats: { flexDirection: 'row', alignItems: 'center' },
  heroStat: { alignItems: 'center', paddingHorizontal: SPACING.md },
  heroStatVal: { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.black },
  heroStatLabel: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs },
  heroStatDivider: { width: 1, height: 32 },
  timerContainer: { marginHorizontal: SPACING.md, alignItems: 'center', marginBottom: SPACING.md },
  timerCircle: {
    width: 160, height: 160, borderRadius: 80,
    borderWidth: 3,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.card,
    marginBottom: SPACING.md,
  },
  timerText: { fontSize: FONTS.sizes.hero, fontWeight: FONTS.weights.black },
  timerLabel: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 4 },
  progressTrack: { width: '100%', height: 4, backgroundColor: COLORS.cardLight, borderRadius: 2, marginBottom: 8 },
  progressFill: { height: 4, borderRadius: 2 },
  progressText: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm },
  activeExercise: {
    margin: SPACING.md, backgroundColor: COLORS.card, borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1,
  },
  activeLabel: { color: COLORS.accent, fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.black, letterSpacing: 1.5, marginBottom: 4 },
  activeName: { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.black, marginBottom: SPACING.sm },
  activeMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: SPACING.md },
  activeMetaItem: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm, backgroundColor: COLORS.cardLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  nextBtn: { borderRadius: RADIUS.full, paddingVertical: 12, alignItems: 'center' },
  nextBtnText: { fontWeight: FONTS.weights.black, fontSize: FONTS.sizes.md },
  listTitle: { color: COLORS.text, fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, marginHorizontal: SPACING.md, marginBottom: SPACING.sm },
  exRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: SPACING.md, marginBottom: SPACING.sm,
    backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md,
    borderWidth: 0, borderRadius: RADIUS.md,
  },
  exNum: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.cardLight, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.sm },
  exNumText: { color: COLORS.textMuted, fontWeight: FONTS.weights.bold, fontSize: FONTS.sizes.sm },
  exInfo: { flex: 1 },
  exName: { color: COLORS.text, fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.semibold },
  exMeta: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 2 },
  currentBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  currentBadgeText: { fontSize: 10, fontWeight: FONTS.weights.black, letterSpacing: 0.5 },
  startBtn: {
    margin: SPACING.md, borderRadius: RADIUS.full,
    paddingVertical: 18, alignItems: 'center', marginTop: SPACING.md,
  },
  startBtnText: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.black },
  completedCard: { margin: SPACING.md, backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: SPACING.xl, alignItems: 'center' },
  completedEmoji: { fontSize: 56, marginBottom: SPACING.sm },
  completedTitle: { color: COLORS.text, fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.black },
  completedSub: { color: COLORS.textMuted, fontSize: FONTS.sizes.md, marginTop: 8 },
});
