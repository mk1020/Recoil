# 🎯 Примеры использования оптимизированного Recoil форка

## 📍 ГДЕ добавить `console.log(RecoilEnv.RECOIL_GKS_ENABLED)`

### ✅ Самый простой способ:

```javascript
// App.tsx (САМЫЙ ВЕРХ ФАЙЛА)
import { RecoilEnv, RecoilPerformanceStats } from 'recoil';

// ========================================
// ПРОВЕРКА КОНФИГУРАЦИИ
// ========================================
if (__DEV__) {
  console.log('🔍 Recoil GKs:', Array.from(RecoilEnv.RECOIL_GKS_ENABLED));
  
  // Включаем детальное логирование
  RecoilPerformanceStats.enableLogging(true);
}
// ========================================

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

**Вы увидите в консоли:**
```
🔍 Recoil GKs: [
  'recoil_hamt_2020',
  'recoil_sync_external_store',
  'recoil_suppress_rerender_in_callback',
  'recoil_memory_managament_2020',
  'recoil_transition_support'  ← Должен быть!
]
```

---

## 🎬 Полный пример: Гидрация с мониторингом

```javascript
// App.tsx
import React, { useEffect } from 'react';
import { 
  RecoilRoot, 
  RecoilEnv, 
  RecoilPerformanceStats,
  useRecoilCallback 
} from 'recoil';
import { startTransition } from 'react';

// ========================================
// 1. ПРОВЕРКА КОНФИГУРАЦИИ
// ========================================
if (__DEV__) {
  console.log('🔍 Recoil GKs:', Array.from(RecoilEnv.RECOIL_GKS_ENABLED));
  
  // Включаем логирование
  RecoilPerformanceStats.enableLogging(true);
  
  console.log('✅ Performance monitoring enabled');
}

// ========================================
// 2. ХУК ДЛЯ ГИДРАЦИИ С МОНИТОРИНГОМ
// ========================================
const useHydrateFromAPI = () => {
  return useRecoilCallback(
    ({ transactDeferred_UNSTABLE }) => async () => {
      console.log('🔄 Starting data hydration...');
      
      // Сбрасываем статистику
      if (__DEV__) {
        RecoilPerformanceStats.resetStats();
      }
      
      try {
        // Загружаем данные
        const apiData = await Promise.all([
          fetchTransactions(),
          fetchUserData(),
          fetchCards(),
          fetchCategories(),
          fetchBudgets(),
          fetchGoals(),
          fetchNotifications(),
          fetchSettings(),
          fetchAnalytics(),
          fetchHistory(),
        ]);
        
        console.log('✅ API data loaded, updating atoms...');
        
        // Обновляем с низким приоритетом
        transactDeferred_UNSTABLE(
          ({ set }) => {
            set(transactionsAtom, apiData[0]);
            set(userDataAtom, apiData[1]);
            set(cardsAtom, apiData[2]);
            set(categoriesAtom, apiData[3]);
            set(budgetsAtom, apiData[4]);
            set(goalsAtom, apiData[5]);
            set(notificationsAtom, apiData[6]);
            set(settingsAtom, apiData[7]);
            set(analyticsAtom, apiData[8]);
            set(historyAtom, apiData[9]);
          },
          { waitForInteractions: true }
        );
        
        // Показываем статистику через секунду
        if (__DEV__) {
          setTimeout(() => {
            console.log('✅ Hydration complete!');
            RecoilPerformanceStats.printStats();
          }, 1000);
        }
      } catch (error) {
        console.error('❌ Hydration error:', error);
      }
    },
    []
  );
};

// ========================================
// 3. ГЛАВНЫЙ КОМПОНЕНТ
// ========================================
function AppContent() {
  const hydrate = useHydrateFromAPI();
  
  useEffect(() => {
    // Запускаем гидрацию при старте
    hydrate();
  }, [hydrate]);
  
  return <YourApp />;
}

export default function App() {
  return (
    <RecoilRoot>
      <AppContent />
    </RecoilRoot>
  );
}
```

---

## 📱 Пример вывода в консоль

### При запуске приложения:
```
🔍 Recoil GKs: [
  'recoil_hamt_2020',
  'recoil_sync_external_store',
  'recoil_suppress_rerender_in_callback',
  'recoil_memory_managament_2020',
  'recoil_transition_support'
]
✅ Performance monitoring enabled

🔄 Starting data hydration...
✅ API data loaded, updating atoms...

[Recoil] ⏭️  Atom update prevented: transactionsAtom (value unchanged)
[Recoil] ⏭️  Atom update prevented: userDataAtom (value unchanged)
[Recoil] ⏭️  Atom update prevented: cardsAtom (value unchanged)
[Recoil] ⏭️  Atom update prevented: categoriesAtom (value unchanged)
[Recoil] ⏭️  Atom update prevented: budgetsAtom (value unchanged)
[Recoil] ⏭️  Atom update prevented: goalsAtom (value unchanged)
[Recoil] ⏭️  Atom update prevented: notificationsAtom (value unchanged)
[Recoil] ⏭️  Atom update prevented: settingsAtom (value unchanged)
[Recoil] ⏭️  Atom update prevented: analyticsAtom (value unchanged)
[Recoil] ⏭️  Selector recalculation prevented: getCardTransactionsById__selectorFamily/card-123 (result unchanged)
[Recoil] ⏭️  Selector recalculation prevented: getTotalBalance (result unchanged)
... (еще 20 селекторов)

✅ Hydration complete!

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

**Интерпретация:** 
- 9 из 10 атомов не изменились → оптимизация предотвратила 9 обновлений
- 22 из 25 селекторов вернули тот же результат → предотвращено 22 пересчета
- **Итого:** 31 ненужное обновление предотвращено = **31 потенциальный ререндер компонентов не произошел!** 🎉

---

## 🔧 Отключение логирования в production

Не беспокойтесь - все логирование и статистика работают **только** в `__DEV__` режиме и **автоматически отключаются** в production билде.

```javascript
// В production:
if (__DEV__) {  // ← false в production
  RecoilPerformanceStats.enableLogging(true);  // Не выполнится
}
```

---

## 📊 Краткий чеклист

- [ ] Добавьте проверку `RecoilEnv.RECOIL_GKS_ENABLED` в начало `App.tsx`
- [ ] Включите логирование: `RecoilPerformanceStats.enableLogging(true)`
- [ ] Запустите приложение
- [ ] Проверьте, что в консоли есть `recoil_transition_support`
- [ ] Выполните гидрацию данных
- [ ] Посмотрите статистику: `RecoilPerformanceStats.printStats()`
- [ ] Радуйтесь высокому проценту prevented updates! 🎉

