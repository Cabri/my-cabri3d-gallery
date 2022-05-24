const path = require("path")
const fs = require("fs")


let allCG3files = {};

const removeExtension = (n) => {
  return n.replace(/\.[a-z0-9]*$/, "")
}

const copy = (src, dst) => {
  console.log(`Copying ${src} to ${dst}.`)
  const srcStat = fs.lstatSync(src), dstStat = fs.existsSync(dst) && fs.lstatSync(dst);
  const dir = path.dirname(dst);
  if(!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive:true})
  if(!dstStat || srcStat.mtime !== dstStat.mtime)
    fs.copyFileSync(src, dst)
}


const galleryObjects = {

  createGalleryItemInfos: (filenames, dir, toRoot) =>
  {
    let arr = [];
    for(let f of filenames) {
      let file = dir+f;
      arr.push(galleryObjects.getGalleryItemInfo(file, toRoot))
    }
    return arr
  },
  calcToRoot: (file) => {
    let toRoot = "", p=0;
    while(p!==-1) {
      p = file.indexOf("/", p+1);
      if (p!==-1) toRoot = `../${toRoot}`;
    }
    return toRoot;
  },
  getGalleryItemInfo: (file, toRoot) => {
    let o = allCG3files[file];
    if(o) return o;
    return galleryObjects.createGalleryItemInfo(file, toRoot)
  },

  getItemType(file) {
    if(file.endsWith("/") || fs.lstatSync(file).isDirectory())
      return {name: "dir", ext: ""}
    const ext = file.replace(/.*\.([^.]+)$/,"$1").toLowerCase()
    switch(ext) {
      case "doc":
      case "docx":
      case "odt":
      case "rtf":
      case "xls":
      case "xlsx":
      case "ppt":
      case "pptx":
        return {name: "office", ext: ext}
      case "cg3":
      case "clmc":
      case "clmx":
        return {name: "figure", ext: ext}
      default:
        return {name: "unknown", ext : ""}
    }
  },

  createGalleryItemInfo(file, toRoot) {
    if(typeof(toRoot)=="undefined") toRoot=this.calcToRoot(file)
    let fileRoot = removeExtension(file);
    let name = (fileRoot.replace(/.*\//,""))
    if(name==="") name = fileRoot.replace(/.*\/([^/]+)/, "$1")
    let dir = fileRoot.replace(/\/[^\/]+/, "");
    const t = this.getItemType(file), type = t.name, ext = t.ext;

    if(type==="figure") {
      copy(file, "_site" + "/" + fileRoot + "." + ext)
    }
    let thumbPath
    if(type==="dir") thumbPath = `${toRoot}img/folder.svg`
    else if(type==="office" || type==="figure") {
      if(fs.existsSync(`src/img/${ext}.svg`))
        thumbPath = `${toRoot}img/img/${ext}.svg`
      if(fs.existsSync(`src/img/${ext}.png`))
        thumbPath = `${toRoot}img/${ext}.png`
      else thumbPath = `${toRoot}img/file.png`
    }

    if(fs.existsSync(fileRoot + ".png")) {
      if(!fs.existsSync(`_site/${dir}/`))  fs.mkdirSync(`_site/${dir}/`, {recursive:true})
      copy(fileRoot + ".png", "_site/" + fileRoot + ".png")
      thumbPath =  name + ".png";
    }

    let o = {
      file: name + "." + type.ext,
      thumbpath: thumbPath,
      name: name,
      title: name.replace(/\/$/,""),
      fileTarget: type==="dir" ? fileRoot + "index.html" :
          type === "figure" || type === "office" ? fileRoot + "/index.html" : "unknown-type",
      description: name,
    }
    allCG3files[file] = o;
    return o;

  }
}

module.exports = galleryObjects
