# finance
for accounting / finance POC
## Prerequisite
<ol>
<li>Postgres DB Server</li>
<li>NodeJs 8+</li>
<li>NPM</li>
<li>Git</li>
</ol>

## Server app Setup
<p>Navigate to directory serverapp/src/config.
Make a copy of "config.json.example" as "config.json" and change your development configurations accordingly.
</p>
<pre>
cd serverapp <br/>
npm install <br/>
npx sequelize db:drop<br />
npx sequelize db:create<br />
npx sequelize db:migrate<br />
npx sequelize db:seed:all<br />
npm demo.js <br />
npm run dev<br />
</pre>

## Running Unit Tests
In order to run unit tests.
<code>
cd serverapp <br />
npm run test<br />
</code>

## API Endpoints
<ol>
<li>http://localhost:8080/v1/customers</li>
<li>http://localhost:8080/v1/funds</li>
<li>http://localhost:8080/v1/accounts</li>
<li>http://localhost:8080/v1/ledgers</li>
</ol>

## Angular App Setup
<pre>
cd frontendapp
npm install
npm start
</pre>