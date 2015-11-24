var gulp            = require('gulp'); // 首先要全局安装一次
var webpack         = require('gulp-webpack'); //首先要全局安装一次
var webpackConfigDev= require('./webpack.config.dev'); // 开发阶段webpack 配置文件
var webpackConfigMin= require('./webpack.config.min'); // 发布阶段webpack 配置文件
var jshint          = require('gulp-jshint'); // JS校验
var uglify          = require('gulp-uglify'); // JS 压缩
var sass            = require('gulp-sass'); // 编译 scss 成为 css 文件
var autoprefixer    = require('gulp-autoprefixer'); // 编译scss时自动补全后缀
var sourcemaps      = require('gulp-sourcemaps'); // 生成scss source map
var minifycss       = require('gulp-minify-css'); // 压缩 css
var imagemin        = require('gulp-imagemin'); // 压缩图片
var livereload      = require('gulp-livereload'); // 自动刷新
var clean           = require('gulp-clean'); // 清除文件
var notify          = require('gulp-notify'); // 发送消息
var rev             = require('gulp-rev'); //- 对文件名加MD5后缀
var revCollector    = require('gulp-rev-collector'); //- 路径替换

/**
 * 路径配置
 *  dev : 入口，输入路径
 *  min : 出口，输出路径
 */
var path = {
    // 开发环境
    dev: {
          js: './src/js/entry/**/*.js',
         css: './src/scss/*.scss',
         img: './src/img/*/*',
        html: './../Application/Ucmm/View/**/*'
    },
    // 发布环境
    min: {
          js: './../Public/cmm_js',
         css: './../Public/cmm_css',
         img: './../Public/img',
        html: './../Application/Ucmm/View'
    },
    // 监听目录
    see: {
         js: './src/js/**/*',
        css: './src/scss/**/*'
    },
    // 版本号目录
    rev: {
         js: './dist/rev/js',
        css: './dist/rev/css',
        rev: './dist/rev/*/*.json'
    },
    // 删除目录文件
    del: {
         js: './../Public/cmm_js/*',
        css: './../Public/cmm_css/*',
        rev: './dist/rev/*/*.json'
    }
};

/**
 * JS 任务 - 开发阶段
 * 通过 jshint 检查 js 代码中错误和潜在问题
 */
gulp.task('jshint', function() {
    return gulp.src(path.dev.js)
    // js代码检验
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
});

/**
 * JS 任务 - 开发阶段
 * 通过 webpack 编译 js 文件
 **/
gulp.task('webpack', function() {
    return gulp.src(path.dev.js)
    // js代码检验
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    // webpack 编译
    .pipe(webpack(webpackConfigDev))
    // 输出文件到指定目录
    .pipe(gulp.dest(path.min.js));
});

/**
 * JS 任务 - 发布阶段
 * js代码压缩
 */
gulp.task('minJS', function() {
    return gulp.src(path.dev.js)
    // webpack 编译
    .pipe(webpack(webpackConfigDev))
    //- 压缩JS文件
    .pipe(uglify())
    //- 输出文件到指定目录
    .pipe(gulp.dest(path.min.js))
});

/**
 * JS 任务 - 发布阶段
 * js代码压缩
 */
gulp.task('packJS', function() {
    return gulp.src(path.dev.js)
    //- webpack打包
    .pipe(webpack(webpackConfigMin))
    //- 压缩JS文件
    .pipe(uglify())
    //- 给文件名加MD5后缀
    .pipe(rev())
    //- 输出文件到指定目录
    .pipe(gulp.dest(path.min.js))
    //- 生成一个rev-manifest.json
    .pipe(rev.manifest())
    //- 输出rev-manifest.json 文件到指定目录
    .pipe(gulp.dest(path.rev.js));
});

/**
 * sass任务 - 开发阶段
 * 编译sass、自动添加css前缀
 */
gulp.task('sass', function() {
    return gulp.src(path.dev.css)
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
        style: 'expanded'
    }))
    //添加前缀
    //.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    //保存map文件到指定的目录
    .pipe(sourcemaps.write('map'))
    //保存文件到指定的目录
    .pipe(gulp.dest(path.min.css));
});

/**
 * CSS任务 - 发布阶段
 * 压缩CSS
 */
gulp.task('minCSS', function() {
    return gulp.src(path.dev.css)
    //- 编译sass
    .pipe(sass({ style: 'expanded' }))
    //- 压缩样式文件
    .pipe(minifycss())
    //- 保存文件到指定的目录
    .pipe(gulp.dest(path.min.css))
});

/**
 * CSS任务 - 发布阶段
 * 压缩CSS
 */
gulp.task('packCSS', function() {
    return gulp.src(path.dev.css)
    //- 编译sass
    .pipe(sass({ style: 'expanded' }))
    //- 压缩样式文件
    .pipe(minifycss())
    //- 给文件名加MD5后缀
    .pipe(rev())
    //- 保存文件到指定的目录
    .pipe(gulp.dest(path.min.css))
    //- 生成一个rev-manifest.json
    .pipe(rev.manifest())
    //- 输出rev-manifest.json 文件到指定目录
    .pipe(gulp.dest(path.rev.css));
});

/**
 * 图片压缩任务 - 发布阶段
 * 将指定目录的图片进行压缩后保存到指定目录
 */
gulp.task('packIMG', function() {
    return gulp.src(path.dev.img)
    //压缩图片
    .pipe(imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
    }))
    //保存文件到指定的目录
    .pipe(gulp.dest(path.min.img));
});

/**
 * 版本号任务 - 发布阶段
 * 将指定目录的文件生成一个带有 MD5 版本号的文件
 */
gulp.task('rev', function() {
    return gulp.src([path.rev.rev, path.dev.html])
    //- 执行目录内文件名的替换
    .pipe(revCollector())
    //- 输出替换后的文件到指定目录
    .pipe(gulp.dest(path.min.html));
});

/**
 * 清除任务 - 发布阶段
 * 清除目的地目录并重建档案
 */
gulp.task('clean', function() {
    return gulp.src([
        path.del.js,
        path.del.css,
        path.del.rev
        ], {read: false})
    .pipe(clean());
});

/**
 * 监听任务 - 开发阶段
 * 开发中，监听JS CSS 的改动，及时进行编译
 */
gulp.task('watch', function() {
    // 监听webpack
    gulp.watch(path.see.js, function(){
        gulp.run('webpack');
    });
    // 监听SCSS
    gulp.watch(path.see.css, function(){
        gulp.run('sass');
    });
});

/**
 * 打包所有开发文件
 * 开发完成后，操作本步骤准备所有资源文件
 */
gulp.task('pack', ['clean'], function() {
    //gulp.start('packJS', 'packCSS', 'packIMG');
    gulp.run('packJS');
    gulp.run('packCSS');
    gulp.run('packIMG');
});

/**
 * 更新版本号
 * 操作完本步骤然后提交上线代码
 */
gulp.task('bundle', ['clean', 'packJS', 'packCSS', 'packIMG'], function() {
    gulp.run('rev');
});
