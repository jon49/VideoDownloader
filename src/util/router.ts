import { ServerRequest } from "https://deno.land/std@0.79.0/http/server.ts";
import staticHandler from "./router/static-handler.ts"

type Method = "POST" | "GET" | "PATCH" | "DELETE"

type Handler = (req: RouteRequest) => Promise<void>
type Guard = (req: RouteRequest) => boolean

interface RouteInternal {
    method : Method
    route?: RegExp
    guard?: Guard | undefined
    handler: Handler
}

export interface RouteRequest {
    url: { path: string, search?: URLSearchParams }
    data: any
    req: ServerRequest
}

const routeList : RouteInternal[] = []


interface RouteHandler {
    (route: string, guard: Guard, handler: Handler) : Router
    (route: string, handler: Handler) : Router
}

interface Router {
    post: RouteHandler
    get: RouteHandler
    patch: RouteHandler
    delete: RouteHandler
    run: (req: ServerRequest) => Promise<void>
    static: (staticDir: string) => Router
}

function createRoute(method: Method, ...args: (string | Guard | undefined | Handler)[]) {
    const route = <string>args[0]
    const guard = <Guard | undefined>(args.length === 3 ? args[1] : undefined)
    const handler = <Handler>(args.length === 3 ? args[2] : args[1])
    routeList.push({
        guard,
        handler,
        method,
        route: new RegExp(`^${route}$`),
    })
}

function isFile(url: string) {
    const len = url.length
    // Only grab the last for characters to determine if it
    // is a file. Start at least one in.
    for (var i = len - 3; i > len - 6 || i === 0; i--) {
        var c = url[i]
        if (c === "/") return false
        if (c === ".") return true
    }
    return false
}

function createStaticRoute(staticDir: string) {
    routeList.push({
        // Just need to check for the last slash since the clean URL adds a
        // slash if it is not a file
        guard: req => req.url.path[req.url.path.length - 1] !== "/",
        handler: req => staticHandler(req, staticDir),
        method: "GET",
    })
}

const parseParams = (params: URLSearchParams | undefined) => {
    const obj : any = {};
    if (!params) return obj
    // iterate over all keys
    for (const key of (<Set<string>>new Set((<any>params).keys()))) {
        if (params.getAll(key).length > 1) {
            obj[decodeURIComponent(key)] = params.getAll(key).map(decodeURIComponent)
        } else {
            var val = params.get(key)
            obj[decodeURIComponent(key)] = val ? decodeURIComponent(val) : val
        }
    }
    return obj;
}

var cleanUrl = (url: string) : [URLSearchParams | undefined, string] => {
    var queryIdx = url.indexOf("?")
    var search = queryIdx === -1 ? undefined : new URLSearchParams(url.slice(queryIdx) + 1)
    var url_ = queryIdx === -1 ? url : url.slice(0, queryIdx)
    if (!isFile(url_)) {
        url_ = url_[url_.length - 1] === "/" ? url_ : url_ + "/"
    }
    return [search, url_]
}

const run = async (req: ServerRequest) => {
    console.log(req.method, req.url)
    const [search, url] = cleanUrl(req.url)
    var contentType
    var data

    if ("GET" === req.method) {
        data = parseParams(search)
    }

    if ((["POST", "DELETE", "POST"] as Method[]).includes(req.method as Method) && (contentType = req.headers.get("content-type"))) {
        const decoder = new TextDecoder()
        const body = decoder.decode(await Deno.readAll(req.body))
        if (body.length > 0) {
            if (contentType.includes("application/json")) {
                data = JSON.parse(body)
            } else if (contentType.includes("application/x-www-form-urlencoded")) {
                data = parseParams(new URLSearchParams(body))
            } else {
                console.error(`The content type "${contentType}" is not accounted for.`)
            }
        }
    }

    const request : RouteRequest = {
        req,
        url: { search, path: url },
        data
    }

    // const debug = (x: RouteInternal) => console.log(x.method, x.method === req.method, x.route, x.route?.test(url), x.guard, x.guard && x.guard(request))
    const route = routeList.find(
        x => (
            x.method === req.method
        && (x.route?.test(url) ?? true)
        && (x.guard ? x.guard(request) : true)))

    if (route) {
        route.handler(request)
        .catch(x => req.respond({body: `<h1>Oops! Something happened that shouldn't have!</h1><p>${JSON.stringify(x)}</p>`}))
    } else {
        req.respond({ body: "<h1>Not found!<h1>" })
    }
}

const router : Router = {
    post: (...args: any[]) => (createRoute("POST", ...args), router),
    get: (...args: any[]) => (createRoute("GET", ...args), router),
    patch: (...args: any[]) => (createRoute("PATCH", ...args), router),
    delete: (...args: any[]) => (createRoute("DELETE", ...args), router),
    static: (staticDir: string) => (createStaticRoute(staticDir), router),
    run,
}

export default router
