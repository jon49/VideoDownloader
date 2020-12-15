import { exists } from "https://deno.land/std/fs/mod.ts"

export const appPath = Deno.env.get("USERPROFILE") + "/.video-downloader"
export const binPath = appPath + "/bin"
const settingsPath = appPath + "/settings.json"
export const dlPath = binPath + "/youtube-dl.exe"
export const ffmpegPath = binPath + "/ffmpeg.exe"
export const _7zPath = binPath + "/7z.exe"

export interface HomeModel {
    errors: string[] | undefined | null
    format: "lqytmp3" | "hqytmp3" | "hqyt" | undefined
    urls: (string | undefined | null)[]
    targetDirectory: string | undefined
}

export const getData = async () : Promise<HomeModel> => {
    if (!(await exists(settingsPath))) return {} as HomeModel
    const text = await Deno.readTextFile(settingsPath)
    return JSON.parse(text)
}

export const setData = <T>(data: T) =>
    Deno.writeTextFile(settingsPath, JSON.stringify(data))
