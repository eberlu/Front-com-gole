const { series, src, dest, watch } = require('gulp')
,browserSync = require('browser-sync')
,clean = require('gulp-clean')
,configs = require('./config.js')
,copy = require('gulp-copy')
,sass = require('gulp-dart-sass')
,twig = require('gulp-twig')
,webpack = require('webpack-stream')

// deleta todos arquivos da dist

function Clean(){
    return src([`${configs.dist}/**/*`])    
    .pipe(clean({
        allowEmpty: true,
        force: true
    }))
}

// copia todos arquivos da pasta static para dist

function Statics() {
    return src(`${configs.static}/**`)
    .pipe(copy(configs.dist, { prefix: 1 }))
}

// compila os templates twigs exceto os arquivos que iniciarem com underline.

function Views() {
    return src(`${configs.src}/**/[^_]*.twig`)
    .pipe(twig({
        base: configs.src,
        data: { ...configs }
    }))
    .pipe(dest(configs.dist))
}

// compila os estilos SCSS minificados

function Styles() {
    return src(`${configs.src}/**/[^_]*.scss`)
    .pipe(sass({outputStyle: 'compressed'})
    .on('error', sass.logError))
    .pipe(dest(`${configs.dist}`))
}

// gera o bundle dos javascripts através do webpack

function Scripts() {
    return src(configs.jsFiles.main)
    .pipe(webpack({
        mode: configs.mode,
        entry: configs.jsFiles,
        output: {
            filename: 'js/[name].js',
        },
    }))
    .pipe(dest(configs.dist))
}

// Atualiza a janela do navegador

function reload() {
    browserSync.reload()
}

// tarefas

exports.default = series(
    Clean,
    Statics,
    Views,
    Styles,
    Scripts,
)

exports.dev = () => {

    // Sobe o dev-serv
    browserSync.init({
        open: false,
        server: {
            baseDir: configs.dist,
        }
    })

    // monitora mudanças nas views
    watch(`${configs.src}/*.twig`)
    .on('change', series(Views, reload))

    // monitora mudanças nos estilos
    watch(`${configs.src}/scss/*.scss`)
    .on('change', series(Styles, reload))

    // monitora mudanças nos scripts
    watch(`${configs.src}/js/*.js`)
    .on('change', series(Scripts, reload))
    
}