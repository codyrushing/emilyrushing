const path = require('path');
const fs = require('fs');
const util = require('util');
const globby = require('globby');
const Parcel = require('parcel-bundler');

const unlink = util.promisify(fs.unlink);
const publicDir = 'assets/dist';

const bundlers = [
  new Parcel(
    path.join(__dirname, 'src/styles/index.less'),
    {
      outDir: publicDir
    }
  ),
  new Parcel(
    path.join(__dirname, 'src/js/index.js'),
    {
      outDir: publicDir,
      outFile: 'app.js'
    }
  )
];

(async function(){
  try {
    const existingFiles = await globby(`${publicDir}/*.{html,js,css,map}`);

    // clean existing files
    await Promise.all(
      existingFiles.map(
        async (file) => await unlink(file)
      )
    );

    for(var i=0; i<bundlers.length; i++){
      await bundlers[i].bundle();
    }
  }
  catch(err) {
    console.error(err);
  }
})();
