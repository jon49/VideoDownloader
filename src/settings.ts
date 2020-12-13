export const appPath = Deno.env.get("USERPROFILE") + "/.video-downloader"
export const binPath = appPath + "/bin"
const settingsPath = appPath + "/settings.json"
export const dlPath = binPath + "/youtube-dl.exe"
export const ffmpegPath = binPath + "/ffmpeg.exe"
export const _7zPath = binPath + "/7z.exe"

export const getData = async <T>() => {
    const text = await Deno.readTextFile(settingsPath)
    return <T>JSON.parse(text)
}

export const setData = <T>(data: T) =>
    Deno.writeTextFile(settingsPath, JSON.stringify(data))
