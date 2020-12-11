$VideoDownloaderDir = "~/.video-downloader"
$VideoDownloaderBinDir = "$VideoDownloaderDir/bin"

New-Item -ItemType Directory $VideoDownloaderBinDir -ErrorAction SilentlyContinue > $null

function Test-Command {
    param([string]$Command)
    [bool](Get-Command $Command -errorAction SilentlyContinue)
}

function Add-Path {
    param ( 
        [string]$PathToAdd,
        [Parameter(Mandatory=$true)][ValidateSet('System','User')][string]$UserType,
        [Parameter(Mandatory=$true)][ValidateSet('Path','PSModulePath')][string]$PathType
    )

    # AddTo-Path "C:\XXX" "PSModulePath" 'System' 
    if ($UserType -eq "System" ) { $RegPropertyLocation = 'HKLM:\System\CurrentControlSet\Control\Session Manager\Environment' }
    if ($UserType -eq "User"   ) { $RegPropertyLocation = 'HKCU:\Environment' } # also note: Registry::HKEY_LOCAL_MACHINE\ format
    $PathOld = (Get-ItemProperty -Path $RegPropertyLocation -Name $PathType).$PathType
    "`n$UserType $PathType Before:`n$PathOld`n"
    $PathArray = $PathOld -Split ";" -replace "\\+$", ""
    if ($PathArray -notcontains $PathToAdd) {
        "$UserType $PathType Now:"   # ; sleep -Milliseconds 100   # Might need pause to prevent text being after Path output(!)
        $PathNew = "$PathOld;$PathToAdd"
        Set-ItemProperty -Path $RegPropertyLocation -Name $PathType -Value $PathNew
        Get-ItemProperty -Path $RegPropertyLocation -Name $PathType | select -ExpandProperty $PathType
        if ($PathType -eq "Path") { $env:Path += ";$PathToAdd" }                  # Add to Path also for this current session
        if ($PathType -eq "PSModulePath") { $env:PSModulePath += ";$PathToAdd" }  # Add to PSModulePath also for this current session
        "`n$PathToAdd has been added to the $UserType $PathType"
    }
    else {
        "'$PathToAdd' is already in the $UserType $PathType. Nothing to do."
    }
}

Add-Path -PathToAdd "$VideoDownloaderBinDir" -UserType "User" -PathType "Path"

if (!(Test-Path -Path "~/.deno/bin/deno.exe")) {
    Invoke-WebRequest https://deno.land/x/install/install.ps1 -UseBasicParsing | Invoke-Expression
}


$YoutubePath = "$VideoDownloaderBinDir/youtube-dl.exe"
if (!(Test-Path -Path $YoutubePath)) {
    Invoke-WebRequest "https://yt-dl.org/downloads/2020.12.05/youtube-dl.exe" -UseBasicParsing -OutFile $YoutubePath
    explorer.exe "https://www.microsoft.com/en-US/download/details.aspx?id=5555"
    Read-Host "Please download and install 'Microsoft Visual C++ 2010 Redistributable Package (x86)' and press enter to continue."

    if (Test-Command -Command 7z){
        Invoke-WebRequest "https://www.7-zip.org/a/7z1900-x64.msi" -UseBasicParsing | Invoke-Expression
    }
    Invoke-WebRequest "https://www.gyan.dev/ffmpeg/builds/ffmpeg-git-full.7z" -UseBasicParsing -OutFile ./temp.7z
    7z e -o"./temp" -r ./temp.7z bin
    Remove-Item ./temp/bin
    Move-Item ./temp/* "$VideoDownloaderBinDir"
    Remove-Item ./temp
}
