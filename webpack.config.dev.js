/**
 * 发布阶段的 webpack 配置项
 * 相对于开发阶段的区别在于功能开关不一样
 */
//var webpack         = require('webpack');
var glob            = require('glob'); //通配符文件列表

//var commonsPlugin   = new webpack.optimize.CommonsChunkPlugin('common.js'); //单独打包公共模块
//var uglifyJs        = new webpack.optimize.UglifyJsPlugin(); //压缩js文件

//var ignoreFiles = new webpack.IgnorePlugin(/\.\/jquery-2.1.3.min.js$/);

/**
 * 功能开关
 *  true    : 有效，主要用于开发阶段的程序调试
 *  false   : 无效，发布时将不会发布代码
 */
/*
var featureFlag = new webpack.DefinePlugin({
    __DEBUG__   : true, //调试, 如： __DEBUG__ console.log('Hi~~');
    __DEVELOP__ : true  //开发阶段, 未开发完成，不做发布的功能
});
*/

/**
 * 获得所有入口文件
 * 遍历入口 JS 文件夹，获得所有入口 JS 文件
 */
function getEntry() {
    var entry   = {};
    var pattern    = './src/js/entry';
    glob.sync(pattern+"/**/*.js").forEach(function (name) {
        var n = name.substring(pattern.length+1,name.length).replace(".js",""); // name.match(/([^/]+?)\.js/)[1];
        entry[n] = name;
    });

    return entry;


}

var webpack = {
    entry: getEntry(),
    output: {
        path     : __dirname,  //存入生成的入口.js文件的路径目录
        filename : '[name].js' // Template based on keys in entry above
    },
    //devtool: 'source-map',
    plugins: [
        //commonsPlugin,
        //uglifyJs,
        //ignoreFiles, //不打包jquery
        //featureFlag
    ],
    module: {
        loaders: [
            { test: /\.html$/, loader: 'html' }
        ]
    },
    resolve: {
        // 现在可以写 require('file') 代替 require('file.json')
        extensions: ['', '.js', '.json', '.html']
    }
};

module.exports = webpack;
