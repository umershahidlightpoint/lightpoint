@echo off

set MACHINE_NAME=DEVELOP02

set InstallFolder="C:\Program Files\nodejs"
set SERVICE_NAME="LP.WebServer.PortfolioAccounting"
set NSSM="C:\Apps\NSSM\bin\win64\nssm.exe"

set APP_FOLDER="c:\Apps\%MACHINE_NAME%\PortfolioAccounting\Web\server"

%NSSM% install %SERVICE_NAME% %InstallFolder%\node.exe
%NSSM% set %SERVICE_NAME% AppParameters server.js

%NSSM% set %SERVICE_NAME% AppDirectory %APP_FOLDER%

%NSSM% set %SERVICE_NAME% Description CentralConfig REST config service
%NSSM% set %SERVICE_NAME% Start SERVICE_AUTO_START

rem %NSSM% set %SERVICE_NAME% AppStdout %InstallFolder%\centralconfig.log
rem %NSSM% set %SERVICE_NAME% AppStderr %InstallFolder%\centralconfig.log

%NSSM% edit %SERVICE_NAME%

rem sc start %SERVICE_NAME%