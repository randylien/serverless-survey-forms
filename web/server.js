var path = require('path');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var express = require('express');
var config = require('./webpack.config');
var folder = process.env.NODE_FOLDER ? process.env.NODE_FOLDER : 'portal';

var webpackConfig = Object.create(config);
webpackConfig.entry = [
    path.resolve(__dirname, folder + '/src/entry.js'),
    'webpack-hot-middleware/client?reload=true'
];
webpackConfig.output = {
    filename: "index.js",
    path: path.resolve(__dirname, '/'),
    publicPath: 'http://localhost:8080/'
};

var app = express();
var port = 8080;
var compiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(compiler, {
	publicPath: webpackConfig.output.publicPath,
    noInfo: true,
    stats: {
        colors: true
   	}
}));
app.use(webpackHotMiddleware(compiler));
app.use('/assets', express.static(path.resolve(__dirname, 'assets')));

app.get('*', function(req, res) {
    var body = '<!doctype html>' +
        '<html lang="en">'+
        '<head>' +
        '<meta charset="utf-8" />' +
        '<title>' + folder + '</title>' +
        '<link rel="stylesheet" href="styles.css">' +
        '</head>' +
        '<body>' +
        '<div id="main"></div>' +
        '<script src="index.js"></script>' +
        '</body>'+
        '</html>';

    res.writeHead(200, {"Content-Type": "text/html"});
    res.write(body);
    res.end();
});

app.listen(port, function(error) {
    if (error) {
        console.error(error);
    } else {
        console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
    }
});
