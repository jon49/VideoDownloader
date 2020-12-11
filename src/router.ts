import router from "./util/router.ts"
import home from "./pages/home/index.html.ts"
import { toHTML, toJson } from "./util/http.ts"
import { getVideoName, post } from "./pages/home/commands.ts"

router
.static("src/static")
.get("/", req => req.url.search?.get("cmd") === "getVideoName",
    async req => {
        const data = await getVideoName(req.url.search?.get("url"))
        toJson(req.req, data)
    })
.post("/", async req => {
    await post(req.data)
    return toHTML(req.req, home(req.data))
})
.get("/", req => toHTML(req.req, home()))

export default router.run
