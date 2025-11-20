# Recoil Performance Optimization Guide

Этот форк Recoil включает оптимизации для предотвращения ненужных ререндеров при обновлении атомов идентичными данными.

## 🚀 Встроенные оптимизации

### 1. Глубокое сравнение значений (fast-deep-equal)

Все обновления атомов и селекторов теперь проверяются на глубокое равенство:

```javascript
// Если данные идентичны по содержанию, обновление отменяется
set(myAtom, { name: 'John', age: 30 }); // Новый объект
set(myAtom, { name: 'John', age: 30 }); // Идентичный объект → НЕ обновится!
```

**Работает для:**
- ✅ `useSetRecoilState`
- ✅ `useRecoilState`
- ✅ `useRecoilState_TRANSITION_SUPPORT_UNSTABLE`
- ✅ `useRecoilCallback` + `set()`
- ✅ `useRecoilTransaction_UNSTABLE`
- ✅ `selector` и `selectorFamily`

### 2. Поддержка React Concurrent Features

Включен флаг `recoil_transition_support` для поддержки:
- ✅ `startTransition` (React 19+)
- ✅ `useDeferredValue`
- ✅ `useTransition`
- ✅ Прерываемый рендеринг

### 3. Новая функция: `transactDeferred_UNSTABLE`

Автоматически оборачивает обновления в `startTransition` и опционально ждет завершения анимаций (React Native).

## 📖 Использование

### Базовое использование (для Expo SDK 54+ / React Native с новой архитектурой)

```javascript
import { useRecoilCallback } from 'recoil';

const hydrateFromAPI = useRecoilCallback(
  ({ transactDeferred_UNSTABLE }) => async () => {
    // Загружаем данные
    const apiData = await Promise.all([
      fetchTransactions(),
      fetchUserData(),
      fetchCards(),
      // ... остальные запросы
    ]);
    
    // Обновляем с низким приоритетом + ждем завершения анимаций
    transactDeferred_UNSTABLE(
      ({ set }) => {
        set(transactionsAtom, apiData[0]);
        set(userDataAtom, apiData[1]);
        set(cardsAtom, apiData[2]);
        // ...
      },
      { waitForInteractions: true } // Опционально: для React Native
    );
  },
  []
);
```

### Приоритизация обновлений

```javascript
const smartHydrate = useRecoilCallback(
  ({ transact_UNSTABLE, transactDeferred_UNSTABLE }) => async () => {
    // 1. Критичные данные (высокий приоритет)
    const criticalData = await fetchCriticalData();
    
    transact_UNSTABLE(({ set }) => {
      set(userAtom, criticalData.user);
      set(settingsAtom, criticalData.settings);
    });
    
    // 2. Некритичные данные (низкий приоритет)
    const secondaryData = await fetchSecondaryData();
    
    transactDeferred_UNSTABLE(
      ({ set }) => {
        set(transactionsAtom, secondaryData.transactions);
        set(historyAtom, secondaryData.history);
        // ...
      },
      { waitForInteractions: true }
    );
  },
  []
);
```

### Индикатор загрузки

```javascript
import { useTransition } from 'react';

function App() {
  const [isPending, startTransition] = useTransition();
  const hydrate = useHydrateFromAPI();
  
  useEffect(() => {
    hydrate();
  }, []);
  
  return (
    <>
      {isPending && <LoadingIndicator />}
      <YourApp />
    </>
  );
}
```

### Оптимизация тяжелых списков

```javascript
import { useDeferredValue } from 'react';

function TransactionsList() {
  const transactions = useRecoilValue(transactionsAtom);
  const deferredTransactions = useDeferredValue(transactions);
  
  return (
    <FlatList
      data={deferredTransactions}
      renderItem={({ item }) => <TransactionItem item={item} />}
    />
  );
}
```

## 🎯 Рекомендации для React Native

### Для приложений с гидрацией данных:

```javascript
const useOptimizedHydration = () => {
  return useRecoilCallback(
    ({ transactDeferred_UNSTABLE }) => async () => {
      try {
        // Загружаем все данные параллельно
        const [
          transactions,
          userData,
          cards,
          // ... остальные
        ] = await Promise.all([
          fetchTransactions(),
          fetchUserData(),
          fetchCards(),
          // ...
        ]);
        
        // Обновляем все атомы одновременно
        // с низким приоритетом + ждем анимаций
        transactDeferred_UNSTABLE(
          ({ set }) => {
            set(transactionsAtom, transactions);
            set(userDataAtom, userData);
            set(cardsAtom, cards);
            // ...
          },
          { waitForInteractions: true }
        );
      } catch (error) {
        console.error('Hydration error:', error);
      }
    },
    []
  );
};
```

## 🔧 Технические детали

### Как работает `transactDeferred_UNSTABLE`:

1. Если `waitForInteractions: true` и это React Native:
   - Ждет завершения нативных анимаций через `InteractionManager`
2. Если доступен `React.startTransition`:
   - Оборачивает обновление в `startTransition` (низкий приоритет)
3. Выполняет атомарное обновление через `transact_UNSTABLE`
4. Проверяет каждое значение через `fast-deep-equal`
5. Пропускает идентичные значения

### Производительность:

- ✅ Никаких фризов UI
- ✅ Плавные анимации
- ✅ Мгновенный отклик на пользовательский ввод
- ✅ Минимальные ререндеры

## 📊 Сравнение методов

| Метод | Приоритет | Ждет анимации | Батчинг | Использование |
|-------|-----------|---------------|---------|---------------|
| `set()` | Высокий | Нет | Да | Одиночные обновления |
| `transact_UNSTABLE()` | Высокий | Нет | Да | Множественные обновления |
| `transactDeferred_UNSTABLE()` | Низкий | Опционально | Да | Фоновая синхронизация |

## ⚠️ Важные замечания

1. `transactDeferred_UNSTABLE` требует React 19+ для `startTransition`
2. `waitForInteractions` работает только в React Native
3. Для веб-приложений `waitForInteractions` игнорируется
4. Все оптимизации работают автоматически с `fast-deep-equal`

## 🐛 Совместимость с React 19

Этот форк включает патч для совместимости с React 19, который изменил внутреннюю структуру `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED`.

## 📝 Changelog

- ✅ Добавлено глубокое сравнение через `fast-deep-equal`
- ✅ Включен `recoil_transition_support` по умолчанию
- ✅ Добавлена функция `transactDeferred_UNSTABLE`
- ✅ Патч для React 19 совместимости

