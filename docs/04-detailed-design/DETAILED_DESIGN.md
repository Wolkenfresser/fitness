# 🎨 Детальное проектирование — FitPulse

## Дизайн-система

### Цветовая палитра

| Токен | HEX | Назначение |
|---|---|---|
| `bg` | `#0D0D0D` | Фон приложения |
| `card` | `#1A1A1A` | Фон карточек |
| `cardLight` | `#222222` | Вторичный фон |
| `accent` | `#C8FF00` | Основной акцент, прогресс |
| `accentDim` | `#8AB500` | Приглушённый акцент |
| `text` | `#F0F0F0` | Основной текст |
| `textMuted` | `#888888` | Вторичный текст |
| `textFaint` | `#444444` | Разделители, неактивные |
| `danger` | `#FF4D4D` | Уровень «Тяжёлый», ошибки |
| `blue` | `#4D9FFF` | Акцент II (серия, детали) |
| `purple` | `#B44DFF` | Акцент III (йога, достижения) |
| `orange` | `#FF8C4D` | Акцент IV (калории, средний) |

### Типографика

| Размер | px | Назначение |
|---|---|---|
| `xs` | 11 | Метки, бейджи |
| `sm` | 13 | Вторичный текст |
| `md` | 15 | Основной текст |
| `lg` | 18 | Заголовки карточек |
| `xl` | 24 | Подзаголовки экранов |
| `xxl` | 32 | Заголовки экранов |
| `hero` | 48 | Таймер |

### Отступы и скругления

```
SPACING: xs=4  sm=8  md=16  lg=24  xl=32  xxl=48
RADIUS:  sm=8  md=12  lg=16  xl=24  full=999
```

## Проектирование экранов

### HomeScreen
```
SafeAreaView
└── ScrollView
    ├── Header (имя + аватар)
    ├── StreakBanner (🔥 + счётчик)
    ├── WeekRow (7 ячеек дней)
    ├── RingsRow (3 × RingProgress)
    ├── StatsRow (3 × StatCard)
    └── WorkoutCard[] (3 штуки)
```

### WorkoutDetailScreen — Конечный автомат таймера

```
IDLE → [нажать «Начать»] → RUNNING
RUNNING → [нажать «Пауза»] → PAUSED
PAUSED → [нажать «Продолжить»] → RUNNING
RUNNING → [нажать «Следующее» на последнем] → COMPLETED
COMPLETED → (финальный экран, таймер остановлен)
```

### RingProgress — Анимация

```
useEffect(progress) → Animated.timing(animValue, {
  toValue: progress,   // 0.0 – 1.0
  duration: 1200ms,
  useNativeDriver: false
})

strokeDashoffset = animValue.interpolate({
  inputRange: [0, 1],
  outputRange: [circumference, 0]
})
```

## UI компоненты

### WorkoutCard (полный режим)

```
TouchableOpacity [card]
├── View [iconContainer] — цветной фон + эмодзи
└── View [info]
    ├── Row: Text[category] + Badge[level]
    ├── Text [name]
    └── Row: ⏱ duration · 🔥 calories · 💪 exercises
```

### WorkoutCard (compact режим)

```
TouchableOpacity [compactCard] — левая цветная граница
├── Text [icon]
├── View [info]: name + meta
└── Badge [level]
```
