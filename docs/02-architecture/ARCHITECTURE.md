# 🏗️ Архитектура — FitPulse

## Диаграмма архитектуры

![Архитектура](../images/architecture.svg)

## Технологический стек

| Слой | Технология | Версия |
|---|---|---|
| Фреймворк | React Native | 0.74.5 |
| Платформа | Expo | 51.0.0 |
| Навигация | React Navigation | 6.x |
| Графика | react-native-svg | 15.2.0 |
| Иконки | @expo/vector-icons | 14.x |
| Язык | JavaScript (ES2022) | — |

## Паттерн архитектуры

Приложение использует **компонентную архитектуру** с разделением по слоям:

```
┌─────────────────────────────────────┐
│          PRESENTATION LAYER          │  ← Экраны (Screens)
│  Home · Workouts · Progress · Profile│
├──────────┬──────────┬────────────────┤
│NAVIGATION│COMPONENTS│  STATE/LOGIC   │  ← Переиспользуемые блоки
│Stack+Tabs│RingProgress│useState/useEffect│
├──────────┴──────────┴────────────────┤
│           DATA LAYER                  │  ← Данные и тема
│  data/data.js · src/theme.js          │
├─────────────────────────────────────┤
│        EXPO SDK / React Native        │  ← Платформа
└─────────────────────────────────────┘
```

## Навигация

```
NavigationContainer
└── Stack.Navigator
    ├── Main (HomeTabs)  ← Bottom Tab Navigator
    │   ├── Главная      → HomeScreen
    │   ├── Тренировки   → WorkoutsScreen
    │   ├── Прогресс     → ProgressScreen
    │   └── Профиль      → ProfileScreen
    └── WorkoutDetail    → WorkoutDetailScreen (modal push)
```

## Поток данных

```
data/data.js  →  Screen (props/state)  →  Component  →  Render
```

Данные статичны и передаются через импорт. State управляется локально через `useState` (фильтры, таймер, прогресс тренировки).

## Ключевые компоненты

### RingProgress
Анимированное SVG-кольцо прогресса. Принимает `progress` (0–1) и анимирует `strokeDashoffset` через `Animated.timing`.

### WorkoutCard
Переиспользуемая карточка тренировки. Поддерживает режимы `compact` (горизонтальный) и полный.

## Анимации

| Компонент | Тип анимации | API |
|---|---|---|
| RingProgress | Заполнение кольца (1.2s) | `Animated.timing` |
| Таймер (WorkoutDetail) | Пульсация (loop) | `Animated.loop + sequence` |
