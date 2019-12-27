const env = 'dev'

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
        ext: '.twig'
    },
    scss:{
        files: [ 'src/scss/main.scss' ]
    },
    javascripts:{
        files: ['src/js/layout.js']
    }
}

function Clean(){
    return src(configs.dist).pipe(clean({read:false, allowEmpty: false}));
}

function Views(){
    return new Promise((resolve,reject) => {
        src(`${configs.src}/views/[^_]*${configs.views.ext}`)
        .pipe(twig())
        .pipe(dest(configs.dist))
        .on('error', reject)
        .on('end', resolve)
    })
}

function Sass(){
    return new Promise((resolve,reject)=>{
        src(configs.scss.files)
        .pipe(sass({sourceComments:false}).on('error', sass.logError))
        .pipe(dest(`${configs.dist}/css`))
        .on('error', reject)
        .on('end', resolve)
    })
}

function Javascripts(){
    return new Promise((resolve,reject)=>{
        let fileStream = src(configs.javascripts.files)
        .pipe(named())
        .pipe(webpackStream())

        if(env == 'prod') fileStream = fileStream.pipe(uglify())
        
        fileStream.pipe(dest('dist/js'))
        .on('error', reject)
        .on('end', resolve)
    })
}

const watchers = {
    js:{
        dir:'./src/js/**/*.js',
        fn: Javascripts
    },
    sass: {
        dir: './src/scss/**/*.scss',
        fn: Sass
    },
    views: {
        dir: './src/views/**/*.twig',
        fn: Views
    }
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

    for( let watcher in watchers ){
        let wAtual = watchers[watcher]
        watch(wAtual.dir).on('change',()=>{
            if(wAtual.fn) wAtual.fn().then(done => browserSync.reload())
            else browserSync.reload()
        })
    }
}