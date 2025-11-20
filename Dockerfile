# Этап 1: Сборка приложения
FROM node:18-alpine as build_stage
WORKDIR /app

# Копирование файлов package.json и соответствующих lock файлов
COPY package.json package-lock.json ./

# Установка зависимостей
RUN npm install sharp
RUN npm ci

# Копирование исходного кода проекта
COPY . .

# Сборка приложения
RUN npm run build

# Этап 2: Финальный образ для запуска
FROM node:18-alpine
WORKDIR /app

# Копирование зависимостей
COPY --from=build_stage /app/node_modules ./node_modules
COPY --from=build_stage /app/package.json ./package.json

# Копирование собранных файлов приложения
COPY --from=build_stage /app/.next ./.next
COPY --from=build_stage /app/public ./public

# Открытие порта, на котором будет работать приложение
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "start"]

