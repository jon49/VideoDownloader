import { BufReader } from "https://deno.land/std@0.79.0/io/bufio.ts"
import { ServerRequest } from "https://deno.land/std@0.79.0/http/server.ts";
import { HTML } from "./html.ts";

var htmlHeaders = new Headers({
    "content-type": "text/html; charset=utf-8"
})

var jsonHeaders = new Headers({
})

const encoder = new TextEncoder()

export async function toHTML(req: ServerRequest, html: Promise<HTML>) {
    var buffer = new Deno.Buffer()
    var body = new BufReader(buffer)

    var h = await html
    req.respond({body, headers: htmlHeaders})
    await h.start((item: string) => buffer.write(encoder.encode(item)))
}

export const toJson = (req: ServerRequest, data: any) => {
    const json = JSON.stringify(data)
    var headers = new Headers({
        "content-type": "application/json; charset=utf-8"
    })

    req.respond({
        body: JSON.stringify(data),
        headers: jsonHeaders
    })
}

export const redirect = (req: ServerRequest, url: string) => {
    var headers = new Headers({
        "Location": url
    })
    return req.respond({ headers, status: 302 })
}
