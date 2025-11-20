# Руководство по установке оптимизированного Recoil форка

## 🚀 Вариант 1: Yarn Link (для разработки и тестирования)

### Шаг 1: Соберите форк Recoil

```bash
cd /Users/michael/projects/Recoil

# Установите зависимости (если еще не установлены)
yarn install

# Соберите пакет
yarn build

# Это создаст папки: cjs/, es/, native/, umd/
```

### Шаг 2: Создайте symlink

```bash
cd /Users/michael/projects/Recoil
yarn link
```

Вы увидите:
```
success Registered "recoil".
info You can now run `yarn link "recoil"` in the projects where you want to use this package.
```

### Шаг 3: Используйте в вашем проекте

```bash
cd /path/to/your/react-native-app

# Отключите старый recoil
yarn unlink recoil

# Подключите ваш форк
yarn link recoil

# Для React Native может потребоваться:
cd ios && pod install && cd ..
```

### Шаг 4: Проверьте, что форк подключен

```bash
ls -la node_modules/recoil
# Должна быть symlink на /Users/michael/projects/Recoil
```

### Откат на оригинальный Recoil:

```bash
cd /path/to/your/react-native-app
yarn unlink recoil
yarn install --force
```

---

## 📦 Вариант 2: Через локальный путь в package.json

### Шаг 1: Соберите форк

```bash
cd /Users/michael/projects/Recoil
yarn build
```

### Шаг 2: Измените package.json вашего проекта

```json
{
  "dependencies": {
    "recoil": "file:../Recoil",
    // или абсолютный путь:
    // "recoil": "file:/Users/michael/projects/Recoil",
  }
}
```

### Шаг 3: Установите зависимости

```bash
cd /path/to/your/react-native-app
yarn install

# Для React Native:
cd ios && pod install && cd ..
```

**Плюсы:**
- ✅ Не нужен `yarn link`
- ✅ Работает в CI/CD
- ✅ Другие разработчики могут использовать

**Минусы:**
- ⚠️ Нужно запускать `yarn install` после каждого изменения форка
- ⚠️ Путь должен быть доступен на всех машинах

---

## 🐙 Вариант 3: Через Git (рекомендуется для команды)

### Шаг 1: Запушьте форк в ваш репозиторий

```bash
cd /Users/michael/projects/Recoil

# Добавьте ваш remote (если еще не добавлен)
git remote add my-fork https://github.com/YOUR_USERNAME/Recoil.git

# Создайте ветку для ваших изменений
git checkout -b optimizations

# Закоммитьте изменения
git add .
git commit -m "Add deep equality optimization with fast-deep-equal"

# Запушьте
git push my-fork optimizations
```

### Шаг 2: Используйте в package.json

```json
{
  "dependencies": {
    "recoil": "github:YOUR_USERNAME/Recoil#optimizations",
    // или с конкретным коммитом:
    // "recoil": "github:YOUR_USERNAME/Recoil#abc123def",
  }
}
```

### Шаг 3: Установите

```bash
cd /path/to/your/react-native-app
yarn install

# Для React Native:
cd ios && pod install && cd ..
```

**Плюсы:**
- ✅ Работает везде (локально, CI/CD, у других разработчиков)
- ✅ Версионирование через Git
- ✅ Легко обновлять (git push + yarn install)

**Минусы:**
- ⚠️ Нужен публичный или приватный GitHub репозиторий

---

## 🏢 Вариант 4: Через приватный npm registry (для продакшена)

Если у вас есть приватный npm registry (Verdaccio, npm private, GitHub Packages):

### Шаг 1: Обновите package.json форка

```bash
cd /Users/michael/projects/Recoil
```

Отредактируйте `package.json`:
```json
{
  "name": "@your-company/recoil-optimized",
  "version": "0.7.7-optimized.1",
  // ...
}
```

### Шаг 2: Соберите и опубликуйте

```bash
yarn build

# Создайте tarball
yarn pack

# Опубликуйте в ваш registry
npm publish --registry=https://your-registry.com
```

### Шаг 3: Используйте в проекте

```json
{
  "dependencies": {
    "recoil": "npm:@your-company/recoil-optimized@^0.7.7-optimized.1"
  }
}
```

---

## 🎯 Рекомендация для вашего случая

Я рекомендую **Вариант 3 (через Git)**, потому что:

1. ✅ Работает в Expo / React Native без проблем
2. ✅ Легко делиться с командой
3. ✅ Версионирование через Git
4. ✅ Работает в CI/CD
5. ✅ Не нужна инфраструктура npm registry

### Быстрый старт:

```bash
# 1. В форке Recoil
cd /Users/michael/projects/Recoil
git checkout -b optimizations
git add .
git commit -m "Add performance optimizations for data hydration"
git push origin optimizations

# 2. В вашем React Native проекте
# Измените package.json:
{
  "dependencies": {
    "recoil": "github:YOUR_USERNAME/Recoil#optimizations"
  }
}

# 3. Установите
yarn install
cd ios && pod install && cd ..

# 4. Запустите
yarn ios  # или yarn android
```

---

## 🔧 Проверка, что форк работает

Добавьте в ваше приложение:

```javascript
import { RecoilEnv } from 'recoil';

console.log('Recoil GKs enabled:', Array.from(RecoilEnv.RECOIL_GKS_ENABLED));
// Должно вывести:
// ['recoil_hamt_2020', 'recoil_sync_external_store', 
//  'recoil_suppress_rerender_in_callback', 'recoil_memory_managament_2020',
//  'recoil_transition_support']  ← Ваше изменение!
```

Если вы видите `recoil_transition_support` в списке, значит ваш форк работает! ✅

---

## 📝 Резюме

**"OSS builds"** = публичная версия (ваш форк). Ваши изменения в `RECOIL_GKS_ENABLED` **работают**.

**Для использования форка:** Рекомендую **Git** (Вариант 3) - самый простой и надежный способ для React Native проектов.
