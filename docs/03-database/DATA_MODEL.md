# 🗄️ Модель данных — FitPulse

> Приложение использует статические данные (mock data) в `src/data/data.js`.  
> В продакшн-версии эти структуры можно перенести в SQLite (expo-sqlite) или REST API.

## Схема данных

### `workoutPlans[]` — Тренировки

```js
{
  id: string,           // уникальный идентификатор
  name: string,         // название тренировки
  category: string,     // "Кардио" | "Сила" | "HIIT" | "Растяжка"
  duration: number,     // продолжительность в минутах
  calories: number,     // расход калорий
  level: string,        // "Лёгкий" | "Средний" | "Тяжёлый"
  color: string,        // HEX-цвет карточки
  icon: string,         // эмодзи-иконка
  exercises: Exercise[] // список упражнений
}
```

### `Exercise` — Упражнение

```js
{
  name: string,      // название упражнения
  sets: number,      // количество подходов
  reps?: number,     // повторения (если не на время)
  duration?: number, // длительность в секундах (если на время)
  rest: number,      // отдых в секундах
}
```

### `weeklyData[]` — Данные за неделю

```js
{
  day: string,      // "Пн" | "Вт" | "Ср" | "Чт" | "Пт" | "Сб" | "Вс"
  calories: number, // сожжённые калории (0 = нет тренировки)
  minutes: number,  // минуты тренировки
  done: boolean,    // выполнена ли тренировка
}
```

### `stats` — Общая статистика

```js
{
  totalWorkouts: number,  // всего тренировок
  totalCalories: number,  // всего сожжённых калорий
  totalMinutes: number,   // всего минут тренировок
  currentStreak: number,  // текущая серия (дней)
  bestStreak: number,     // рекордная серия
  weeklyGoal: number,     // цель тренировок в неделю
  weeklyDone: number,     // выполнено за эту неделю
}
```

### `userProfile` — Профиль пользователя

```js
{
  name: string,   // имя
  age: number,    // возраст
  weight: number, // вес в кг
  height: number, // рост в см
  goal: string,   // цель ("Набор мышечной массы" | "Похудение" | ...)
  level: string,  // уровень ("Начинающий" | "Средний" | "Продвинутый")
  avatar: null,   // URL аватара (не используется в MVP)
}
```

## Расчёт ИМТ

```
ИМТ = вес (кг) / (рост (м))²

< 18.5  → Недовес
18.5–25 → Норма
25–30   → Избыточный вес
> 30    → Ожирение
```

## Миграция на персистентное хранилище

```js
// Пример с expo-sqlite
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('fitpulse.db');

db.transaction(tx => {
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS workouts (id TEXT PRIMARY KEY, name TEXT, ...)'
  );
});
```
