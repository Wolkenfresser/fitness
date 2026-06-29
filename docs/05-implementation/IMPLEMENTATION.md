# ⚙️ Руководство по реализации — FitPulse

## Структура проекта

```
FitPulse/
├── App.js                          # Точка входа, навигация
├── app.json                        # Конфигурация Expo
├── babel.config.js                 # Babel (preset-expo)
├── package.json                    # Зависимости
├── docs/                           # Документация
│   ├── 00-project-charter/
│   ├── 01-requirements/
│   ├── 02-architecture/
│   ├── 03-database/
│   ├── 04-detailed-design/
│   ├── 05-implementation/
│   ├── 08-ui/
│   ├── 12-project-management/
│   └── images/
└── src/
    ├── theme.js                    # Дизайн-токены
    ├── data/
    │   └── data.js                 # Mock данные
    ├── components/
    │   ├── RingProgress.js         # SVG кольцо прогресса
    │   └── WorkoutCard.js          # Карточка тренировки
    └── screens/
        ├── HomeScreen.js           # Главный дашборд
        ├── WorkoutsScreen.js       # Каталог тренировок
        ├── WorkoutDetailScreen.js  # Детали + таймер
        ├── ProgressScreen.js       # Статистика
        └── ProfileScreen.js        # Профиль
```

## Установка и запуск

### Требования
- Node.js 18+
- npm 9+
- Смартфон с приложением **Expo Go**

### Быстрый старт

```bash
# 1. Перейти в папку
cd FitPulse

# 2. Установить зависимости
npm install

# 3. Запустить Expo
npx expo start

# 4. Отсканировать QR-код телефоном через Expo Go
```

### Сборка APK (Android)

```bash
# Через EAS Build (облако, бесплатно)
npm install -g eas-cli
eas login
eas build --platform android --profile preview
# Скачайте APK по ссылке из вывода
```

### Локальная сборка (нужен Android Studio)

```bash
npx expo run:android
```

## Ключевые реализации

### Таймер тренировки

```js
const [seconds, setSeconds] = useState(0);
const [isRunning, setIsRunning] = useState(false);
const timerRef = useRef(null);

useEffect(() => {
  if (isRunning) {
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
  } else {
    clearInterval(timerRef.current);
  }
  return () => clearInterval(timerRef.current);
}, [isRunning]);
```

### Анимация пульса (таймер)

```js
const pulseAnim = useRef(new Animated.Value(1)).current;

Animated.loop(
  Animated.sequence([
    Animated.timing(pulseAnim, { toValue: 1.08, duration: 800, useNativeDriver: true }),
    Animated.timing(pulseAnim, { toValue: 1,    duration: 800, useNativeDriver: true }),
  ])
).start();

// В JSX:
<Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
```

### Анимированное кольцо

```js
const strokeDashoffset = animValue.interpolate({
  inputRange: [0, 1],
  outputRange: [circumference, 0],
});

<AnimatedCircle
  strokeDasharray={circumference}
  strokeDashoffset={strokeDashoffset}
  strokeLinecap="round"
  rotation="-90"
  origin={`${size/2}, ${size/2}`}
/>
```

## Зависимости

```json
"dependencies": {
  "expo": "~51.0.0",
  "react": "18.2.0",
  "react-native": "0.74.5",
  "@react-navigation/native": "^6.1.17",
  "@react-navigation/bottom-tabs": "^6.5.20",
  "react-native-screens": "~3.31.1",
  "react-native-safe-area-context": "4.10.5",
  "react-native-svg": "15.2.0",
  "expo-linear-gradient": "~13.0.2",
  "@expo/vector-icons": "^14.0.2"
}
```
