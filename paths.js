var path = require("path");

var publicRoot = path.join(__dirname, "public"),
    srcBase = path.join(publicRoot, "src"),
    distBase = path.join(publicRoot, "dist");

module.exports = {
  srcBase: srcBase,
  distBase: distBase,
  src: {
    lib: path.join(__dirname, "node_modules"),
    styles: path.join(srcBase, "styles"),
    images: path.join(srcBase, "images"),
    app: path.join(srcBase, "app"),
    templates: path.join(srcBase, "views"),
    content: path.join(srcBase, "content")
  },
  dist: {
    css: path.join(distBase, "css"),
    images: path.join(distBase, "images"),
    js: path.join(distBase, "js")
  }
};
