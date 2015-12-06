/**
 * File   : config.js
 * Author : FitGrace【fitingrace#gmail.com 】
 * Link   : http://www.fitgrace.com/
 * Since  : 2015-12-02
 *
 * Description【作用描述】
 *      前端构建的编译，打包时的路径配置
 *
 */

var path = {
    /* 输入路径，开发环境下的代码目录 */
    dev : {
        js   : './src/js/entry/**/*.js',
        css  : './src/scss/entry/**/*.scss',
        img  : './src/img/**/*',
        html : './../Application/Ucmm/View/**/*'
    },
    // 输出路径，发布环境下的代码目录
    min : {
        js   : './dist/js',
        css  : './dist/css',
        img  : './dist/img',
        html : './dist/view'
    },
    // see : 监听目录，开发时要监听并自动编译的目录
    see : {
        js  : './src/js/**/*',
        css : './src/scss/**/*'
    },
    // 版本号目录，用来存放编辑js, css时生成的版号信息文件
    rev : {
        js  : './dist/rev/js',
        css : './dist/rev/css',
        rev : './dist/rev/*/*.json'
    },
    // 发布时发删除的发布环境不需要的文件目录
    del : [
        './dist/js/*',
        './dist/css/*',
        './dist/rev/**/*.json'
    ],
    // 项目底层公共的js, css编译，发布目录
    util: {
        js  : './src/js/utility.js',
        css : './src/scss/utility.scss',
        min : './dist'
    },
    // 项目用到的外部插件并需要拼接的目录
    concat: {
        js: [
            './src/dep/jquery-1.11.2.min.js',
            './src/dep/cmm.js',
            './src/dep/colortip-1.0-jquery.js',
            './src/dep/artDialog/dialog-min.js',
            './src/dep/jquery-textrange.js',
            './src/dep/datetimepicker/jquery.datetimepicker.js',
            './dist/utility.js'
        ],
        css: [
            './src/dep/font-awesome.min.css',
            './src/dep/datetimepicker/jquery.datetimepicker.css',
            './dist/utility.css'
        ]
    }
}

module.exports = path;
