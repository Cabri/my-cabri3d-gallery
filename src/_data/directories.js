const glob = require("glob");
const fs = require("fs");
const path = require("path")
const cg3Objects = require("../js/galleryObjects")
const galleryConfig = require("./galleryConfig.json")



async function generateDirectories(eleventyConfig) {
  let dirs = glob.sync('**/', {ignore: galleryConfig.ignores});
  dirs.push("")
  const coll = [];
  for(let dir of dirs) {
    let toRoot = cg3Objects.calcToRoot(dir);
    let children = [];
    for(let g of galleryConfig.children) {
      children.push(...glob.sync(g, {cwd: dir, ignore: galleryConfig.ignores}));
    }
    children = children.sort()
    children = cg3Objects.createGalleryItemInfos(children, dir, toRoot)

    const title = dir ===""? path.basename(process.cwd()) :
        dir.replace(/\/$/,"").replace(/^.*\//, "");
    coll.push({
      //thumbpath: "", (would be with the convention of a png aside)
      name: dir,
      title: title,
      toRoot: toRoot,
      toRoot1: toRoot.substring(0, toRoot.length-1),
      children : children,
      isNotRoot: dir!=="",
      permalink: dir,
      eleventyNavigation: {key: dir}
    });
  }

  coll.name = "directories"
  return coll;
}

module.exports = generateDirectories;
