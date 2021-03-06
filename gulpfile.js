'use strict';

/**
 * File   : gulpfile.js
 * Author : FitGrace【fitingrace@gmail.com 】
 * Link   : http://www.fitgrace.com/
 * Since  : 2015-12-02
 *
 * Description【作用描述】
 *      gulp 各项配置
 *
 */


// 首先要全局安装一次
const gulp             = require('gulp');

// 编译js
const webpack          = require('webpack-stream');
// 开发阶段 webpack 配置文件
const webpackConfigDev = require('./webpack.config.dev');
// 发布阶段 webpack 配置文件
const webpackConfigMin = require('./webpack.config.min');

// JS校验
const eslint           = require('gulp-eslint')

// JS 压缩
const uglify           = require('gulp-uglify');

// 编译 scss 成为 css 文件
const sass             = require('gulp-sass');

// 生成 source map
const sourcemaps       = require('gulp-sourcemaps');

// 压缩 css
const minifycss        = require('gulp-minify-css');

// 文件合并
const concat           = require('gulp-concat');

// 压缩图片
const imagemin         = require('gulp-imagemin');

// 对文件名加MD5后缀
const rev              = require('gulp-rev');
// 路径替换
const revCollector     = require('gulp-rev-collector');

// 压缩html
const minifyHTML       = require('gulp-minify-html');

// 删除文件
const gulpClean        = require('gulp-clean');

// 配置文件
const config           = require('./config.js');

/**
 * 删除目录
 */
function clean(callback){
    gulp.src(config.del, {read: false})
        .pipe(gulpClean())
        // 结束
        .on('finish', callback);
}

/**
 * JS 语法检查
 */
function syntaxJavascript(callback) {
    gulp.src(config.dev.js)
        // js代码检验
        .pipe(eslint('.eslintrc.js'))
        // 把检测结果输出到console
        .pipe(eslint.format())
        // 结束
        .on('finish', callback);
}

/**
 * 预编译js到dev
 */
function compileJavascript(callback) {
    gulp.src(config.dev.js)
        // webpack 编译
        .pipe(webpack(webpackConfigDev))
        // 输出文件到指定目录
        .pipe(gulp.dest(config.min.js))
        .on('finish', callback);
}

/**
 * 发布JS到上线环境目录
 */
function releaseJavascript(callback) {
    gulp.src(config.dev.js)
        // webpack 编译
        .pipe(webpack(webpackConfigMin))
        // 压缩JS文件
        .pipe(uglify())
        // 输出文件到指定目录
        .pipe(gulp.dest(config.min.js))
        .on('finish', callback);
}

/**
 * CSS 语法检查
 */
function syntaxCss(callback) {
}

/**
 * 预编译css（如sass）到dev
 */
function compileCss(callback) {
    gulp.src(config.dev.css)
        // 生成sourcemaps
        .pipe(sourcemaps.init())
        /**
         * 编译sass
         * nested：嵌套缩进的css代码，它是默认值。
         * expanded：没有缩进的、扩展的css代码。
         * compact：简洁格式的css代码。
         * compressed：压缩后的css代码。
         */
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        // 保存map文件到指定的目录
        .pipe(sourcemaps.write('map'))
        // 保存文件到指定的目录
        .pipe(gulp.dest(config.min.css))
        // 结束
        .on('finish', callback);
}

/**
 * 发布css到上线环境目录
 */
function releaseCss(callback) {
    gulp.src(config.dev.css)
        // 编译sass
        .pipe(sass({ outputStyle: 'expanded' }))
        // 压缩样式文件
        .pipe(minifycss())
        // 保存文件到指定的目录
        .pipe(gulp.dest(config.min.css))
        // 结束
        .on('finish', callback);
}

/**
 * IMG 图片压缩
 */
function compressionImage(callback) {
    gulp.src(config.dev.img)
        // 压缩图片
        .pipe(imagemin({
            optimizationLevel: 5, // 类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, // 类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, // 类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true // 类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        // 保存文件到指定的目录
        .pipe(gulp.dest(config.min.img))
        // 结束
        .on('finish', callback);
}

/**
 * 从src拷贝html到dev
 */
function copyHtml(callback) {
    gulp.src(config.dev.html)
        // 保存文件到指定的目录
        .pipe(gulp.dest(config.min.html))
        // 结束
        .on('finish', callback);
}

/**
 * 对dev下面的JS进行md5
 */
function reversionJavascript(callback) {
    gulp.src(config.md5.js)
        // 给文件名加MD5后缀
        .pipe(rev())
        // 保存文件到指定的目录
        .pipe(gulp.dest(config.min.js))
        // 生成一个rev-manifest.json
        .pipe(rev.manifest())
        // 输出rev-manifest.json 文件到指定目录
        .pipe(gulp.dest(config.rev.js))
        // 结束
        .on('finish', callback);
}

/**
 * 对dev下面的CSS进行md5
 */
function reversionCss(callback) {
    gulp.src(config.md5.css)
        // 给文件名加MD5后缀
        .pipe(rev())
        // 保存文件到指定的目录
        .pipe(gulp.dest(config.min.css))
        // 生成一个rev-manifest.json
        .pipe(rev.manifest())
        // 输出rev-manifest.json 文件到指定目录
        .pipe(gulp.dest(config.rev.css))
        // 结束
        .on('finish', callback);
}

/**
 * 替换dev下html中js/css进行过md5之后的文件路径，并拷贝到dist
 */
function replcae(callback) {
    gulp.src([config.rev.rev, config.md5.html])
        // 执行目录内文件名的替换
        .pipe(revCollector())
        // 输出替换后的文件到指定目录
        .pipe(gulp.dest(config.min.html))
        // 结束
        .on('finish', callback);
}

gulp.task('clean', gulp.parallel(clean));

gulp.task('sass', gulp.parallel(compileCss));

gulp.task('mincss', gulp.parallel(releaseCss));

gulp.task('minimg', gulp.parallel(compressionImage));

gulp.task('devjs', gulp.parallel(compileJavascript));
gulp.task('minjs', gulp.parallel(releaseJavascript));

gulp.task('lintjs', gulp.parallel(syntaxJavascript));

gulp.task('revjs', gulp.parallel(reversionJavascript));
gulp.task('revcss', gulp.parallel(reversionCss));

gulp.task('chtml', gulp.parallel(copyHtml));

gulp.task('rep', gulp.parallel(replcae));

/**
 * series 任务是顺序执行的
 * parallel 任务是同步执行的
 */

/*
gulp.task('dist', gulp.series(
    gulp.parallel(
        gulp.series(
            cleanDev,
            gulp.parallel(
                gulp.series(
                    sprite,
                    compileCss
                    ),
                compileJs,
                copyHtml
                )
            ),
        cleanDist
        ),
    reversion,
    replcae
));
*/
