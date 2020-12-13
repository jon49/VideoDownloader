import html from "../../util/html.ts"
import layout from "../shared/layout.html.ts"

export default async (downloading?: boolean) => {
    const [ytPage, ffmpegPage] = await Promise.all([
        fetch("http://ytdl-org.github.io/youtube-dl/download.html"),
        fetch("https://github.com/BtbN/FFmpeg-Builds/releases")
    ])
    const [yt, ffmpeg] = await Promise.all([ytPage.text(), ffmpegPage.text()])
    return layout({
        title: "Installs Needed",
        body: html`
    <div id=yt-page style="display:none;">$${yt}</div>
    <div id=ffmpeg-page style="display:none;">$${ffmpeg}</div>
    <h1>$${downloading ? "Installing dependencies..." : "Install Dependencies"}</h1>
    ${
        downloading ?
            html`<p><a href="/">When you are done installing the files (as seen in the console window)
                click here to go to the downloader!</a></p>`
        : ""
    } 
    <p>Welcome to Video Downloader! To get started we need to download some dependencies first.</p>

    <p>For this to work properly we need to download C++ package.
    <a id=microsoft-download target=_blank>Click here to download the microsoft package.</a>
    Please install it after downloading.</p>

    <p>To start downloading other dependencies click below!</p>
    <form method=post id=start-download>
        <input type=hidden name=dl>
        <input type=hidden name=ffmpeg>
        <input type=submit value="Start Downloading Dependencies">
    </form>
    <script src="/install/index.js"></script>
    `
    })
}
