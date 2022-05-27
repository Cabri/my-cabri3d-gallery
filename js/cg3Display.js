function initCG3Links() {
  let links = document.querySelectorAll("a[href$='.cg3']")
  for(let link of links) {
    link.addEventListener("click", startCG3);
  }
}

let openedToDisplay = null;
let scripts = document.getElementsByTagName( "script" );
let lastScript = scripts[scripts.length - 1];
const playerJS = "https://gallery.cabri.com/phs-player/main.js"
const playerURL = lastScript ? lastScript.src
        .replace("js/cg3Display.js", "players/cg3player.html")
    : playerJS.replace(/main.js$/, ""),
  version = "2022-05-27";
window.addEventListener("load", initCG3Links);

function startCG3(evt) {
  unloadCG3Player();
  let elt = evt.target;
  let img, cg3Url;
  if(elt.tagName !== "A") {
    img = elt;
    elt = elt.closest("a")
  } else {
    img = elt.querySelector("img")
  }
  cg3Url = elt.href
  if(elt.tagName === "BODY") {
    console.log("Not in a link. Doing nothing.");
    return;
  }

  // start
  if(img.tagName === "IMG") {
    let iframe = document.createElement("iframe");
    openedToDisplay = iframe;
    iframe.id = "cabri3dFigure";
    iframe.style.width =  img.clientWidth + "px";
    iframe.style.height = img.clientHeight + "px";
    img.style.display = "none";
    //iframe.setAttribute("src", "https://gallery.cabri.com/phs-player/?cg3=" +
    //    escape(elt.href));
    elt.appendChild(iframe);
    iframe.setAttribute("name", "cabri3dFigure");
    iframe.setAttribute("frameBorder", "0")
    iframe.contentWindow.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Cabri 3D</title>
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <script>
          window.urlToLoad = "${elt.href}";
          window.cabriConfig = {noToolbar: true, withDevFps:false};
        </script>
        </head><body><script src="${playerJS}?version=${version}"></script></body></html>
      `)
  } else if (cg3Url) { // in case it's an A
    url = `${playerURL}/?version=${version}&cg3=${escape(cg3Url)}`
    console.log(`Opening URL ${url} in frame cg3Display.`)
    window.open(url, 'cg3Display')
  }


  evt.preventDefault();
  return false;

}

function unloadCG3Player() {
  if(!openedToDisplay) return;

  // clean-up if still displaying
  if(openedToDisplay) {
    let parent = openedToDisplay.parentNode;
    let c = parent.querySelector("iframe")
    if(c) c.remove();
    c = parent.querySelector("img")
    if(c) c.style["display"] = "block"
  }
  openedToDisplay = null;
}
