const settingsPath = Deno.env.get("USERPROFILE") + "/.video-downloader/settings.json"
export const dlPath = Deno.env.get("USERPROFILE") + "/.video-downloader/youtube-dl.exe"

export const getData = async <T>() => {
    const text = await Deno.readTextFile(settingsPath)
    return <T>JSON.parse(text)
}

export const setData = <T>(data: T) =>
    Deno.writeTextFile(settingsPath, JSON.stringify(data))
