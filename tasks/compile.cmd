deno compile --unstable -o ./publish/downloader.exe ./pre-publish/index.ts

xcopy .\src\static\ .\publish\static\ /y /s
