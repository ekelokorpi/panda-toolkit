require(process.cwd() + '/src/game/config.js');
pandaConfig = pandaConfig || {};
var mediaFolder = pandaConfig.mediaFolder || 'media';

console.log('Compressing image files...'.title);

var Imagemin = require('imagemin');

var imagemin = new Imagemin()
    .src(mediaFolder + '/*.{gif,jpg,png,svg}')
    .dest(mediaFolder + '/')
    .use(Imagemin.jpegtran({ progressive: true }))
    .use(Imagemin.optipng({ optimizationLevel: 3 }));

imagemin.run(function (err, files) {
    if (err) throw err;

    console.log('Compressed ' + (files.length.toString()).number + ' images.');
});
