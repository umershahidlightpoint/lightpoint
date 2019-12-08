
Import-Module "C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\Common7\Tools\Microsoft.VisualStudio.DevShell.dll"
Enter-VsDevShell a0e1530e -StartInPath "C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\"
Set-Location $psscriptRoot

@(
    "services\LP.FileProcessing\LP.FileProcessing.sln"
    "services\LP.Finance.WebProxy"
    "services\LP.ReferenceData.WebProxy"
    "services\PostingEngine.sln"
) | Foreach-Object {
    msbuild $_ /t:"restore;build"
    if (!$?) {
        Write-Error "Build failed while building item : $_"
    }
}


@(
    "$psscriptRoot\distribution"
) | ForEach-Object {
    if(Test-Path $_){
        Remove-Item -Recurse -Force -Verbose -Path $_
    }
}

robocopy /MT /E "$psscriptRoot\services\LP.Finance.WebProxy\bin\Debug" "$psscriptRoot\distribution\services\LP.Finance.WebProxy"
robocopy /MT /E "$psscriptRoot\services\LP.ReferenceData.WebProxy\bin\Debug" "$psscriptRoot\distribution\services\LP.ReferenceData.WebProxy"
robocopy /MT /E "$psscriptRoot\services\PostingEngineApp\bin\Debug" "$psscriptRoot\distribution\services\PostingEngine"

<#
Set-Location "$psscriptRoot\frontendapp"
npm install 
npm run build 
npm run deploy

Set-Location "$psscriptRoot\node"
npm install
npm run deploy
#>