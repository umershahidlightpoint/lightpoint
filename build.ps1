Import-Module "C:\Program Files (x86)\Microsoft Visual Studio\2019\Preview\Common7\Tools\Microsoft.VisualStudio.DevShell.dll"
Enter-VsDevShell -VsInstallPath "C:\Program Files (x86)\Microsoft Visual Studio\2019\Preview\"
Set-Location $psscriptRoot

@(
    "services\Finance.sln"
    "services\ReferenceData.sln"
    "services\PostingEngine.sln"
    "services\WebProxy.sln"
) | Foreach-Object {
    msbuild $_ /t:"clean;restore;build"
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

Function rCopy {
    param(
        $src,
        $dst
    )

    robocopy /MT /E $src $dst
    if($LASTEXITCODE -ge 8){throw ("An error occured while copying. [RoboCopyCode: $($LASTEXITCODE)]")}else{$global:LASTEXITCODE = 0}
}

rCopy -src "$psscriptRoot\services\LP.Finance.WebProxy\bin\Debug" -dst "$psscriptRoot\distribution\APP\Services\LP.Finance.WebProxy"
rCopy -src "$psscriptRoot\services\LP.ReferenceData.WebProxy\bin\Debug" -dst "$psscriptRoot\distribution\APP\services\LP.ReferenceData.WebProxy"
rCopy -src "$psscriptRoot\services\PostingEngineApp\bin\Debug" -dst "$psscriptRoot\distribution\XA\Tools\PostingEngine"
rCopy -src "$psscriptRoot\scripts" -dst "$psscriptRoot\distribution\APP\Services"

Set-Location "$psscriptRoot\ui"
npm install 
npm run build 
npm run deploy

Set-Location "$psscriptRoot\node"
npm install
npm run deploy