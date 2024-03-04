#!/usr/bin/env sh
# остановить публикацию об ошибках
set -e

# сборка приложения
npm run build

# вереход в каталог сборки
cd dist

# инициализация репозитория и загрузка кода в GitHub
git init
git add -A
git commit -m "deploy"
git branch -M main
git remote add origin https://github.com/ALEXX4891/Vue-test.git
# git push -u origin main
git push -f origin main
cd -