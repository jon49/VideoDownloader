import { serve } from "https://deno.land/std@0.79.0/http/server.ts";
import router from "./router.ts"

// deno run --allow-net --allow-run .\src\index.ts

const port = 8000
const server = serve({ port });
const url = `http://localhost:${port}/`

console.log(url)
Deno.run({cmd: ["explorer", url]})

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
