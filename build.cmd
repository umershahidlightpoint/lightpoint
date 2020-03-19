@Echo "Git Pull and then build"
git pull
if %ERRORLEVEL% NEQ 0 GOTO Failed

cd services

msbuild -t:clean;restore Finance.sln
msbuild -t:clean;restore ReferenceData.sln
msbuild -t:clean;restore PostingEngine.sln

rem msbuild -t:restore Finance.sln
rem msbuild -t:restore ReferenceData.sln
rem msbuild -t:restore PostingEngine.sln

msbuild Finance.sln
msbuild ReferenceData.sln
msbuild PostingEngine.sln

REM cd ..\..\container

REM msbuild -t:clean LightPointApp.sln
REM msbuild -t:restore LightPointApp.sln
REM msbuild LightPointApp.sln

cd ..\

IF exist distribution/nul ( rmdir /s /q distribution )
mkdir distribution\APP\Services
mkdir distribution\XA\Web
mkdir distribution\XA\UI
mkdir distribution\XA\Tools

REM Container
REM xcopy /q ..\container\LightpointApp\bin\Debug /s distribution\XA\UI
REM rename distribution\XA\UI\LightPointApp.exe PortfolioAccounting.exe
REM rename distribution\XA\UI\LightPointApp.exe.config PortfolioAccounting.exe.config

REM Services
mkdir distribution\APP\services\LP.Finance.WebProxy
xcopy /q services\LP.Finance.WebProxy\bin\Debug /s distribution\APP\services\LP.Finance.WebProxy

mkdir distribution\APP\services\LP.ReferenceData.WebProxy
xcopy /q services\LP.ReferenceData.WebProxy\bin\Debug /s distribution\APP\services\LP.ReferenceData.WebProxy

mkdir distribution\XA\Tools\PostingEngine
xcopy /q services\PostingEngineApp\bin\Debug /s distribution\XA\Tools\PostingEngine

xcopy /q scripts /s distribution\APP\services

REM Web UI
cd ./ui
rmdir /s /q node_modules\lp-toolkit
rmdir /s /q node_modules\lp-toolkit
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
