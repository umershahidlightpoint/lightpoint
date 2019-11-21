mkdir dist\server
copy server.js dist
xcopy server\*.* /s dist\server
npm run build
