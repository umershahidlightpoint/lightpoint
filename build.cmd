@Echo "Git Pull and then build"
git pull
if %ERRORLEVEL% NEQ 0 GOTO Failed

cd services

msbuild -t:clean Finance.sln
msbuild -t:clean ReferenceData.sln
msbuild -t:clean PostingEngine.sln

msbuild -t:restore Finance.sln
msbuild -t:restore ReferenceData.sln
msbuild -t:restore PostingEngine.sln

msbuild Finance.sln
msbuild Finance.sln
msbuild ReferenceData.sln
msbuild PostingEngine.sln

cd ..\..\

cd container
msbuild -t:clean LightPointApp.sln
msbuild -t:restore LightPointApp.sln
msbuild LightPointApp.sln

cd ..\finance

IF exist distribution/nul ( rmdir /s /q distribution )
mkdir distribution\Services
mkdir distribution\Web
mkdir distribution\UI

REM Container
xcopy /q ..\container\LightpointApp\bin\Debug /s distribution\UI
rename distribution\UI\LightPointApp.exe PortfolioAccounting.exe
rename distribution\UI\LightPointApp.exe.config PortfolioAccounting.exe.config

REM Services
mkdir distribution\services\LP.Finance.WebProxy
xcopy /q services\LP.Finance.WebProxy\bin\Debug /s distribution\services\LP.Finance.WebProxy

mkdir distribution\services\LP.ReferenceData.WebProxy
xcopy /q services\LP.ReferenceData.WebProxy\bin\Debug /s distribution\services\LP.ReferenceData.WebProxy

mkdir distribution\services\PostingEngine
xcopy /q services\PostingEngineApp\bin\Debug /s distribution\services\PostingEngine

xcopy /q scripts /s distribution\services

REM Web UI
cd ./frontendapp
call npm install && call npm run lib:build && call npm run build && call npm run deploy

cd ../node
call npm install && call npm run deploy

cd ..
REM Back to the root

Goto Finished

:Failed
Echo Failed

:Finished
Echo Completed Build
