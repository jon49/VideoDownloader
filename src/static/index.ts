/// <reference path="../@types/lib.dom.d.ts" />

// @ts-ignore
(function() {

const $form = <HTMLFormElement> document.getElementById("download")

$form.addEventListener("click", e => {
    var $button
    if (($button = e.target) instanceof HTMLButtonElement && $button.dataset.action === "remove") {
        e.preventDefault()
        var $urls = <HTMLInputElement[]>Array.from($form.querySelectorAll("[name=urls]"))
        if ($urls.length > 1) {
            var numberOfEmpties = $urls.reduce((acc, val) => val.value.length === 0 ? acc + 1 : acc, 0)
            var $root = $button.closest("[data-root]")
            if (!($root?.querySelector("input")?.value.length === 0 && numberOfEmpties === 1)) $root?.remove()
        }
    }
})

$form.addEventListener("change", e => {
    var input : any
    if ((input = e.target) instanceof HTMLInputElement
        && input.name === "urls") {

        if (input.value.length > 0) {
            const parent = input.parentElement
            if (!parent) return
            const urls = <HTMLInputElement[]>Array.from($form.querySelectorAll("[name=urls]"))
            if (!urls.find(x => x.value.length === 0)) {
                const $url = <HTMLElement>parent.cloneNode(true)
                if ($url) {
                    const $input = $url.querySelector("input")
                    if ($input) $input.value = ""
                    document.getElementById("urls")?.append($url)
                }
            }

            var url = input.value
            fetch(`/?cmd=getVideoName&url=${encodeURI(url)}`)
                .then(x => x.json())
                .then(x => {
                    if (input.value.length) {
                        var $span = parent.querySelector("[data-video-name]")
                        if ($span) {
                            $span.textContent = x.name
                            $span.setAttribute("title", x.name)
                        }
                    }
                })
                .catch(x => {
                    console.error(x)
                    var template = <HTMLTemplateElement | null>document.getElementById("error")
                    if (!template) return
                    var $error = template.content.cloneNode(true)
                    $error.textContent = x
                    var $errors = document.getElementById("errors")
                    if ($errors) {
                        $errors.innerHTML = ""
                        $errors.appendChild($error)
                    }
                })
        } else {
            var videoName = input?.parentElement?.querySelector("[data-video-name]")
            if (videoName) videoName.textContent = ""
        }
    }
})

const $previousVideos = <HTMLFormElement>document.getElementById("previousVideos")
$previousVideos.addEventListener("submit", e => {
    e.preventDefault()
    var $urls = <HTMLFieldSetElement>document.getElementById("urls")
    var $url = <HTMLLabelElement>$urls.querySelector("[data-root]")
    if (!$url) return
    var $updatedItems =
        Array.from($previousVideos.querySelectorAll("p"))
        .map(x => {
            var $clone = <typeof $url>$url.cloneNode(true)
            var $input = <HTMLInputElement>$clone.querySelector("input")
            $input.value = x.textContent ?? ""
            return $clone
        })
    $urls.prepend($updatedItems.reduce((acc, val) => (val && acc.appendChild(val), acc) , document.createDocumentFragment()))
    for (var $item of $updatedItems) {
        $item.querySelector("input")?.dispatchEvent(new Event("change", { bubbles: true }))
    }
    // @ts-ignore
    $previousVideos.removeEventListener("submit", this)
    $previousVideos.remove()
})

}());
