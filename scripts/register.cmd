set SERVER=DEMO02

echo %SERVER%

sc create LP.Finance.WebProxy binPath="C:\Apps\%SERVER%\PortfolioAccounting\Services\LP.Finance.WebProxy\LP.Finance.WebProxy.exe"
sc create LP.ReferenceData.WebProxy binPath="C:\Apps\%SERVER%\PortfolioAccounting\Services\LP.ReferenceData.WebProxy\LP.ReferenceData.WebProxy.exe"