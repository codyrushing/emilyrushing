const path = require('path');
const glob = require('glob');
const sharp = require('sharp');

const galleryPath = path.join(__dirname, '../src/images/gallery');
const thumbWidth = 320;
const maxWidth = 2400;

glob(
  path.join(galleryPath, 'originals/*.{jpg,png,gif}'),
  (err, files) => {
    return Promise.all(
      files.map(
        file => {
          const extension = path.extname(file);
          const basename = path.basename(file, extension);
          const image = sharp(file);
          return image
            .metadata()
            .then(
              ({width, height}) => {
                const newWidth = Math.min(width, maxWidth);
                const newHeight = Math.round(height * newWidth / width);
                return Promise.all([
                  // resize to max and rename with width and height
                  image
                    .resize(newWidth, newHeight)
                    .toFile(
                      path.join(
                        galleryPath,
                        // `${basename}${extension}`
                        `${basename}_${newWidth}x${newHeight}${extension}`
                      )
                    ),
                  // resize and rename to _thumb
                  image
                    .resize(thumbWidth)
                    .toFile(
                      path.join(
                        galleryPath,
                        `${basename}_thumb${extension}`
                      )
                    )
                ])
              }
            );
        }
      )
    );
  }
);
