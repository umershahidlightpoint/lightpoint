Echo "Git Pull and then build"
git pull
if %ERRORLEVEL% NEQ 0 GOTO Failed

cd services
msbuild LP.Finance.WebProxy
msbuild LP.ReferenceData.WebProxy
cd ..\
IF exist distribution/nul ( rmdir /s /q distribution )
mkdir distribution

mkdir distribution\LP.Finance.WebProxy
xcopy /q services\LP.Finance.WebProxy\bin\Debug /s distribution\LP.Finance.WebProxy

mkdir distribution\LP.ReferenceData.WebProxy
xcopy /q services\LP.ReferenceData.WebProxy\bin\Debug /s distribution\LP.ReferenceData.WebProxy

Goto Finished

:Failed
Echo Failed

:Finished
Echo Completed Build
