const path = require('path');
const port = 3030;
const fs = require('fs');
const compression = require('compression');
const express = require('express');
const app = express();

const config = require('./utils/config');
const { VIEWS_PATH, PUBLIC_PATH } = config;
const timestamp = Date.now();

const exphbs  = require('express-handlebars');
const hbs = exphbs.create({
  helpers: require('./utils/template-helpers'),
  extname: '.hbs',
  defaultLayout: 'default',
  viewsDir: VIEWS_PATH,
  layoutsDir: path.join(VIEWS_PATH, '_layouts'),
  partialsDir: path.join(VIEWS_PATH, '_partials')
});

app.enable('view cache');
app.engine('hbs', hbs.engine);
app.set('views', VIEWS_PATH);
app.set('view engine', 'hbs');

app.use(compression());

const pages = require('./utils/build-page-tree');
pages.forEach(
  page => {
    app.get(
      `/${page.route}`,
      (req, res, next) => res.render(page.template, {
        ...config,
        ...page.metadata,
        pages,
        timestamp
      })
    );
  }
);

app.use(
  express.static( path.join(__dirname, PUBLIC_PATH) )
);

app.listen(port, err => {
  if(err) throw err;
  console.log(`Server listening on port ${port}`);
});
