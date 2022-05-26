const env = 'dev'

const 
{src, dest, series,watch} = require('gulp')
,clean = require('gulp-clean')
,twig = require('gulp-twig')
,named = require('vinyl-named')
,sass = require('gulp-dart-sass')
,webpackStream = require('webpack-stream')
,browserSync = require('browser-sync').create()
,pages = require('./pages.config')
,scssPages = []
,jsPages = []

function pushPagesConfig() {
    pages.filenames.forEach(filename => {
        scssPages.push(`src/${filename}.scss`)
        jsPages.push(`src/${filename}.js`)
    })
}

pushPagesConfig()

const configs = {
    dist: 'dist',
    src: 'src',
    views:{
        ext: '.twig',
        baseDir: 'src/'
    },
    scss:{
        files: scssPages
    },
    javascripts:{
        files: jsPages
    }
}

function Clean(){
    return src(configs.dist).pipe(clean({read:false, allowEmpty: false}));
}

function Views(){
    return new Promise((resolve,reject) => {
        src(`${configs.src}/**/[^_]*${configs.views.ext}`)
        .pipe(twig({
            base: configs.views.baseDir
        }))
        .pipe(dest(configs.dist))
        .on('error', reject)
        .on('end', resolve)
    })
}

function Sass(){
    return new Promise((resolve,reject)=>{
        src(configs.scss.files)
        .pipe(sass({
            sourceComments:false,
            outputStyle: (env == 'dev' || env == 'development') ? 'expanded' : 'compressed',
        }).on('error', sass.logError))
        .pipe(dest(`${configs.dist}/`))
        .on('error', reject)
        .on('end', resolve)
    })
}

function Javascripts(){
    return new Promise((resolve,reject)=>{
        src(configs.javascripts.files)
        .pipe(named())
        .pipe(webpackStream({
            mode: (env == 'dev' || env == 'development') ? 'development' : 'production',
        }))
        .pipe(dest('dist/'))
        .on('error', reject)
        .on('end', resolve)
    })
}
exports.clean = Clean
exports.views = Views
exports.sass = Sass
exports.js = Javascripts
exports.default = series(Clean, Views, Sass, Javascripts)

exports.dev = ()=>{
    browserSync.init({
        server:{
            baseDir: configs.dist
        }
    });

    function reload(){
        browserSync.reload();
    }
    watch(configs.src,{
        ignored:[]
    }).on('change', series(Views, Sass, Javascripts, reload))
}