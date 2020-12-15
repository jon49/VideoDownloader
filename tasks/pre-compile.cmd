echo "This is a temporary file which will be removed when the bug fix for Deno compile is created."

rmdir .\pre-publish\
xcopy .\src\ .\pre-publish\ /y /s
