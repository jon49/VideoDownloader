import { dlPath, setData, HomeModel } from "../../settings.ts"

var decoder = new TextDecoder()
export const getVideoName = async (url: string | null | undefined) => {
    if (!url) {
        return {name: ""}
    }
    const process = Deno.run({
        cmd: [dlPath, "--get-filename", url],
        stdout: "piped",
        stderr: "piped"
    })
    const { code } = await process.status()
    if (code === 0) {
        const out = await process.output()
        return { name: decoder.decode(out).trim() }
    } else {
        const out = await process.stderrOutput()
        return Promise.reject(decoder.decode(out))
    }
}

export const post = async (data: HomeModel | undefined) => {
    if (!data) return Promise.reject({ errors: ["No data was received."] })
    data.errors = []
    if (!data.targetDirectory) data.errors.push("Target directory is required")
    if (!data.format) data.errors.push("Format is required.")
    if (!data.urls.find(x => x)) data.errors.push("Please add at least one video")
    if (data.errors.length > 0) return Promise.reject(data)
    for (var url of data.urls) {
        if (url) {
            downloadFile(url, <string>data.format, <string>data.targetDirectory)
        }
    }
    await setData(data)
}

const downloadFile = async (url: string, format: string, workingDirectory: string) => {
    if (!["/", "\\"].includes(workingDirectory[workingDirectory.length - 1])) {
        workingDirectory = workingDirectory + "/"
    }
    const title = ["-o", `${workingDirectory}%(title)s-%(id)s.%(ext)s`]
    const cmd =
        format === "lqytmp3"
            ? downloadLowQualityMP3(url, title)
        : format === "hqytmp3"
            ? downloadHighQualityMP3(url, title)
        : format === "hqyt"
            ? downloadHighQualityVideo(url, title)
        : { cmd: [] }
    if (cmd.cmd.length > 0) {
        Deno.run({ ...cmd })
    } else {
        return Promise.reject(`Unknown format type '${format}'.`)
    }
}

enum AudioQuality {
    Worst = 9,
    Best = 0
}
const downloadMP3String = (url: string, quality: AudioQuality, title: string[]) =>
    ["--extract-audio", "--audio-format", "mp3", "--audio-quality", quality.toString(), ...title, url]

type VideoDownloaderCommand = (url: string, outFilename: string[]) => { cmd: string[] }

const downloadLowQualityMP3 : VideoDownloaderCommand = (url, title) => ({
        cmd: [dlPath, ...downloadMP3String(url, AudioQuality.Worst, title)]
    })

const downloadHighQualityMP3 : VideoDownloaderCommand = (url, title) => ({
    cmd: [dlPath, ...downloadMP3String(url, AudioQuality.Best, title)]
})

const downloadHighQualityVideo : VideoDownloaderCommand = (url, title) => ({
    cmd: [dlPath, "-f", "bestvideo[ext!=mp4]‌​+bestaudio[ext!=mp4]‌​/best[ext!=mp4]", ...title, url]
})
