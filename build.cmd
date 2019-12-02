@Echo "Git Pull and then build"
git pull
if %ERRORLEVEL% NEQ 0 GOTO Failed

cd services

msbuild LP.Finance.WebProxy
msbuild LP.ReferenceData.WebProxy
msbuild PostingEngine.sln

cd ..\
IF exist distribution/nul ( rmdir /s /q distribution )
mkdir distribution\Services
mkdir distribution\Web
mkdir distribution\UI

REM Services
mkdir distribution\services\LP.Finance.WebProxy
xcopy /q services\LP.Finance.WebProxy\bin\Debug /s distribution\services\LP.Finance.WebProxy

mkdir distribution\services\LP.ReferenceData.WebProxy
xcopy /q services\LP.ReferenceData.WebProxy\bin\Debug /s distribution\services\LP.ReferenceData.WebProxy

mkdir distribution\services\PostingEngine
xcopy /q services\PostingEngineApp\bin\Debug /s distribution\services\PostingEngine

REM Web UI
cd ./frontendapp
call npm install && call npm run build && call npm run deploy

cd ../node
call npm install && call npm run deploy

cd ..
REM Back to the root

Goto Finished

:Failed
Echo Failed

:Finished
Echo Completed Build
