const path = require('path');
const glob = require('glob');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminSvgo = require('imagemin-svgo');

const src = 'src';
const dest = 'public';

const plugins = [
  imageminMozjpeg({optimizationLevel: 4}),
  imageminPngquant({ quality: 70 }),
  imageminGifsicle({optimizationLevel: 4}),
  imageminSvgo(),
];

glob(
  path.join(src, '/images/**/*.{jpg,gif,png,svg}'),
  (err, files) => {
    if(err) throw err;
    return Promise.all(
      files.map(
        file => {
          imagemin(
            [file],
            path.dirname(
              path.join(dest, path.relative(src, file))
            ),
            {
              plugins
            }
          )
        }
      )
    );
  }
);
