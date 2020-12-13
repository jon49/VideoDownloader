// import { dlPath, appPath, ffmpegPath, _7zPath, binPath } from "../../settings.ts"
// import { download, Destination } from "https://deno.land/x/download/mod.ts"
// import { ensureDir, existsSync, move } from "https://deno.land/std/fs/mod.ts"
import { v4 } from "https://deno.land/std/uuid/mod.ts"

const tempPath = Deno.env.get("TEMP")

const decoder = new TextDecoder()

export const startDownloadOfDependencies = async (data: any) => {
    const installScriptPath = `${Deno.cwd()}/static/install/install.ps1`
    Deno.run({
        cmd: [
            "cmd", "/c", "Powershell.exe", "-executionpolicy", "remotesigned", "-File", installScriptPath,
            "-FfmpegUrl", data.ffmpeg,
            "-YtUrl", data.dl,
            "-UUID", v4.generate()
        ]
    })

    // Deno.run({
    //     // cmd: ["cmd /c Powershell.exe -executionpolicy remotesigned", `"echo Hellow!"`]
    //     cmd: ["cmd", "/c", "echo", "hi"]
    // })
    // await Promise.all([installDownloader(data)])
    // await installFFMPEG()
}

// async function installFFMPEG() {
//     if (existsSync(ffmpegPath)) return

//     const ffmpegFilename = "ffmpeg-git-full.7z"
//     const tempFfmpegPATH = `${tempPath}/ffmpeg`
//     await ensureDir(tempFfmpegPATH)
//     await download("https://www.gyan.dev/ffmpeg/builds/ffmpeg-git-full.7z", {
//         file: ffmpegFilename,
//         dir: tempFfmpegPATH
//     })

//     const process = Deno.run({
//         cmd: [_7zPath, "e", `-o"${tempFfmpegPATH}"`, "-r", tempFfmpegPATH + `/${ffmpegFilename}`, "bin"]
//     })

//     const { code } = await process.status()
//     if (code === 0) {
//         console.log("Moving ffmpeg files")
//         await move(tempFfmpegPATH + "/bin", binPath)
//     }
// }

// async function installDownloader(data: any) {
//     if (existsSync(dlPath)) return
//     const destinationDownloader : Destination = {
//         file: "youtube-dl.exe",
//         dir: appPath
//     }
//     await download(data.dl, destinationDownloader)
// }
