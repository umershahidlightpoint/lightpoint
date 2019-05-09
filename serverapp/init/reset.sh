#!/bin/sh

npx sequelize db:migrate > 2&1 || npx sequelize db:create && npx sequelize db:migrate && npx sequelize db:seed:all && node demo.js

#node demo.js