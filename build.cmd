@Echo "Git Pull and then build"
git pull
if %ERRORLEVEL% NEQ 0 GOTO Failed

cd services

msbuild LP.Finance.WebProxy
msbuild LP.ReferenceData.WebProxy

cd ..\
IF exist distribution/nul ( rmdir /s /q distribution )
mkdir distribution
mkdir distribution\Services
mkdir distribution\Web
mkdir distribution\UI

REM Services
mkdir distribution\services\LP.Finance.WebProxy
xcopy /q services\LP.Finance.WebProxy\bin\Debug /s distribution\services\LP.Finance.WebProxy

mkdir distribution\services\LP.ReferenceData.WebProxy
xcopy /q services\LP.ReferenceData.WebProxy\bin\Debug /s distribution\services\LP.ReferenceData.WebProxy

REM Web UI
cd ./frontendapp
npm install && npm run build

cd ../node
npm install && npm run copy

Goto Finished

:Failed
Echo Failed

:Finished
Echo Completed Build
