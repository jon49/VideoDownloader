import router from "./util/router.ts"
import home from "./pages/home/index.html.ts"
import { redirect, toHTML, toJson } from "./util/http.ts"
import { getVideoName, post } from "./pages/home/commands.ts"
import { existsSync } from "https://deno.land/std/fs/mod.ts"
import { dlPath } from "./settings.ts"
import install from "./pages/install/index.html.ts"
import { startDownloadOfDependencies } from "./pages/install/commands.ts"

router
.static("static")
.get("/", req => req.url.search?.get("cmd") === "getVideoName",
    async req => {
        const data = await getVideoName(req.url.search?.get("url"))
        toJson(req.req, data)
    })
.post("/", async req => {
    post(req.data)
    return toHTML(req.req, home(req.data))
})
.get("/", req =>
    !existsSync(dlPath)
        ? redirect(req.req, "/install")
    : toHTML(req.req, home())
)
.get("/install/", req => toHTML(req.req, install()))
.post("/install/", req => {
    startDownloadOfDependencies(req.data)
    return toHTML(req.req, install(true))
})

export default router.run
