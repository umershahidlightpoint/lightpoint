set SERVER=DEMO02

echo %SERVER%

rem sc create LP.Finance.WebProxy binPath="C:\Apps\%SERVER%\Finance\Services\LP.Finance.WebProxy\LP.Finance.WebProxy.exe"
rem sc create LP.ReferenceData.WebProxy binPath="C:\Apps\%SERVER%\Finance\Services\LP.ReferenceData.WebProxy\LP.ReferenceData.WebProxy.exe"