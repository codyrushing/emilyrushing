const fs = require('fs');
const path = require('path');
const { VIEWS_PATH } = require('./config');
const matter = require('gray-matter');

const pages = [];

const hbsRegex = /.hbs$/;

const root = path.join(__dirname, '../');

const traverse = (dir, base=root) => {
  const fullDirectoryPath = path.join(base, dir);
  fs.readdirSync(fullDirectoryPath).forEach(
    page => {
      if(page.charAt(0) === '_'){
        return;
      }
      const fullPagePath = path.join(fullDirectoryPath, page);
      const stats = fs.statSync( fullPagePath );
      if(stats.isDirectory()){
        return traverse(page, fullDirectoryPath);
      }
      if(stats.isFile() && hbsRegex.test(page)){
        let template = path.relative(
          path.join(root, VIEWS_PATH),
          fullPagePath
        );
        pages.push({
          template,
          route: template
            .replace(hbsRegex, '') // remove extension
            .replace(/index$/, '') // remove index
            .replace(/\/$/, ''), // remove trailing slash
          metadata: matter.read(fullPagePath, {delims: ['{{!--', '--}}']}).data
        });
      }
    }
  );
};

traverse(VIEWS_PATH);
module.exports = pages.sort(
  (a,b) => (a.metadata.pageIndex || 0) - (b.metadata.pageIndex || 0)
);
