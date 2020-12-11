import html, { HTML, HTMLRunnerSub } from "../../util/html.ts"

export default ({ body, title }: { body: HTMLRunnerSub, title: string }) : HTML => html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="/css/site.css">
    <title>${title}</title>
</head>
<body style="max-width: 800px; margin: auto;">
    ${body}
</body>
</html>`

