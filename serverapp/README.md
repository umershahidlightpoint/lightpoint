# finance server app
for accounting / finance POC
## Prerequisite
<ol>
<li><strong>NodeJs 8+</strong></li>
<li><strong>NPM</strong></li>
<li><strong>Git</strong></li>
<li><strong>Docker 17+</strong>
<a href='https://docs.docker.com/install/'>https://docs.docker.com/install/</a>
<br>
</li>
<li><strong>Docker Compose</strong>
<a href='https://docs.docker.com/compose/install/'>https://docs.docker.com/compose/install/</a>
<br>
</li>
</ol>

## Server app Setup
<p>Navigate to directory serverapp/src/config.
Make a copy of "config.json.example" as "config.json" and change your development configurations accordingly.
</p>
<p>Use following commands for setup</p>

<pre>
cd serverapp <br/>
npm install <br/>
npm run create-db <br/>
npx sequelize db:drop<br />
npx sequelize db:create<br />
npx sequelize db:migrate<br />
npx sequelize db:seed:all<br />
npm run setup-db <br />
npm run dev<br />
</pre>

## Docker Database Commands
<p>To create database</p>
<pre>
npm run create-db
</pre>
<p>To start database</p>
<pre>
npm run start-db
</pre>
<p>To stop database</p>
<pre>
npm run stop-db
</pre>
<p>To show database status</p>
<pre>
npm run show-db
</pre>
<p>To delete database</p>
<pre>
npm run delete-db
</pre>

## Running Unit Tests
<p>In order to run unit tests.</p>
<pre>
cd serverapp <br />
npx sequelize db:create --env=test<br />
npx sequelize db:migrate --env=test<br />
npm run test<br />
</pre>

## API Endpoints
<ol>
<li>http://localhost:3000/v1/customers</li>
<li>http://localhost:3000/v1/funds</li>
<li>http://localhost:3000/v1/accounts</li>
<li>http://localhost:3000/v1/ledgers</li>
</ol>