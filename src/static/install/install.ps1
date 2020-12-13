param([string] $FfmpegUrl, [string] $YtUrl, [string] $UUID)

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

$YoutubePath = "$VideoDownloaderBinDir/youtube-dl.exe"
if (!(Test-Path -Path $YoutubePath) -and $YtUrl.Length -gt 0) {
    Invoke-WebRequest $YtUrl -UseBasicParsing -OutFile $YoutubePath
}

$FfmpegPath = "$VideoDownloaderBinDir/ffmpeg.exe"
$tempFfmpegPath = Join-Path $Env:Temp $UUID
$ffmpegTempFilename = Join-Path $tempFfmpegPath "ffmpeg.zip"
if (!(Test-Path -Path $FfmpegPath) -and $FfmpegUrl.Length -gt 0) {
    New-Item -Type Directory -ErrorAction SilentlyContinue -Path $tempFfmpegPath > $null
    Invoke-WebRequest $FfmpegUrl -UseBasicParsing -OutFile $ffmpegTempFilename
    Write-Host $ffmpegTempFilename
    Expand-Archive -Force $ffmpegTempFilename $tempFfmpegPath
    $ffmpegBinDir = Get-ChildItem $tempFfmpegPath -Directory -Recurse | ?{ $_.Name -eq "bin" } | Select-Object FullName
    Move-Item "$($ffmpegBinDir.FullName)/*" $VideoDownloaderBinDir
}
