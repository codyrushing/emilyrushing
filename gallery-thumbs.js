const lwip = require("lwip");
const File = require("vinyl");
const TransformStream = require("stream").Transform;
const sizeOf = require("image-size");

const path = require("path");
const paths = require("./paths");

const thumbWidth = 320;

var getThumbDimensions = function(dimensions){
  var scaleFactor = thumbWidth/dimensions.width;
  return [thumbWidth, dimensions.height * scaleFactor];
};

var imageThumbStream = new TransformStream({
  objectMode: true,
  transform(originalImage, encoding, cb){
    var self = this;
    var originalPath = originalImage.path;

    var originalImageVinyl = new File({
      path: path.basename(originalImage.path),
      contents: originalImage.contents
    });

    const type = originalImage.path.substring(originalImage.path.lastIndexOf(".")+1);
    // get size of image
    sizeOf(originalPath, function (err, dimensions) {
      // add suffix to original file with extensions
      originalImageVinyl.stem += `_${dimensions.width}x${dimensions.height}`;

      // open image from buffer
      lwip.open(originalImageVinyl.contents, type, function(err, image){

        image.batch()
          .resize(...getThumbDimensions(dimensions))
          // .crop(thumbDimensions[0]*2, thumbDimensions[1]*2)
          .toBuffer(type, function(err, buffer){
            var thumb = new File({
              path: path.basename(originalImage.path),
              contents: buffer
            });

            thumb.stem += "_thumb";

            self.push(originalImageVinyl);
            self.push(thumb);
            cb();
          });
      })

    });

  }
})

module.exports = imageThumbStream;
