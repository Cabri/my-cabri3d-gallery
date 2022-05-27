const spawn = require('child_process').spawn
const execSync = require('child_process').execSync
const fs = require('fs')

const transformHtml = function (content, item) {
  const regexp = new RegExp(('^../' + item.toRoot).replaceAll('.','\\.'),'g');
  console.log("Regexp: " + regexp)
  return content.replace("</head>",
      `<script src='${item.toRoot}../js/cg3Display.js?version=${Date.now()}'></script></head>` )
      .replace(/href="([^"]*).cg3/g, "href=\"../$1.cg3");

}

const transform = function (input) {
  return new Promise((resolve, reject) => {
    const item = input.pagination.items[0], src = item.src,
        dst = input.page.outputPath;
    try {
      if (fs.existsSync(dst)) // no need to process?
      {
        const diff = fs.statSync(src).mtimeMs - fs.statSync(dst).mtimeMs;
        if (diff <= 0) {
          console.log("Already up-to-date " + dst)
          resolve(fs.readFileSync(dst));
          return;
        }
      }
      const fn = "../../" + item.toRoot + src,
          dstdir = dst.replace(/\/[^/]+$/, "");
      fs.mkdirSync(dstdir, {recursive:true})
      fs.copyFileSync(src, dstdir + "/" + item.filename)
      let command = `soffice`,
        args = ['--convert-to', 'html:HTML', '--headless',  item.title];
      console.log("Running in " + dstdir)
      execSync(command + " " + args.join(' '), {cwd: dstdir, stdio: "inherit"})
      const ooOutputFile = "_site/" + item.pathbase + "/" + item.name + ".html";
      const content = fs.readFileSync(ooOutputFile, "utf-8");
      resolve(transformHtml(content, item))
      fs.unlinkSync(ooOutputFile)
    } catch (err) {
      reject(err)
    }
  });
}

module.exports = function render(data) {
  return transform(data)
};
