;(async function() {
    const [yt, ffmpeg] = ["yt-page", "ffmpeg-page"].map(x => document.getElementById(x))
    const origin = new URL(document.location).origin

    const $form = document.forms["start-download"]

    const anchors = Array.from(yt.querySelectorAll("[href]"))
    $form.dl.value = anchors.find(x => x.href.endsWith("youtube-dl.exe")).href

    const ffmpegHref = Array.from(ffmpeg.querySelectorAll("[href]")).find(x => x.href.endsWith("-win64-gpl-shared.zip")).href
    $form.ffmpeg.value = ffmpegHref.replace(origin, "https://github.com")

    const $msDownload = document.getElementById("microsoft-download")
    $msDownload.href = anchors.find(x => x.href.includes("microsoft")).href
}())
.catch(x => console.error(x));
