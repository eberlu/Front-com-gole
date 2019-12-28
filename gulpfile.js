const env = 'prod'

const 
{src, dest, series,watch} = require('gulp')
,clean = require('gulp-clean')
,twig = require('gulp-twig')
,named = require('vinyl-named')
,sass = require('gulp-sass')
,uglify = require('gulp-uglify-es').default
,webpackStream = require('webpack-stream')
,browserSync = require('browser-sync').create()

const configs = {
    dist: 'dist',
    src: 'src',
    views:{
        ext: '.twig',
        baseDir: 'src/views'
    },
    scss:{
        files: [ 'src/scss/main.scss' ]
    },
    javascripts:{
        files: ['src/js/layout.js','src/js/index.js']
    }
}

function Clean(){
    return src(configs.dist).pipe(clean({read:false, allowEmpty: false}));
}

function Views(){
    return new Promise((resolve,reject) => {
        src(`${configs.src}/views/**/[^_]*${configs.views.ext}`)
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
        .pipe(dest(`${configs.dist}/assets/css`))
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
        .pipe(dest('dist/assets/js'))
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
    }).on('change', series(Views,Sass, Javascripts, reload))
}