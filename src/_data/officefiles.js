const glob = require("glob");
const fs = require("fs");
const path = require("path")
const galleryObjects = require("../js/galleryObjects")
const galleryConfig = require("./galleryConfig.json")

async function generate(eleventyConfig) {
  let files = glob.sync('**/*.docx', {ignore: galleryConfig.ignores});
  files.push(...glob.sync('**/*.doc', {ignore: galleryConfig.ignores}));
  files.push(...glob.sync('**/*.odt', {ignore: galleryConfig.ignores}));
  const coll = [];
  for(let file of files) {
    let toRoot = galleryObjects.calcToRoot(file);
    let pathbase = file.replace(/\.[^\.]*$/, "")
    const title = file.replace(/\/$/,"").replace(/^.*\//, "");
    coll.push({
      pathbase: pathbase,
      name: pathbase.replace(/^.*\//,""),
      title: title,
      toRoot: toRoot,
      src: file,
      isNotRoot: true,
    });
  }

  coll.name = "officefiles"
  return coll;
}

module.exports = generate;
