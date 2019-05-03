#!/bin/sh

npx sequelize db:drop
npx sequelize db:create
npx sequelize db:migrate
npx sequelize db:seed:all
#node demo.js