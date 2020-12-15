import { getData, HomeModel } from "../../settings.ts"
import html, { HTMLRunnerSub } from "../../util/html.ts"
import layout from "../shared/layout.html.ts"

const errorView = (err: HTMLRunnerSub) => html`<p>${err}</p>`
const downloadFormId = "download"
const checked = (b: boolean) => b ? "checked" : ""

export default async (data?: HomeModel) => {

const videosAreDownloadingMessage = !!data
const m = data ?? await getData()

return layout({
    title: "Download Videos",
    body: html`
<h1>Download Videos</h1>

${ html`<p>Videos are downloading.</p>` }
<div id=errors>${m.errors?.map(errorView)}</div>
<template id=error>${errorView("")}</template>

<form method=post id=${downloadFormId}>
    <fieldset required>
        <legend>What format would you like to download?</legend>
        <input type=radio id=lqytmp3 name=format value=lqytmp3 $${checked(m.format === "lqytmp3")} required>
            <label for=lqytmp3 required>Low Quality MP3 YouTube</label><br>
        <input type=radio id=hqytmp3 name=format value=hqytmp3 $${checked(m.format === "hqytmp3")} required>
            <label for=hqytmp3 required>High Quality MP3 YouTube</label><br>
        <input type=radio id=hqyt name=format value=hqyt $${checked(m.format === "hqyt")} required>
            <label for=hqyt required>High Quality Video YouTube</label><br>
    </fieldset>
    <br>
    <fieldset id=urls>
        <legend>Video URLs to Download</legend>
        <label data-root>
            Link:&nbsp;
            <input type=url name=urls><button data-action=remove>&nbsp;X&nbsp;</button><span data-video-name style="white-space: nowrap;"></span>
            <br>
        </label>
    </fieldset>
    <br>
    <label>
        Target Directory:&nbsp;
        <input type=text name=targetDirectory value="${m.targetDirectory}" required>
    </label>
    <br><input id=submit type=submit value="Start Download">
</form>
${
    m.urls?.length === 0 ? "" : html`
    <br>
    <hr>
    <form id=previousVideos>
        <h2>Previously Downloaded URLs</h2>
        ${m.urls?.map(x => html`<p>${x}</p>`)}
        <button>Restore Previous Urls</button>
    </form>`
}

<script src="/index.js"></script>

`})

}
