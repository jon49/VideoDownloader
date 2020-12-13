mkdir publish
xcopy .\src\static\ .\publish\static\ /y /s
deno compile --unstable -o ./publish/downloader.exe ./src/index.ts