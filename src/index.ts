import { serve } from "https://deno.land/std@0.79.0/http/server.ts";
import router from "./router.ts"
import { dlPath } from "./settings.ts"
import { exists } from "https://deno.land/std/fs/mod.ts"

// deno run --allow-net --allow-run .\src\index.ts

const port = 8000
const server = serve({ port });
const url = `http://localhost:${port}/`

console.log(url)
Deno.run({cmd: ["explorer", url]})
exists(dlPath)
.then(x => {
  if (x) {
    Deno.run({cmd: [dlPath, "-U"]})
  }
})

const start = async () => {
  for await (const req of server) {
    router(req)
    .catch(x => {
      console.error(x)
      req.respond({body: "Doh!"})
    })
  }
}

start()
