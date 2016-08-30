const assemble = require("assemble");
const gulpPlugins = require("gulp-load-plugins")();
const Handlebars = require("engine-handlebars").Handlebars;

const path = require("path");
const paths = require("./paths.js");

const constants = require("./constants");

var app = assemble();
var helpers;

// init "pages" collection
app.create("pages", {
  layout: "default"
});

// register our custom helpers on assemble app instance
helpers = require(path.join(paths.src.templates, "helpers"))(Handlebars);
Object.keys(helpers).forEach(function(key){
  app.helper(key, helpers[key]);
});

// add markdown helpers
app.helper("markdown", require("helper-markdown"));
app.asyncHelper("md", function(name, options, cb){
  // markdown helpers will inherit layout from its parent page, which is not what we want
  // so force all external markdown to have no layout
  this.context.layout = null;
  // also, make paths relative to our content directory
  name = path.join(paths.src.content, name);
  return require("helper-md").apply(this, arguments);
});

// make site constants available on rendering context
app.data(Object.assign({}, constants, {
  navPages: [
    {
      name: "about",
      title: "About"
    },
    {
      name: "media",
      title: "Photos + Video"
    },
    {
      name: "work",
      title: "Work"
    },
    {
      name: "contact",
      title: "Contact"
    }
  ]
}));

app.task("load", function(done) {
  app.partials(path.join(paths.src.templates, "partials", "**/*.hbs"));
  app.layouts(path.join(paths.src.templates, "layouts", "**/*.hbs"));
  app.pages(path.join(paths.src.templates, "pages", "**/*.hbs"));
  done();
});

app.task("default", ["load"], function(){
  return app.toStream("pages")
    .pipe(app.renderFile())
    .pipe(gulpPlugins.rename({
      extname: ".html"
    }))
    .pipe(gulpPlugins.if(!constants.IS_DEVELOPMENT, gulpPlugins.htmlmin({collapseWhitespace: true})))
    .pipe(app.dest(paths.distBase))
})

module.exports = app
