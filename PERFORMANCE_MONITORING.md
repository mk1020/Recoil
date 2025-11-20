# 📊 Руководство по мониторингу производительности Recoil

## 🎯 Обзор

Этот форк Recoil включает встроенную систему мониторинга, которая отслеживает:
- ✅ Сколько обновлений атомов было предотвращено
- ✅ Сколько пересчетов селекторов было предотвращено
- ✅ Сколько обновлений в транзакциях было предотвращено

**Важно:** Логирование и статистика работают **только в режиме разработки** (`__DEV__`).

---

## 🚀 Быстрый старт

### Шаг 1: Проверьте конфигурацию Recoil

Добавьте в **самое начало** вашего `App.tsx` или `index.js`:

```javascript
// App.tsx
import { RecoilEnv } from 'recoil';

// Проверяем, что форк работает
if (__DEV__) {
  console.log('🔍 Recoil GKs:', Array.from(RecoilEnv.RECOIL_GKS_ENABLED));
  
  // Должны увидеть 'recoil_transition_support' в списке
  if (RecoilEnv.RECOIL_GKS_ENABLED.has('recoil_transition_support')) {
    console.log('✅ Оптимизированный форк Recoil загружен!');
  } else {
    console.warn('⚠️ Используется стандартный Recoil (не форк)');
  }
}

import React from 'react';
import { RecoilRoot } from 'recoil';
// ... остальные импорты
```

---

### Шаг 2: Включите логирование (опционально)

```javascript
import { RecoilPerformanceStats } from 'recoil';

if (__DEV__) {
  // Включаем детальное логирование каждого предотвращенного обновления
  RecoilPerformanceStats.enableLogging(true);
  
  console.log('📝 Recoil performance logging enabled');
}
```

**С включенным логированием вы увидите:**
```
[Recoil] ⏭️  Atom update prevented: transactionsAtom (value unchanged)
[Recoil] ⏭️  Atom update prevented: userDataAtom (value unchanged)
[Recoil] ⏭️  Selector recalculation prevented: getCardTransactionsById__selectorFamily/... (result unchanged)
```

---

### Шаг 3: Соберите статистику после гидрации

```javascript
import { RecoilPerformanceStats } from 'recoil';

const useHydrateWithStats = () => {
  return useRecoilCallback(
    ({ transactDeferred_UNSTABLE }) => async () => {
      // Сбрасываем статистику перед гидрацией
      if (__DEV__) {
        RecoilPerformanceStats.resetStats();
      }
      
      // Загружаем данные
      const apiData = await Promise.all([
        fetchTransactions(),
        fetchUserData(),
        fetchCards(),
        // ... остальные 7 запросов
      ]);
      
      // Обновляем атомы
      transactDeferred_UNSTABLE(
        ({ set }) => {
          set(transactionsAtom, apiData[0]);
          set(userDataAtom, apiData[1]);
          set(cardsAtom, apiData[2]);
          // ... остальные 7 атомов
        },
        { waitForInteractions: true }
      );
      
      // Показываем статистику после обновления
      if (__DEV__) {
        // Даем время на завершение обновлений
        setTimeout(() => {
          RecoilPerformanceStats.printStats();
        }, 1000);
      }
    },
    []
  );
};
```

**Вывод в консоль:**
```
========================================
📊 RECOIL PERFORMANCE STATISTICS
========================================

🔹 Atoms:
   Attempted: 10
   Prevented: 9 (90.0%)

🔹 Selectors:
   Attempted: 25
   Prevented: 22 (88.0%)

🔹 Transactions:
   Attempted: 10
   Prevented: 9 (90.0%)

🎯 Total prevented: 40
========================================
```

---

## 🎮 Интерактивный мониторинг

### Вариант 1: Периодический отчет

```javascript
import { RecoilPerformanceStats } from 'recoil';

// В вашем App.tsx
useEffect(() => {
  if (!__DEV__) return;
  
  // Показываем статистику каждые 30 секунд
  const interval = setInterval(() => {
    const stats = RecoilPerformanceStats.getStats();
    
    if (stats.atomUpdatesAttempted > 0) {
      console.log('📊 Recoil stats (last 30s):');
      console.log(`   Prevented updates: ${
        stats.atomUpdatesPrevented + 
        stats.selectorRecalculationsPrevented + 
        stats.transactionUpdatesPrevented
      }`);
      
      // Сбрасываем для следующего интервала
      RecoilPerformanceStats.resetStats();
    }
  }, 30000);
  
  return () => clearInterval(interval);
}, []);
```

---

### Вариант 2: Отчет при размонтировании

```javascript
import { RecoilPerformanceStats } from 'recoil';

function YourApp() {
  useEffect(() => {
    if (__DEV__) {
      RecoilPerformanceStats.resetStats();
    }
    
    return () => {
      // Показываем статистику при закрытии приложения
      if (__DEV__) {
        console.log('\n👋 App unmounting, final stats:');
        RecoilPerformanceStats.printStats();
      }
    };
  }, []);
  
  return <YourAppContent />;
}
```

---

### Вариант 3: Отправка в аналитику

```javascript
import { RecoilPerformanceStats } from 'recoil';

const useSendPerformanceMetrics = () => {
  useEffect(() => {
    if (!__DEV__) return;
    
    const interval = setInterval(() => {
      const stats = RecoilPerformanceStats.getStats();
      
      // Отправляем в вашу систему аналитики
      analytics.track('recoil_performance', {
        atomUpdatesAttempted: stats.atomUpdatesAttempted,
        atomUpdatesPrevented: stats.atomUpdatesPrevented,
        selectorRecalculationsAttempted: stats.selectorRecalculationsAttempted,
        selectorRecalculationsPrevented: stats.selectorRecalculationsPrevented,
        preventionRate: (
          (stats.atomUpdatesPrevented + stats.selectorRecalculationsPrevented) /
          (stats.atomUpdatesAttempted + stats.selectorRecalculationsAttempted)
        ) * 100,
      });
      
      RecoilPerformanceStats.resetStats();
    }, 60000); // Каждую минуту
    
    return () => clearInterval(interval);
  }, []);
};
```

---

## 📱 UI компонент для отображения статистики

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RecoilPerformanceStats } from 'recoil';

export function RecoilStatsOverlay() {
  const [stats, setStats] = useState(RecoilPerformanceStats.getStats());
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (!__DEV__) return;
    
    const interval = setInterval(() => {
      setStats(RecoilPerformanceStats.getStats());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!__DEV__ || !visible) {
    return (
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.toggleText}>📊</Text>
      </TouchableOpacity>
    );
  }
  
  const totalPrevented =
    stats.atomUpdatesPrevented +
    stats.selectorRecalculationsPrevented +
    stats.transactionUpdatesPrevented;
  
  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setVisible(false)}
      >
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>📊 Recoil Stats</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>Atoms:</Text>
        <Text style={styles.value}>
          {stats.atomUpdatesPrevented} / {stats.atomUpdatesAttempted} prevented
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Selectors:</Text>
        <Text style={styles.value}>
          {stats.selectorRecalculationsPrevented} / {stats.selectorRecalculationsAttempted} prevented
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Transactions:</Text>
        <Text style={styles.value}>
          {stats.transactionUpdatesPrevented} / {stats.transactionUpdatesAttempted} prevented
        </Text>
      </View>
      
      <View style={[styles.section, styles.total]}>
        <Text style={styles.totalLabel}>Total Prevented:</Text>
        <Text style={styles.totalValue}>{totalPrevented}</Text>
      </View>
      
      <TouchableOpacity
        style={styles.resetButton}
        onPress={() => {
          RecoilPerformanceStats.resetStats();
          setStats(RecoilPerformanceStats.getStats());
        }}
      >
        <Text style={styles.resetText}>Reset Stats</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  toggleButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  toggleText: {
    fontSize: 24,
  },
  overlay: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 10,
    padding: 15,
    minWidth: 250,
    zIndex: 9999,
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
  },
  closeText: {
    color: 'white',
    fontSize: 20,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  section: {
    marginBottom: 10,
  },
  label: {
    color: '#aaa',
    fontSize: 12,
  },
  value: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  total: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  totalLabel: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalValue: {
    color: '#4CAF50',
    fontSize: 20,
    fontWeight: 'bold',
  },
  resetButton: {
    marginTop: 10,
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  resetText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
```

Использование:

```javascript
// App.tsx
import { RecoilStatsOverlay } from './components/RecoilStatsOverlay';

export default function App() {
  return (
    <RecoilRoot>
      <YourApp />
      {__DEV__ && <RecoilStatsOverlay />}
    </RecoilRoot>
  );
}
```

---

## 🔧 API Reference

### `RecoilPerformanceStats.enableLogging(enabled: boolean)`

Включает/выключает детальное логирование каждого предотвращенного обновления.

```javascript
import { RecoilPerformanceStats } from 'recoil';

// Включить
RecoilPerformanceStats.enableLogging(true);

// Выключить
RecoilPerformanceStats.enableLogging(false);
```

### `RecoilPerformanceStats.getStats()`

Возвращает текущую статистику.

```javascript
const stats = RecoilPerformanceStats.getStats();
console.log(stats);
// {
//   atomUpdatesAttempted: 100,
//   atomUpdatesPrevented: 85,
//   selectorRecalculationsAttempted: 50,
//   selectorRecalculationsPrevented: 42,
//   transactionUpdatesAttempted: 20,
//   transactionUpdatesPrevented: 18,
// }
```

### `RecoilPerformanceStats.resetStats()`

Сбрасывает все счетчики на 0.

```javascript
RecoilPerformanceStats.resetStats();
```

### `RecoilPerformanceStats.printStats()`

Выводит красиво отформатированную статистику в консоль.

```javascript
RecoilPerformanceStats.printStats();
```

---

## 📍 Где добавить проверку `console.log(RecoilEnv.RECOIL_GKS_ENABLED)`

### ✅ Рекомендуемое место: В начале App.tsx

```javascript
// App.tsx (САМЫЙ ВЕРХ, после импортов)
import { RecoilEnv, RecoilPerformanceStats } from 'recoil';

// ========================================
// ПРОВЕРКА КОНФИГУРАЦИИ (только в DEV)
// ========================================
if (__DEV__) {
  console.log('\n========================================');
  console.log('🚀 RECOIL OPTIMIZED FORK');
  console.log('========================================');
  
  // 1. Проверяем GK флаги
  console.log('GKs enabled:');
  Array.from(RecoilEnv.RECOIL_GKS_ENABLED).forEach(gk => {
    console.log(`  ✅ ${gk}`);
  });
  
  // 2. Проверяем наличие recoil_transition_support
  if (RecoilEnv.RECOIL_GKS_ENABLED.has('recoil_transition_support')) {
    console.log('\n✅ Concurrent React support ENABLED');
  }
  
  // 3. Включаем логирование
  RecoilPerformanceStats.enableLogging(true);
  console.log('✅ Performance logging ENABLED');
  
  console.log('========================================\n');
}

import React, { useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import { YourApp } from './YourApp';

export default function App() {
  return (
    <RecoilRoot>
      <YourApp />
    </RecoilRoot>
  );
}
```

---

## 📊 Пример использования в реальном приложении

```javascript
// App.tsx
import React, { useEffect } from 'react';
import { RecoilRoot, RecoilEnv, RecoilPerformanceStats } from 'recoil';
import { YourApp } from './YourApp';

// Проверка конфигурации
if (__DEV__) {
  console.log('🔍 Recoil GKs:', Array.from(RecoilEnv.RECOIL_GKS_ENABLED));
  
  // Включаем детальное логирование
  RecoilPerformanceStats.enableLogging(true);
}

function AppWithStats() {
  useEffect(() => {
    if (!__DEV__) return;
    
    // Показываем статистику каждые 10 секунд
    const interval = setInterval(() => {
      const stats = RecoilPerformanceStats.getStats();
      
      if (stats.atomUpdatesAttempted > 0) {
        console.log('\n📊 Recoil Stats (last 10s):');
        console.log(`   Atoms prevented: ${stats.atomUpdatesPrevented}/${stats.atomUpdatesAttempted}`);
        console.log(`   Selectors prevented: ${stats.selectorRecalculationsPrevented}/${stats.selectorRecalculationsAttempted}`);
        
        RecoilPerformanceStats.resetStats();
      }
    }, 10000);
    
    // Финальная статистика при закрытии
    return () => {
      clearInterval(interval);
      console.log('\n👋 App closing, final stats:');
      RecoilPerformanceStats.printStats();
    };
  }, []);
  
  return <YourApp />;
}

export default function App() {
  return (
    <RecoilRoot>
      <AppWithStats />
    </RecoilRoot>
  );
}
```

---

## 🎯 Что вы увидите при гидрации

### С выключенным логированием:
```javascript
RecoilPerformanceStats.enableLogging(false);
```
**Результат:** Только итоговая статистика (через `printStats()`).

### С включенным логированием:
```javascript
RecoilPerformanceStats.enableLogging(true);
```
**Результат:**
```
[Recoil] ⏭️  Atom update prevented: transactionsAtom (value unchanged)
[Recoil] ⏭️  Atom update prevented: userDataAtom (value unchanged)
[Recoil] ⏭️  Atom update prevented: cardsAtom (value unchanged)
[Recoil] ⏭️  Selector recalculation prevented: getCardTransactionsById__selectorFamily/card-123 (result unchanged)
[Recoil] ⏭️  Selector recalculation prevented: getTotalBalance (result unchanged)
...

========================================
📊 RECOIL PERFORMANCE STATISTICS
========================================

🔹 Atoms:
   Attempted: 10
   Prevented: 9 (90.0%)

🔹 Selectors:
   Attempted: 25
   Prevented: 22 (88.0%)

🔹 Transactions:
   Attempted: 0
   Prevented: 0 (0%)

🎯 Total prevented: 31
========================================
```

---

## 💡 Интерпретация результатов

### Хорошие показатели:
- ✅ **70-90% prevented** - отличная оптимизация! Большинство данных не изменилось
- ✅ **50-70% prevented** - хорошая оптимизация
- ⚠️ **30-50% prevented** - средняя оптимизация
- ❌ **< 30% prevented** - данные часто меняются, оптимизация помогает мало

### Если prevented = 0%:
Это означает, что **все данные реально изменились**. Это нормально, если:
- Первый запуск приложения (localStorage пустой)
- Данные действительно обновились на сервере
- Пользователь выполнил действия, изменившие данные

---

## 🎉 Итого

Теперь у вас есть:
1. ✅ **Детальное логирование** каждого предотвращенного обновления
2. ✅ **Статистика** с процентами
3. ✅ **API** для интеграции с аналитикой
4. ✅ **UI компонент** для визуального мониторинга

**Где проверять `RecoilEnv.RECOIL_GKS_ENABLED`:**
👉 **В самом начале `App.tsx`**, сразу после импорта `recoil`, до создания `<RecoilRoot>`.

Все работает только в `__DEV__` режиме, поэтому не влияет на production производительность! 🚀

