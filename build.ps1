Import-Module "C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\Common7\Tools\Microsoft.VisualStudio.DevShell.dll"
Enter-VsDevShell a0e1530e -StartInPath "C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\"
Set-Location $psscriptRoot
msbuild services\LP.FileProcessing\LP.FileProcessing.sln /t:"restore;build"
msbuild services\LP.Finance.WebProxy /t:"restore;build"
msbuild services\LP.ReferenceData.WebProxy /t:"restore;build"
msbuild services\PostingEngine.sln  /t:"restore;build"

Set-Location "$psscriptRoot\frontendapp"
npm install 
npm run build 
npm run deploy

Set-Location "$psscriptRoot\node"
npm install
npm run deploy